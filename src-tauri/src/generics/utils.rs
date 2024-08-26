use std::path::PathBuf;

use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use super::structs::{ClientAccount, UserKey};
use rsa::{self, pkcs8::DecodePrivateKey, Pkcs1v15Encrypt};
use aes_gcm::{ Aes256Gcm, Key };
/// refreshes client-side store data
pub fn update_store(app_handle: tauri::AppHandle)
{
    app_handle.emit_all("update", ()).expect("Failed to refresh client-side store data.")
}

pub fn get_client_account(app_handle: &tauri::AppHandle) -> ClientAccount
{
    let account: ClientAccount = 
    {
        with_store(app_handle.to_owned(), app_handle.state::<StoreCollection<Wry>>(), PathBuf::from(".data.tmp"), |store| 
        {
                let data: &serde_json::Value = store.get("userdata")
                    .unwrap();
                let deserialized: ClientAccount =
                {
                    match data.as_str()
                    {
                        Some(s) => serde_json::from_str(s).unwrap(),
                        None => serde_json::from_value(data.clone()).unwrap()
                    }
                };
            Ok(deserialized)
        }).unwrap()
    };
    account
}

pub fn get_convo_key(key: UserKey) -> Key::<Aes256Gcm> {
    let private_key = rsa::RsaPrivateKey::from_pkcs8_pem(&String::from_utf8(std::fs::read(".pkey.key").unwrap()).unwrap()).unwrap();
    let mut decrypted_convo_key = private_key.decrypt(Pkcs1v15Encrypt, &key.key).expect("Failed to decrypt convo key");
    decrypted_convo_key.retain(|&x| x != 0_u8);
    let key = Key::<Aes256Gcm>::from_slice(&decrypted_convo_key); // conversation keys are also 32 bytes.
    return *key;
}