use std::path::PathBuf;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use crate::generics::structs::Conversation;

use super::generics::{utils, structs::WSAction};
pub async fn parse_arbitrary_packet((x, y): (String, u16), app_handle: tauri::AppHandle) -> Result<(), String> {
    
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".data.tmp");
    let mut data = utils::get_client_account(&app_handle);
    match &y
    {
        1 =>  // bulk conversation update
        { 
            
            let Ok(conversations) = serde_json::from_str(&x)
            else { return Err(String::from("Error converting action to conversation.")) };
            data.conversations = conversations;
        }
        2 => // single conversation update
        {
            let Ok(conversation) = serde_json::from_str(&x)
            else { return Err(String::from("Error converting action to conversation.")) };
            data.conversations.push(conversation);
        },
        3 => // add a new friend and update conversation
        {
            let Ok(convo) = serde_json::from_str::<Conversation>(&x)
            else { return Err(String::from("Error converting action to friend")) };
            data.friends.push(convo.users.iter().find(|x| *x != &data.username).unwrap().to_string());
            data.conversations.push(convo);
        },
        4 => // remove a friend
        {
            let Ok(friend) = serde_json::from_str::<String>(&x)
            else { return Err(String::from("Error converting action to friend")) };
            data.friends.retain(|x| x != &friend);
        },
        _ => return Err(String::from("Invalid action."))
    }

    with_store(app_handle.clone(), stores, path, |store| store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()))).expect("failed to write");
    Ok(())
}
