use std::path::PathBuf;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use crate::generics::structs::{Conversation, FriendRequest};

use super::generics::{utils, structs::WSAction};
pub async fn parse_arbitrary_packet((x, y): (String, u8), app_handle: tauri::AppHandle) -> Result<(), String> {
    
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
            data.friends.retain(|y| y != &x);
        },
        5 => // add a friend request
        {
            let Ok(req) = serde_json::from_str::<FriendRequest>(&x)
            else { return Err(String::from("Error converting action to friend request")) };
            data.friend_requests.push(req);
        },
        6 => // remove a friend request
        {
            let Ok(req) = serde_json::from_str::<FriendRequest>(&x)
            else { return Err(String::from("Error converting action to friend request")) };
            data.friend_requests.retain(|y| y.sender != req.sender && y.receiver != req.receiver);
        },
        7 => // add a friend, and remove friend request
        {
            let Ok(req) = serde_json::from_str::<FriendRequest>(&x)
            else { return Err(String::from("Error converting action to friend request")) };
            data.friend_requests.retain(|y| y.sender != req.sender && y.receiver != req.receiver);
            data.friends.push(if req.sender == data.username { req.receiver } else { req.sender });
        },
        _ => return Err(String::from("Invalid action."))
    }

    with_store(app_handle.clone(), stores, path, |store| store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()))).expect("failed to write");
    utils::update_store(app_handle);
    Ok(())
}
