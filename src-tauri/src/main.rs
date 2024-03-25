// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod generics;
mod user;
mod messaging;
use std::{ptr::null, sync::{Arc, Mutex}};
use generics::structs::{ClientAccount, Conversation, EncryptedMessage, RawMessage, UpdateAction, Tx, WSPacket, WSAction};
use user::{register::register, login::login, get::get, update::update};
use openssl::{rsa::Padding, symm};
use tokio::sync::mpsc;
use tokio_tungstenite::connect_async;
use tungstenite::protocol::Message;
use reqwest::StatusCode;
use futures::{StreamExt, future, pin_mut, SinkExt};
use tauri::{Manager, State};
use once_cell::sync::OnceCell;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

static INSTANCE: OnceCell<tauri::AppHandle> = OnceCell::new();


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
async fn update_f(action: &str, data: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let action: UpdateAction = match action
    {
        "AddFriend" => UpdateAction::AddFriend,
        "RemoveFriend" => UpdateAction::RemoveFriend,
        "ChangePassword" => UpdateAction::ChangePassword,
        "ChangeUsername" => UpdateAction::ChangeUsername,
        _ => { return Ok(400) }
    };

    let res: u16 = update(action, data, app_handle.clone()).await.as_u16();
    Ok(res)
}



#[tauri::command(rename_all = "snake_case")]
async fn send_message_f(message: &str, time: &str, target_convo_id: &str, app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    let res = messaging::send::send(message, time, target_convo_id, app_handle.clone()).await;
    Ok(0)
}

#[tokio::main]
async fn main() {
    // set up the websocket

    let (tx, mut rx) = mpsc::channel::<WSPacket>(100);
    let url = "ws://localhost:3000/api/ws"; // i don't want to set up TLS in a dev environment
    let (ws_stream, _) = connect_async(url).await.expect("Failed to connect to websocket.");
    println!("Connected to websocket.");
    let (mut write, mut read) = ws_stream.split();

    let send_task = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            let packet = serde_json::to_string(&msg).unwrap();
            if write.send(Message::Text(packet)).await.is_err()
            {
                println!("Failed to send message");
                return;
            }
            println!("Sent message: {:?}", msg)
        }
    });

    let recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = read.next().await {
            let Ok(packet) = serde_json::from_str::<WSPacket>(&msg.to_string())
            else { println!("Failed to parse packet: {:?}", msg); continue; };
            match packet.action
            {
                WSAction::ReceiveMessage(message) => messaging::receive::recieve(message, INSTANCE.get().unwrap().clone()).await,
               _ => { println!("Received unknown packet: {:?}", packet) }
            }
        }
    });

    // set up tauri
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(tx)))
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            INSTANCE.set(app.handle().clone()).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![register_f, login_f, get_f, update_f, send_message_f])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    
    
    // futures
    pin_mut!(send_task, recv_task);
    future::select(send_task, recv_task).await;


}

