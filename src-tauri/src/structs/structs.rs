use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Debug)]
pub struct ClientAccount
{
    pub username: String,
    pub password: String,
    pub session_id: String,
}