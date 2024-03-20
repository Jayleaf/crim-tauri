use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct ClientAccount
{
    pub username: String,
    pub password: String,
    pub friends: Vec<String>,
    /// This could get really thick if the conversations are too big. Will load test eventually.
    pub conversations: Vec<Conversation>,
    pub session_id: String
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
    pub data: Vec<u8>,
    pub sender: String,
    pub dest_convo_id: String,
    pub sender_sid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
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

