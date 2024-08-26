use std::{path::PathBuf, sync::{Arc, Mutex}};

use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use rsa::{self, pkcs8::DecodePrivateKey, Pkcs1v15Encrypt};
use aes_gcm::{ aead::{Aead, AeadCore, KeyInit, OsRng, generic_array}, Aes256Gcm };

use super::generics::{structs::{ClientAccount, EncryptedMessage, UserKey, Conversation}, utils};


// tells the client to recieve a message from the server.
pub async fn recieve(mut message: EncryptedMessage, app_handle: tauri::AppHandle) -> Result<(), String>
{
    let mut account: ClientAccount = utils::get_client_account(&app_handle);
    let key: UserKey = account.conversations.iter().find(|x| x.id == message.dest_convo_id).unwrap().clone().keys.iter().find(|x| x.owner == account.username).unwrap().clone();

    // get conversation key
    let key = utils::get_convo_key(key); // conversation keys are also 32 bytes.

    // decrypt message
    let decrypted_message = Aes256Gcm::new(&key).decrypt(&generic_array::GenericArray::clone_from_slice(message.nonce.as_slice()), message.data.as_slice()).unwrap();
    println!("{:#?}: {:#?}", String::from_utf8(decrypted_message.clone()).unwrap().as_str(), &decrypted_message);
    message.data = decrypted_message;

    // push this message to the conversation
    let convo = &mut account.conversations.iter_mut().find(|x| x.id == message.dest_convo_id).unwrap();
    convo.messages.push(message.clone());


    // update the store
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".data.tmp");
    let json_data = serde_json::to_value(&account).unwrap();
    with_store(app_handle.clone(), stores, path, |store| store.insert("userdata".to_string(), json_data)).expect("failed to write");

    utils::update_store(app_handle.clone());

    Ok(())
}
