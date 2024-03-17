/// Logs a user in. Takes in a username and password, sends it to the api, and if the server approves it, it'll spit back a session id we can use.
use super::generics::structs::ClientAccount;
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

pub async fn login(username: &str, password: &str, app_handle: tauri::AppHandle) -> StatusCode 
{
    println!("ran!");
    println!("{}", format!("username: {}, password: {}", username, password));
    format!("username: {}, password: {}", username, password);
    let account: ClientAccount = ClientAccount
    {
        username: username.to_string(),
        password: password.to_string(),
        friends: vec![],
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

        with_store(app_handle.clone(), stores, path, |store| store.insert("sid".to_string(), serde_json::Value::String(session_id.clone()))).expect("failed to write");
        println!("Session id: {}", session_id);
        
    }
    status
}