use crate::generics::structs::UpdateAction;
use super::generics::{utils, structs::{ClientAccount, UpdateUser}};
use std::path::PathBuf;
use reqwest::{self, StatusCode};
use tauri::{Wry, Manager};
use tauri_plugin_store::{with_store, StoreCollection};

/// Updates values for a user's database account.
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
pub async fn update(action: UpdateAction, data: &str, app_handle: tauri::AppHandle) -> StatusCode 
{
    // get the serialized ClientAccount from local storage
    let account: ClientAccount = utils::get_client_account(&app_handle);
    let update_val: UpdateUser = UpdateUser
    {
        data: data.to_string(), 
        action,
        session_id: account.session_id.clone()
    };
    
    let json: String = serde_json::to_string(&update_val).unwrap();
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:3000/api/auth/update")
        .body(json)
        .send()
        .await;

    let status = res.as_ref().unwrap().status();
    let text = res.unwrap().text().await.unwrap();
    println!("{:?} || {}", &status, &text);

    if status != StatusCode::OK { return status }

    let Ok(data) = serde_json::from_str::<ClientAccount>(&text)
    else { return StatusCode::INTERNAL_SERVER_ERROR };

    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".data.tmp");

    let json_data = serde_json::to_value(&data).unwrap();
    with_store(app_handle.clone(), stores, path, |store| store.insert("userdata".to_string(), json_data)).expect("failed to write");
        
    utils::update_store(app_handle.clone());
    status
}