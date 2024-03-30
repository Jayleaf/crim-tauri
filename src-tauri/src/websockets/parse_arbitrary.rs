use std::path::PathBuf;
use reqwest::redirect::Action;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use crate::generics::structs::Conversation;

use super::generics::{utils, structs::{WSPacket, WSAction}};
pub async fn parse_arbitrary_packet(action: WSAction, app_handle: tauri::AppHandle) -> Result<u16, String> {
    let WSAction::RecieveArbitraryInfo(x, y) = action
    else { panic!("parse_arbitrary_packet was called on a packet that was not of type WSAction::RecieveArbitraryInfo") };
    
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".data.tmp");
    match str::parse::<u16>(&y).map_err(|_| "Failed to parse action.")?
    {
        1 =>  // bulk conversation update
        { 
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(conversations) = serde_json::from_str(&x)
            else { return Err(String::from("Error converting action to conversation.")) };
            data.conversations = conversations;
            with_store(app_handle.clone(), stores, path, |store| store.insert("sid".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()))).expect("failed to write");
            Ok(200)
        }
        2 => // single conversation update
        {
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(conversation) = serde_json::from_str(&x)
            else { return Err(String::from("Error converting action to conversation.")) };
            data.conversations.push(conversation);
            with_store(app_handle.clone(), stores, path, |store| store.insert("sid".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()))).expect("failed to write");
            Ok(200)
        },
        3 => // add a new friend and update conversation
        {
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(convo) = serde_json::from_str::<Conversation>(&x)
            else { return Err(String::from("Error converting action to friend")) };
            data.friends.push(convo.users.iter().find(|x| *x != &data.username).unwrap().to_string());
            data.conversations.push(convo);
            with_store(app_handle.clone(), stores, path, |store| store.insert("sid".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()))).expect("failed to write");
            Ok(200)
        },
        _ => Err(String::from("Invalid action."))
    }
}
