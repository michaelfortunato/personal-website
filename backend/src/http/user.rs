use axum::{
    extract::{Path, State},
    Json,
};
use axum_macros::debug_handler;

use tracing::debug;

use crate::{
    context::AppContext,
    model::user::{NewUser, User},
    repo::Create,
    result::Result,
};

pub async fn create_user<S: AppContext>(
    State(state): State<S>,
    Json(new_user): Json<NewUser>,
) -> Result<Json<User>> {
    debug!("In create_user handler, with argument {:?}", new_user);
    // TODO:We added dependency injection in Axum by following
    // https://tulipemoutarde.be/posts/2023-08-20-depencency-injection-rust-axum/#static-dispatch-with-generics
    // Thanks pal!
    let user_repo = state.user_repo();
    let db = state.db();
    let user = user_repo.create(db, new_user).await?;
    Ok(Json(user))
}

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
