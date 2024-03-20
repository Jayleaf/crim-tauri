use super::generics::{utils, enums::FriendAction, structs::ClientAccount};

use std::path::PathBuf;
use openssl::asn1::Asn1Object;
use reqwest::{self, Client, StatusCode};
use tauri::{Wry, Manager};
use tauri_plugin_store::{with_store, StoreCollection};

/// Updates friend values for a user's database account.
/// 
/// 
/// 
/// ## Arguments
/// * [`sid`][std::string::String] - The session id of the user.
/// * [`target`][std::string::String] - The "target" friend of this action. 
/// * [`action`][super::generics::enums::FriendAction] - The action to perform on `target`.
/// * [`app_handle`][tauri::AppHandle] - Handle to the tauri app.
/// 
/// ## Returns
/// * [`StatusCode`][reqwest::StatusCode] - The status code of the request.
/// 
pub async fn update_friend(target: &str, action: FriendAction, app_handle: tauri::AppHandle) -> StatusCode 
{
    // get the serialized ClientAccount from local storage
    let mut account: ClientAccount = 
    {
        with_store(app_handle.clone(), app_handle.state::<StoreCollection<Wry>>(), PathBuf::from(".data.tmp"), |store| 
        {
                let data: &serde_json::Value = store.get("userdata")
                    .unwrap();
                println!("data: {:?}", data);
                let deserialized: ClientAccount =
                {
                    if data.as_str().is_none()
                    {
                        serde_json::from_value(data.clone()).unwrap()
                    }
                    else
                    {
                        serde_json::from_str(data.as_str().unwrap()).unwrap()
                    }
                };
            Ok(deserialized)
        }).unwrap()
    };
    println!("Account: {:?}", account);
    match action
    {
        FriendAction::Add => 
        {
            if account.friends.contains(&target.to_string())
            {
                return StatusCode::BAD_REQUEST;
            }
            account.friends.push(format!("T_{}", target))
        }
        FriendAction::Remove =>
        {
            let index = account.friends.iter().position(|x| x == target).unwrap();
            let _ = std::mem::replace(&mut account.friends[index], format!("T_{}", target));
        }
            
    }
    let json: String = serde_json::to_string(&account).unwrap();
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:3000/api/auth/update")
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
        let data: ClientAccount = res.unwrap().json().await.unwrap();
        let stores = app_handle.state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".data.tmp");

        let json_data = serde_json::to_value(&data).unwrap();
        with_store(app_handle.clone(), stores, path, |store| store.insert("userdata".to_string(), json_data)).expect("failed to write");
        
    }
    utils::update_store(app_handle.clone());
    status
}