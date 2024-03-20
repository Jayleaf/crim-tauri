// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod generics;
mod user;
mod messaging;
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use tokio::runtime::Runtime;
use crate::{generics::enums::FriendAction, user::{get::get, login::login, register::register, update_friend::update_friend}};

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![register_f, login_f, get_f, add_friend_f])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
