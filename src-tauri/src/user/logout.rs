use tokio::sync::mpsc;
use tauri::Manager;
use super::generics::{utils, structs::{WSPacket, WSAction, Tx}};

/// Disconnects a user from their websocket.
/// Sends the API a disconnect packet, which will remove this client from the server's client store.
/// 
/// ## Arguments
/// * [`app_handle`][`tauri::AppHandle`] - A handle to the Tauri application.
/// 
pub async fn logout(app_handle: tauri::AppHandle)
{
    let tx: mpsc::Sender<WSPacket> = app_handle.state::<Tx>().lock().unwrap().clone();
    let account = utils::get_client_account(&app_handle);
    let packet = WSPacket
    {
        sender: account.username,
        sid: account.session_id,
        action: WSAction::Disconnect(),
    };
    if let Err(e) = tx.send(packet).await
    {
        eprintln!("Error sending logout packet: {:?}", e);
        return;
    }
    else { return; }
}