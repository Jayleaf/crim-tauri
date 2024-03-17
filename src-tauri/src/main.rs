// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod generics;
mod user;
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use tokio::runtime::Runtime;
use crate::user::{login::login, register::register, get::get};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command



#[tauri::command]
fn login_f(username: &str, password: &str, app_handle: tauri::AppHandle) -> u16
{
    println!("ran!");
    let rt: Runtime = tokio::runtime::Runtime::new().unwrap();
    let res: StatusCode = rt.block_on(login(username, password, app_handle.clone()));
    res.try_into().unwrap()
}

#[tauri::command]
fn register_f(username: &str, password: &str) -> String
{
    let rt: Runtime = tokio::runtime::Runtime::new().unwrap();
    let res: String = rt.block_on(register(username, password));
    res
}

#[tauri::command]
fn get_f(sid: &str, app_handle: tauri::AppHandle) -> u16
{
    println!("ran!");
    let rt: Runtime = tokio::runtime::Runtime::new().unwrap();
    let res: u16 = rt.block_on(get(sid, app_handle.clone()));
    res
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![register_f, login_f, get_f])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
