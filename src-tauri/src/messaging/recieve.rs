use super::generics::structs::{ClientAccount, Conversation};
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use openssl::{rsa::Padding, symm};

/// Gets all of a user's conversations from the db. Intended to be ran in tandem with get.rs.
/// This is it's own function and not included in get.rs because this has to run much more frequently, and there's no need to refresh every ounce of information.
pub async fn recieve(app_handle: tauri::AppHandle) -> u16
{
    println!("hi retrieving messagse!!! :)");
    let client = reqwest::Client::new();
    // get the serialized ClientAccount from local storage
    let mut account: ClientAccount = 
    {
        with_store(app_handle.clone(), app_handle.state::<StoreCollection<Wry>>(), PathBuf::from(".data.tmp"), |store| 
        {
            let data: &serde_json::Value = store.get("userdata")
                .unwrap();
            Ok(serde_json::from_str::<ClientAccount>(data.as_str().unwrap()).unwrap())
        }).unwrap()
    };
    println!("Account: {:?}", account);
    let res = client.post("http://localhost:3000/api/message/recieve")
        .body(serde_json::to_string(&account).unwrap())
        .send()
        .await;
    println!("res: {:?}", res.as_ref());
    if res.as_ref().is_err()
    {
        println!("{:?}", res.as_ref());
        return res.as_ref().unwrap().status().as_u16();
    }
    let status = res.as_ref().unwrap().status();
    if status.is_success()
    {
        println!("success!");
        let result: Vec<Conversation> = {
        // now, we have to decrypt each message in each conversation with our private key.
        let mut res: Vec<Conversation> = res.unwrap().json().await.unwrap();
        for conversation in res.iter_mut()
        {
            let cipher: symm::Cipher = symm::Cipher::aes_256_cbc();
            let key = conversation.keys.iter().find(|k| k.owner == account.username).unwrap();
            let private_key = openssl::rsa::Rsa::private_key_from_pem(std::fs::read(".pkey.key").unwrap().as_ref()).unwrap();
            let mut decrypted_convo_key: Vec<u8> = vec![0; private_key.size() as usize];
            private_key.private_decrypt(&key.key, &mut decrypted_convo_key, Padding::PKCS1).expect("Failed to decrypt convo key");
            decrypted_convo_key.retain(|&x| x != 0_u8); 
            for message in conversation.messages.iter_mut()
            {
                let decrypted_message = symm::decrypt(cipher, &decrypted_convo_key, None, &message.data).unwrap();
                println!("{:#?}: {:#?}", String::from_utf8(decrypted_message.clone()).unwrap().as_str(), &decrypted_message);
                message.data = decrypted_message;
            }
        }
        res
    };
        account.conversations = result;
        let stores = app_handle.state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".data.tmp");
        with_store(app_handle.clone(), stores, path, |store| 
        {
            store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&account).unwrap()))
        }).expect("failed to write");
    }
    return status.as_u16();

}