use crate::auth::ProviderType;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Account {
    user_id: Uuid,
    username: String,
    email: String,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewAccount {
    pub user_id: Uuid,
    pub email: String,
    pub provider: ProviderType,
}
