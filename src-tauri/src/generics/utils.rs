use tauri::Manager;

/// refreshes client-side store data
pub fn update_store(app_handle: tauri::AppHandle)
{
    app_handle.emit_all("update", ());
}