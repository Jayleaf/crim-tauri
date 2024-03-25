use std::path::PathBuf;

use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use super::structs::ClientAccount;

/// refreshes client-side store data
pub fn update_store(app_handle: tauri::AppHandle)
{
    app_handle.emit_all("update", ()).expect("Failed to refresh client-side store data.")
}

pub fn get_client_account(app_handle: tauri::AppHandle) -> ClientAccount
{
    let account: ClientAccount = 
    {
        with_store(app_handle.clone(), app_handle.state::<StoreCollection<Wry>>(), PathBuf::from(".data.tmp"), |store| 
        {
                let data: &serde_json::Value = store.get("userdata")
                    .unwrap();
                let deserialized: ClientAccount =
                {
                    match data.as_str()
                    {
                        Some(s) => serde_json::from_str(s).unwrap(),
                        None => serde_json::from_value(data.clone()).unwrap()
                    }
                };
            Ok(deserialized)
        }).unwrap()
    };
    account
}