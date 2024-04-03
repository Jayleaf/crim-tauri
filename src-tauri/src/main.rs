// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod generics;
mod user;
mod messaging;
use std::sync::{Arc, Mutex};
use generics::structs::{UpdateAction, WSPacket, WSAction};
use tauri::Manager;
use user::{friends::{add_friend::add_friend, decline_friend_request::decline_friend_request, remove_friend::remove_friend}, get::get, login::login, logout::logout, register::register, update::update};
use tokio::sync::mpsc;
use tokio_tungstenite::connect_async;
use tungstenite::protocol::Message;
use reqwest::{redirect::Action, StatusCode};
use futures::{StreamExt, future, pin_mut, SinkExt};
use once_cell::sync::OnceCell;
mod websockets;

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
    println!("Getting user data.");
    let res: u16 = get(sid, app_handle.clone()).await;
    Ok(res)
}

#[tauri::command]
async fn add_remove_friend(action: &str, friend: &str, app_handle: tauri::AppHandle) -> Result<(), ()>
{
    match action 
    {
        "add" => {return add_friend(friend, app_handle).await.map_err(|e| panic!("{e}")) },
        "remove" =>{ return remove_friend(friend, app_handle).await.map_err(|e| panic!("{e}")) },
        _ => return Err(())
    }
}

#[tauri::command]
async fn decline_friend_request_f(name: &str, app_handle: tauri::AppHandle) -> Result<(), ()>
{
    decline_friend_request(name, app_handle).await.map_err(|e| panic!("{e}"))
}

#[tauri::command]
async fn logout_f(app_handle: tauri::AppHandle)
{
    logout(app_handle).await;
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
            let packet = serde_json::from_str::<WSPacket>(msg.into_text().unwrap().as_ref()).expect("Failed to parse packet.");
            println!("Received packet: {:?}", packet);
            let handle_instance: tauri::AppHandle = INSTANCE.get().unwrap().clone();
            match packet.action
            {
                WSAction::ReceiveArbitraryInfo(x, y) => websockets::parse_arbitrary::parse_arbitrary_packet((x, y), handle_instance).await.map_err(|e| panic!("{e}")).ok().unwrap(),
                WSAction::ReceiveMessage(message) => messaging::receive::recieve(message, handle_instance).await.map_err(|e| panic!("{e}")).ok().unwrap(),
                WSAction::Info(data) => handle_instance.emit_all("infotoast", data).map_err(|e| panic!("{e}")).ok().unwrap(),
               _ => {println!("Received unknown packet: {:?}", packet);}
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
        .invoke_handler(tauri::generate_handler![register_f, login_f, get_f, add_remove_friend, decline_friend_request_f, send_message_f, logout_f])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    
    
    // futures
    pin_mut!(send_task, recv_task);
    future::select(send_task, recv_task).await;


}

