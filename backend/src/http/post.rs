use axum::{
    extract::{Path, State},
    Json,
};
use axum_macros::debug_handler;

use tracing::debug;
use uuid::Uuid;

use crate::{
    post::{NewPost, Post},
    result::Result,
    AppState,
};

#[debug_handler]
pub async fn create(
    State(app_state): State<AppState>,
    Json(new_post): Json<NewPost>,
) -> Result<Json<Post>> {
    todo!();
}
