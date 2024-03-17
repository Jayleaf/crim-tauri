use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Debug)]
pub struct ClientAccount
{
    pub username: String,
    pub password: String,
    pub friends: Vec<String>,
    pub session_id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Conversation
{
    pub id: String,
    pub users: Vec<String>,
    pub keys: Vec<UserKey>,
    pub messages: Vec<EncryptedMessage>
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EncryptedMessage
{
    pub data: Vec<u8> // data contains a serialized message struct. see diagram in readme.md for more info.
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UserKey
{
    owner: String,
    key: Vec<u8>
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RawMessage
{
    pub sender: String,
    pub message: Vec<u8>,
    pub time: String
}

