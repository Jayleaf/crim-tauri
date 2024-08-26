


use std::sync::Arc;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use crate::mpsc::Sender;

#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct ClientAccount
{
    pub username: String,
    pub password: String,
    pub friends: Vec<String>,
    pub friend_requests: Vec<FriendRequest>,
    /// This could get really thick if the conversations are too big. Will load test eventually.
    pub conversations: Vec<Conversation>,
    pub session_id: String
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct Conversation
{
    pub id: String,
    pub users: Vec<String>,
    pub keys: Vec<UserKey>,
    pub messages: Vec<EncryptedMessage>
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct EncryptedMessage
{
    pub data: Vec<u8>,
    pub nonce: Vec<u8>,
    pub sender: String,
    pub dest_convo_id: String,
    pub sender_sid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct UserKey
{
    pub owner: String,
    pub key: Vec<u8>
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RawMessage
{
    pub sender: String,
    pub message: Vec<u8>,
    pub time: String
}

#[derive(Deserialize, Serialize, Debug, Default, Clone, Eq, PartialEq)]
/// An enum representing the different actions that can be taken when updating a user's data.
pub enum UpdateAction
{
    #[default]
    None,
    ChangeUsername,
    ChangePassword,
    AddFriend,
    RemoveFriend,
}

/// A unique user data struct, made specifically for updating one specific field of userdata.
/// 
/// ## Fields
/// * [`field`][`std::string::String`] - The field to be updated.
/// * [`data`][`std::string::String`] - The data to replace the old data of specified field with
/// * [`action`][`UpdateAction`] - The action to be taken with the data.
/// * [`session_id`][`std::string::String`] - The session ID of the user making the request.
/// 
#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct UpdateUser
{
    pub data: String,
    pub action: UpdateAction,
    pub session_id: String
}

pub type Tx = Arc<Mutex<Sender<WSPacket>>>;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum WSAction
{
    SendMessage(EncryptedMessage),
    ReceiveMessage(EncryptedMessage),
    CreateConversation(Vec<String>),
    DeleteConversation(String),
    AddFriend(FriendRequest),
    RemoveFriend(String),
    Register(),
    Disconnect(),
    Info(String),
    ReceiveArbitraryInfo(String, u8), // (Serialized Data, Identifying Key)
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct WSPacket
{
    pub sender: String,
    pub sid: String,
    pub action: WSAction
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct FriendRequest
{
    pub sender: String,
    pub receiver: String,
    pub status: String,
}

