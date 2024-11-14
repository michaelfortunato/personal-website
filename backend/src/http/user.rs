use axum::{
    extract::{Path, State},
    Json,
};
use axum_macros::debug_handler;

use tracing::debug;

use crate::{result::Result, AppContext};
/*
#[debug_handler]
pub async fn get_user(
    Path(user_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<Option<User>>> {
    todo!();
    debug!("In get user!");
    let user_repo = UserPgRepository::new(&state.db);
    let user = user_repo.get(&user_id).await?;
    debug!("Got user {user:?}");
    Ok(Json(user))
}

#[debug_handler]
pub async fn sign_up_user(
    State(state): State<AppState>,
    Json(new_user): Json<NewUser>,
) -> Result<Json<User>> {
    // TODO: How do we integrate Axum with this dependency injection?
    // I am offline now but this can be achieved by
    // 1. Building axum docs locally with `cargo d --examples --open -p axum`
    // 2. Reading the example section in the built docs
    todo!();
}
*/
