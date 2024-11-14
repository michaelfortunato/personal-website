use serde::{Deserialize, Serialize};

use super::Uuid;
#[derive(Debug, Serialize, Deserialize)]
pub struct Account {
    pub user_id: Uuid,
    pub email: String,
    pub provider: Provider,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewAccount {
    pub user_id: Uuid,
    pub email: String,
    pub provider: Provider,
}
// FIXME: This is the leaky abstraction, it totally breaks everything
#[derive(sqlx::Type, Debug, Serialize, Deserialize)]
pub enum Provider {
    Github,
}

// FIXME: This is also to support the leaky abstraction
impl From<String> for Provider {
    fn from(value: String) -> Self {
        match value.to_uppercase().as_str() {
            "GITHUB" => Self::Github,
            _ => panic!("Could not serialized provider"),
        }
    }
}
