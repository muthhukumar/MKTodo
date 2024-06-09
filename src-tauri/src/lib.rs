// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// #[tauri::command]
// fn get_api_key() -> String {
//     "Ns9!c6kSgu3*@&csHMkmS7XLgtqL*bQ4h#jAhzyS".into()
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        // .invoke_handler(tauri::generate_handler![get_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
