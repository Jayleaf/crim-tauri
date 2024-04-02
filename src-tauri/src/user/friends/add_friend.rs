use tokio::sync::mpsc;
use super::generics::{utils, structs::{Tx, WSPacket, WSAction}};
use tauri::Manager;


pub async fn add_friend(name: &str, app_handle: tauri::AppHandle) -> Result<(), String>
{
    let client = utils::get_client_account(&app_handle);
    let packet = WSPacket {
        sender: name.to_string(),
        action: WSAction::AddFriend(name.to_string()),
        sid: client.session_id
    };
    let tx: mpsc::Sender<WSPacket> = app_handle.state::<Tx>().lock().unwrap().clone();
    tx.send(packet).await.map_err(|e| e.to_string())?;
    drop(tx);
    Ok(())
}