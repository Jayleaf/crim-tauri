use openssl::symm;
use tauri::Manager;
use super::generics::{utils, structs::{ClientAccount, EncryptedMessage, RawMessage, Tx, WSPacket, WSAction}};
use tokio::sync::mpsc;
use openssl::rsa::Padding;

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
    let account: ClientAccount = utils::get_client_account(app_handle.clone());
    let key = account.conversations.iter().find(|x| x.id == target_convo_id).unwrap().keys.iter().find(|x| x.owner == account.username).unwrap();

    // get conversation key and decrypt it
    let cipher: symm::Cipher = symm::Cipher::aes_256_cbc();
    let private_key: openssl::rsa::Rsa<openssl::pkey::Private> = openssl::rsa::Rsa::private_key_from_pem(std::fs::read(".pkey.key").unwrap().as_ref()).unwrap();
    let mut decrypted_convo_key: Vec<u8> = vec![0; private_key.size() as usize];
    private_key.private_decrypt(&key.key, &mut decrypted_convo_key, Padding::PKCS1).expect("Failed to decrypt convo key");
    decrypted_convo_key.retain(|&x| x != 0_u8); 

    // declare rawmessage
    let message: RawMessage = RawMessage
    {
        message: message.to_string().into_bytes(),
        sender: account.username,
        time: time.to_string()
    };

    // encrypt serialized rawmessage
    let serialized_message: String = serde_json::to_string(&message).unwrap();
    let encrypted_message: Vec<u8> = symm::encrypt(cipher, &decrypted_convo_key, None, serialized_message.as_bytes()).unwrap();
    let emessage: EncryptedMessage = EncryptedMessage
    {
        data: encrypted_message,
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