// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod generics;
mod user;
mod messaging;
use std::path::PathBuf;
use messaging::send;
use openssl::{rsa::Padding, symm};
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use tokio::runtime::Runtime;
use crate::{generics::enums::FriendAction, messaging::send::send, user::{get::get, login::login, register::register, update_friend::update_friend}};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command



#[tauri::command]
async fn login_f(username: &str, password: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let res: StatusCode = login(username, password, app_handle.clone()).await;
    Ok(res.as_u16())
}

#[tauri::command]
async fn register_f(username: &str, password: &str) -> Result<String, ()>
{
    let res: String = register(username, password).await;
    Ok(res)
}

#[tauri::command]
async fn get_f(sid: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let res: u16 = get(sid, app_handle.clone()).await;
    Ok(res)
}

#[tauri::command]
async fn add_friend_f(target: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let res: u16 = update_friend(target, FriendAction::Add, app_handle.clone()).await.as_u16();
    Ok(res)
}



#[tauri::command(rename_all = "snake_case")]
async fn send_message_f(message: &str, time: &str, target_convo_id: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let account: generics::structs::ClientAccount = generics::utils::get_client_account(app_handle.clone());
    let key = account.conversations.iter().find(|x| x.id == target_convo_id).unwrap().keys.iter().find(|x| x.owner == account.username).unwrap();

    // get conversation key and decrypt it
    let cipher: symm::Cipher = symm::Cipher::aes_256_cbc();
    let private_key: openssl::rsa::Rsa<openssl::pkey::Private> = openssl::rsa::Rsa::private_key_from_pem(std::fs::read(".pkey.key").unwrap().as_ref()).unwrap();
    let mut decrypted_convo_key: Vec<u8> = vec![0; private_key.size() as usize];
    private_key.private_decrypt(&key.key, &mut decrypted_convo_key, Padding::PKCS1).expect("Failed to decrypt convo key");
    decrypted_convo_key.retain(|&x| x != 0_u8); 

    // declare rawmessage
    let message: generics::structs::RawMessage = generics::structs::RawMessage
    {
        message: message.to_string().into_bytes(),
        sender: account.username,
        time: time.to_string()
    };

    println!("Message: {:?}", message);
    // encrypt serialized rawmessage
    let serialized_message: String = serde_json::to_string(&message).unwrap();
    let encrypted_message: Vec<u8> = symm::encrypt(cipher, &decrypted_convo_key, None, serialized_message.as_bytes()).unwrap();
    let emessage: generics::structs::EncryptedMessage = generics::structs::EncryptedMessage
    {
        data: encrypted_message,
        sender: message.sender, // this is filled out by the server.
        dest_convo_id: target_convo_id.to_string(), // again, validated by the server, but has to be provided.
        sender_sid: account.session_id
    };
    let res: u16 = send(emessage, app_handle.clone()).await;
    Ok(res)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![register_f, login_f, get_f, add_friend_f, send_message_f])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
