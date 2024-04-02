use std::{path::PathBuf, sync::{Arc, Mutex}};

use openssl::{pkey::Private, rsa::{Padding, Rsa}, symm};
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use super::generics::{structs::{ClientAccount, EncryptedMessage, UserKey, Conversation}, utils};


// tells the client to recieve a message from the server.
pub async fn recieve(mut message: EncryptedMessage, app_handle: tauri::AppHandle) -> Result<(), String>
{
    let mut account: ClientAccount = utils::get_client_account(&app_handle);
    let key: UserKey = account.conversations.iter().find(|x| x.id == message.dest_convo_id).unwrap().clone().keys.iter().find(|x| x.owner == account.username).unwrap().clone();

    // get conversation key and decrypt it
    let cipher: symm::Cipher = symm::Cipher::aes_256_cbc();
    let private_key: Rsa<Private> = Rsa::private_key_from_pem(std::fs::read(".pkey.key").unwrap().as_ref()).unwrap();
    let mut decrypted_convo_key: Vec<u8> = vec![0; private_key.size() as usize];
    private_key.private_decrypt(&key.key, &mut decrypted_convo_key, Padding::PKCS1).map_err(|e| e.to_string())?;
    decrypted_convo_key.retain(|&x| x != 0_u8);

    // decrypt message
    message.data = symm::decrypt(cipher, &decrypted_convo_key, None, &message.data).map_err(|e| e.to_string())?; // decrypt the message

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
