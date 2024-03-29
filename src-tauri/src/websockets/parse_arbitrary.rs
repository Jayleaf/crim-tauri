use super::generics::{utils, structs::{WSPacket, WSAction}};
pub async fn parse_arbitrary_packet(x: WSAction::RecieveArbitraryInfo(x), app_handle: tauri::AppHandle) -> Result<u16, ()>
{
    match x.1
    {
        1 =>  // bulk conversation update
        { 
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(conversations) = serde_json::from_str(x.0)
            else { return Err(()) };
            data.conversations = conversations;
            with_store(app_handle.clone(), stores, path, |store| 
            {
            store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()));
            }).expect("failed to write");
            Ok(200)
        }
        2 => // single conversation update
        {
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(conversation) = serde_json::from_str(x.0)
            else { return Err(()) };
            data.conversations.push(conversation);
            with_store(app_handle.clone(), stores, path, |store| 
            {
            store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()));
            }).expect("failed to write");
            Ok(200)
        },
        3 => // add a new friend and update conversation
        {
            let mut data = utils::get_client_account(app_handle.clone());
            let Ok(convo) = serde_json::from_str::<Conversation>(x.0)
            else { return Err(()) };
            data.friends.push(&convo.users.iter.find(|x| x != &data.username).unwrap().to_string());
            data.conversations.push(convo);
            with_store(app_handle.clone(), stores, path, |store| 
            {
            store.insert("userdata".to_string(), serde_json::Value::String(serde_json::to_string(&data).unwrap()));
            }).expect("failed to write");
            Ok(200)
        },
    }
}
