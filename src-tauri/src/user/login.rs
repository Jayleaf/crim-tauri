use crate::generics::structs::Tx;

/// Logs a user in. Takes in a username and password, sends it to the api, and if the server approves it, it'll spit back a session id we can use.
use super::generics::structs::{ClientAccount, WSPacket, WSAction};
use std::{io::Write, path::PathBuf};
use reqwest::{self, StatusCode};
use tauri::{Manager, Wry};
use argon2::{self, Config};
use tauri_plugin_store::{with_store, StoreCollection};
use rsa::{pkcs8::{DecodePrivateKey, EncodePrivateKey, EncodePublicKey}, RsaPrivateKey, RsaPublicKey};
use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng, generic_array},
    Aes256Gcm, Nonce, Key // Or `Aes128Gcm`
};

pub async fn login(username: &str, password: &str, app_handle: tauri::AppHandle) -> StatusCode 
{
    println!("ran!");
    println!("{}", format!("username: {}, password: {}", username, password));
    format!("username: {}, password: {}", username, password);
    let account: ClientAccount = ClientAccount
    {
        username: username.to_string(),
        password: password.to_string(),
        friends: vec![],
        conversations: vec![],
        friend_requests: vec![],
        session_id: "".to_string(),
    };

    let json: String = serde_json::to_string(&account).unwrap();
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:3000/api/auth/login")
        .body(json)
        .send()
        .await;
    if res.as_ref().is_err() { return StatusCode::INTERNAL_SERVER_ERROR; }
    let status = res.as_ref().unwrap().status();
    println!("Status: {:?}", status);

    if status != StatusCode::OK { return status }  
        
    // |PRIVATEKEY:| is the separator between SID and encrypted private key, as is shown in `login.rs` in `crim-api`.
    let data: Vec<String> = res.unwrap().text().await.unwrap().clone().split("|||").map(|s| s.to_string()).collect();
    println!("{:#?}", data);
    let session_id: &String = &data[0];
    let config = Config::default();
    let priv_key_enc: Vec<u8> = data[1].split(",").map(|x| x.parse::<u8>().unwrap()).collect::<Vec<u8>>();
    let nonce: Vec<u8> = data[2].split(",").map(|x| x.parse::<u8>().unwrap()).collect::<Vec<u8>>();
    //println!("{:#?}", priv_key_enc);
    let hash: Vec<u8> = argon2::hash_raw(account.password.as_bytes(), b"00000000", &config).unwrap();
    // ^^ private key is encrypted with a hashed password (non-random salt), so we have to re-hash it to decrypt the private key.
    let key = Key::<Aes256Gcm>::from_slice(&hash); // argon2 hashes are conveniently 32 bytes by default
    println!("{:#?}", key);
    let private_key = Aes256Gcm::new(&key).decrypt(&generic_array::GenericArray::clone_from_slice(nonce.as_slice()), priv_key_enc.as_slice()).unwrap();
    
        
    // store private key in pkey.key file
    let path = PathBuf::from(".pkey.key");
    let mut file = std::fs::File::create(path).unwrap();
    file.write_all(&private_key).unwrap();

    // store session id in .data.tmp file
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".data.tmp");

    with_store(app_handle.clone(), stores, path, |store| store.insert("sid".to_string(), serde_json::Value::String(session_id.clone()))).expect("failed to write");
    println!("Session id: {}", session_id);

    // send registration packet to websocket

    let tx = app_handle.state::<Tx>().lock().unwrap().clone();
    let packet = WSPacket
    {
        sender: account.username.clone(),
        sid: session_id.clone(),
        action: WSAction::Register()
    };
    tx.send(packet).await.unwrap();
    status
}