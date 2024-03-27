use super::generics::{utils, structs::{ClientAccount, Conversation}};
use std::path::PathBuf;
use openssl::{rsa::Padding, symm};
use reqwest::{self, StatusCode};
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

/// This struct is also found in get.rs in the API.

/// Gets user's data from the server. Requires a session id.
pub async fn get(session_id: &str, app_handle: tauri::AppHandle) -> u16
{
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:3000/api/auth/get")
        .body(session_id.to_string())
        .send()
        .await;
    if res.as_ref().is_err()
    {
        println!("Error getting basic user data.");
        return res.as_ref().unwrap().status().as_u16();
    }
    let status = res.as_ref().unwrap().status();
    if status.is_success()
    {
        let mut result: ClientAccount = res.unwrap().json().await.unwrap();
        result.session_id = session_id.to_string();
        let stores = app_handle.state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".data.tmp");
        with_store(app_handle.clone(), stores, path, |store| 
        {
            store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&result).unwrap()))
        }).expect("failed to write");
    }

    return status.as_u16();

}