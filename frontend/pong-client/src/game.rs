use serde::{
    Serialize,
    Deserialize,
};

use web_sys::Document;

#[derive(Serialize, Deserialize, Clone)]
pub struct OnConnectClient {
    pub id: String,
    username: String,
}

impl OnConnectClient {
    pub fn new(document: &Document, id: String) -> OnConnectClient {

        //replace with cookie to get username
        let old_username_input = document
            .get_element_by_id("username");

        let mut username = String::from("bob");
        if let Some(old_username_input) = old_username_input {
            username = old_username_input
                .get_attribute("name").unwrap();
        }

        OnConnectClient {
            id,
            username,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Move {
    pub id: String,
    pub game_id: String,
    pub movement: String,
}
