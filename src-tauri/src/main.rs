// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod structs;
use std::path::PathBuf;
use structs::structs::ClientAccount;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command(rename_all = "snake_case")]
fn login(username: &str, password: &str, app_handle: tauri::AppHandle) -> u16
{
    println!("ran!");
    let rt = tokio::runtime::Runtime::new().unwrap();
    let res: StatusCode = rt.block_on(login_def(username, password, app_handle.clone()));
    res.try_into().unwrap()
}

#[tauri::command(rename_all = "snake_case")]
fn register(username: &str, password: &str) -> String
{
    let rt = tokio::runtime::Runtime::new().unwrap();
    let res: String = rt.block_on(register_def(username, password));
    res
}

async fn register_def(username: &str, password: &str) -> String
{
    let account: ClientAccount = ClientAccount
    {
        username: username.to_string(),
        password: password.to_string(),
        session_id: "".to_string(),
    };

    let json: String = serde_json::to_string(&account).unwrap();
        let client = reqwest::Client::new();
        let res = client.post("http://localhost:3000/api/auth/create")
            .body(json)
            .send()
            .await;
        if res.as_ref().is_err()
        {
            return "Error registering.".to_string()
        }
        println!("Status: {:?}", res.as_ref().unwrap().status());
        if res.as_ref().unwrap().status().is_success()
        {
            println!("{:?}", res.unwrap().text().await.unwrap());
            "Registered.".to_string()
        }
        else
        {
            "Error".to_string()
        }
}

async fn login_def(username: &str, password: &str, app_handle: tauri::AppHandle) -> StatusCode 
{
    println!("ran!");
    println!("{}", format!("username: {}, password: {}", username, password));
    format!("username: {}, password: {}", username, password);
    let account: ClientAccount = ClientAccount
    {
        username: username.to_string(),
        password: password.to_string(),
        session_id: "".to_string(),
    };

    let json: String = serde_json::to_string(&account).unwrap();
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:3000/api/auth/login")
        .body(json)
        .send()
        .await;
    if res.as_ref().is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR;
    }
    let status = res.as_ref().unwrap().status();
    println!("Status: {:?}", status);
    if status == StatusCode::OK 
    {
        let session_id: String = res.unwrap().text().await.unwrap().clone();
        let stores = app_handle.state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".data.tmp");

        with_store(app_handle.clone(), stores, path, |store| store.insert("session_id".to_string(), serde_json::Value::String(session_id))).expect("failed to write");
        
        
    }
    status
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![register])
        .invoke_handler(tauri::generate_handler![login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
