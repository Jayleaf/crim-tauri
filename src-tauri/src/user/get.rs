use super::generics::structs::ClientAccount;
use std::path::PathBuf;
use reqwest;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use rsa::{self, pkcs8::DecodePrivateKey, Pkcs1v15Encrypt};
use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng, generic_array},
    Aes256Gcm, Key // Or `Aes128Gcm`
};

/// This struct is also found in get.rs in the API.

/// Gets user's data from the server. Requires a session id.
pub async fn get(session_id: &str, app_handle: tauri::AppHandle) -> u16
{
    let client = reqwest::Client::new();
    let res = client.get(format!("http://localhost:3000/api/auth/get/{}", session_id))
        .send()
        .await;
    if res.as_ref().is_err()
    {
        println!("Error getting basic user data.");
        return res.as_ref().unwrap().status().as_u16();
    }
    let status = res.as_ref().unwrap().status();
    if status.is_success()
    {
        println!("Got basic user data.");
        let mut result: ClientAccount = serde_json::from_str(&res.unwrap().text().await.unwrap()).expect("failed to parse userr data");
        result.session_id = session_id.to_string();
        // now, we have to decrypt each message in each conversation with our private key.
        for conversation in result.conversations.iter_mut()
        {
            let key = conversation.keys.iter().find(|k| k.owner == result.username).unwrap();
            let private_key = rsa::RsaPrivateKey::from_pkcs8_pem(&String::from_utf8(std::fs::read(".pkey.key").unwrap()).unwrap()).unwrap();
            let mut decrypted_convo_key = private_key.decrypt(Pkcs1v15Encrypt, &key.key).expect("Failed to decrypt convo key");
            decrypted_convo_key.retain(|&x| x != 0_u8);
            let key = Key::<Aes256Gcm>::from_slice(&decrypted_convo_key); // conversation keys are also 32 bytes.
            for message in conversation.messages.iter_mut()
            {
                let decrypted_message = Aes256Gcm::new(&key).decrypt(&generic_array::GenericArray::clone_from_slice(message.nonce.as_slice()), message.data.as_slice()).unwrap();
                println!("{:#?}: {:#?}", String::from_utf8(decrypted_message.clone()).unwrap().as_str(), &decrypted_message);
                message.data = decrypted_message;
            }
        }
        let stores = app_handle.state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".data.tmp");
        with_store(app_handle.clone(), stores, path, |store| 
        {
            store.insert("userdata".to_string(), serde_json::to_value(&result).unwrap())
        }).expect("failed to write");
    }

    return status.as_u16();

}