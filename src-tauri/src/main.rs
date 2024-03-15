// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod structs;
use structs::structs::ClientAccount;
use reqwest;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command(rename_all = "snake_case")]
fn login(username: &str, password: &str) -> String 
{
    println!("ran!");
    let rt = tokio::runtime::Runtime::new().unwrap();
    let res: String = rt.block_on(login_def(username, password));
    res
}

#[tauri::command(rename_all = "snake_case")]
fn login2(username: &str, password: &str) -> String 
{
    println!("ran!");
    let rt = tokio::runtime::Runtime::new().unwrap();
    let res: String = rt.block_on(login_def(username, password));
    res
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

async fn login_def(username: &str, password: &str) -> String 
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
        if res.as_ref().is_err()
        {
            return "Error logging in.".to_string()
        }
        println!("Status: {:?}", res.as_ref().unwrap().status());
        if res.as_ref().unwrap().status().is_success()
        {
            println!("{:?}", res.unwrap().text().await.unwrap());
            
            "Logged in.".to_string()
        }
        else
        {
            "Error".to_string()
        }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![register])
        .invoke_handler(tauri::generate_handler![login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
