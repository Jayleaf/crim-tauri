use crate::generics::structs::EncryptedMessage;

pub async fn send(message: EncryptedMessage, app_handle: tauri::AppHandle) -> u16
{
    let body: String = serde_json::to_string(&message).unwrap();
    let client: reqwest::Client = reqwest::Client::new();
    let res: Result<reqwest::Response, reqwest::Error> = client.post("http://localhost:3000/api/message/send")
        .body(body)
        .send()
        .await;
    if res.as_ref().is_err()
    {
        return res.as_ref().unwrap().status().as_u16();
    }

    return res.as_ref().unwrap().status().as_u16();
}