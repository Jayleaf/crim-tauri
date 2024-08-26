use tauri::Manager;
use super::generics::{utils, structs::{ClientAccount, EncryptedMessage, RawMessage, Tx, WSPacket, WSAction}};
use tokio::sync::mpsc;
use aes_gcm::{ aead::{Aead, AeadCore, KeyInit, OsRng, generic_array}, Aes256Gcm };

/// Sends a message to a conversation through the connected websocket.
/// 
/// ## Arguments
/// * [`message`][`str`] - The message text to be sent.
/// * [`time`][`str`] - The time the message was sent.
/// * [`target_convo_id`][`str`] - The conversation ID to send the message to.
/// * [`app_handle`][`tauri::AppHandle`] - A handle to the Tauri application.
/// 
/// ## Returns
/// * [`Result<(), String>`] - A result containing a [`SendError`][`tokio::sync::mpsc::error::SendError<WSPacket>`] if the message could not be sent.
pub async fn send(message: &str, time: &str, target_convo_id: &str, app_handle: tauri::AppHandle) -> Result<(), String>
{
    let account: ClientAccount = utils::get_client_account(&app_handle);
    let key = account.conversations.iter().find(|x| x.id == target_convo_id).unwrap().keys.iter().find(|x| x.owner == account.username).unwrap();

    // get conversation key
    let key = utils::get_convo_key(key.clone()); // conversation keys are also 32 bytes.

    // declare rawmessage
    let message: RawMessage = RawMessage
    {
        message: message.to_string().into_bytes(),
        sender: account.username,
        time: time.to_string()
    };
    let nonce = Aes256Gcm::generate_nonce(&mut OsRng).to_vec();
    // encrypt serialized rawmessage
    let serialized_message: String = serde_json::to_string(&message).unwrap();
    let encrypted_message = Aes256Gcm::new(&key).encrypt(&generic_array::GenericArray::clone_from_slice(nonce.as_slice()), serialized_message.as_bytes().as_ref()).unwrap();  
    let emessage: EncryptedMessage = EncryptedMessage
    {
        data: encrypted_message,
        nonce,
        sender: message.sender, // this is filled out by the server.
        dest_convo_id: target_convo_id.to_string(), // again, validated by the server, but has to be provided.
        sender_sid: account.session_id
    };
    let packet = WSPacket
    {
        sender: emessage.sender.clone(),
        sid: emessage.sender_sid.clone(),
        action: WSAction::SendMessage(emessage)
    };
    
    let tx: mpsc::Sender<WSPacket> = app_handle.state::<Tx>().lock().unwrap().clone();
    tx.send(packet).await.map_err(|e| e.to_string())?;
    drop(tx);
    Ok(())
    
}