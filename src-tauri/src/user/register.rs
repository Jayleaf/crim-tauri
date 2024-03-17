use super::generics::structs::ClientAccount;
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{async_runtime::handle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

pub async fn register(username: &str, password: &str) -> String
{
    let account: ClientAccount = ClientAccount
    {
        username: username.to_string(),
        password: password.to_string(),
        friends: vec![],
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