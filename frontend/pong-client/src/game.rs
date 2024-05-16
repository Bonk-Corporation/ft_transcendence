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
        let username = document
            .get_element_by_id("username").expect("no username")
            .get_attribute("name").unwrap();
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
