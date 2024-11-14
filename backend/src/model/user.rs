use crate::Result;
use serde::{Deserialize, Serialize};
use sqlx::{query_as, PgPool};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub email: String,
}
