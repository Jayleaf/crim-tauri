use tokio::sync::mpsc;
use super::generics::{utils, structs::{Tx, WSPacket, WSAction, FriendRequest}};
use tauri::Manager;


pub async fn accept_friend_request(name: &str, app_handle: tauri::AppHandle) -> Result<(), String>
{
    let client = utils::get_client_account(&app_handle);
    let mut frq = client.friend_requests.iter().find(|x| x.sender == name || x.receiver == name).unwrap().clone();
    frq.status = "ACCEPTED".to_string();
    let packet = WSPacket {
        sender: client.username.clone(),
        action: WSAction::AddFriend(frq),
        sid: client.session_id
    };
    let tx: mpsc::Sender<WSPacket> = app_handle.state::<Tx>().lock().unwrap().clone();
    tx.send(packet).await.map_err(|e| e.to_string())?;
    drop(tx);
    Ok(())
}