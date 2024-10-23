use axum::{
    extract::{FromRequestParts, Path, Query, State},
    http::{request::Parts, StatusCode},
    response::Redirect,
    RequestPartsExt,
};
use axum_extra::{
    extract::CookieJar,
    headers::{authorization::Bearer, Authorization, Cookie, SetCookie},
    TypedHeader,
};
use axum_macros::debug_handler;
use jsonwebtoken::{decode, DecodingKey};
use serde::{Deserialize, Serialize};
use tracing::debug;

use crate::{auth::Provider, user::User, AppState};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    email: String,
    provider: Provider,
}

struct AuthSession {
    claims: Claims,
}

const JWT_SECRET: &str = "ABDCD";

#[axum::async_trait]
impl FromRequestParts<AppState> for AuthSession {
    type Rejection = StatusCode;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        // Extract the token from the authorization header
        let token = match parts.extract::<TypedHeader<Authorization<Bearer>>>().await {
            Ok(TypedHeader(Authorization(ref bearer))) => bearer.token().to_owned(),
            Err(_) => {
                let cookie_jar = parts.extract::<CookieJar>().await.unwrap();
                cookie_jar
                    .get("JWT")
                    .map(|cookie| cookie.value().to_string()) // Map Option<Cookie> to String
                    .ok_or(StatusCode::UNAUTHORIZED)? // Convert Option to Result
            }
        };
        // Decode the user data
        let token_data = jsonwebtoken::decode::<Claims>(
            &token,
            &DecodingKey::from_secret(JWT_SECRET.as_bytes()),
            &jsonwebtoken::Validation::default(),
        )
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

        Ok(AuthSession {
            claims: token_data.claims,
        })
    }
}

/// This does not actually log the user in.
/// But rather initiates the oauth flow, see callback
/// for help
#[debug_handler]
pub async fn signup(State(state): State<AppState>, Path(provider): Path<Provider>) {
    debug!("In signin!");
}

/*
#[derive(Deserialize)]
pub struct CallbackParameters {
    state: CsrfToken,
    code: String,
}

#[debug_handler]
pub async fn callback(
    State(state): State<AppState>,
    Path(_provider): Path<Provider>,
    Query(CallbackParameters {
        state: csrf_state,
        code,
    }): Query<CallbackParameters>,
) -> Result<String> {
    debug!("In callback!");
    todo!()
}

#[debug_handler]
pub async fn me(
    State(state): State<AppState>,
    Path(_provider): Path<Provider>,
) -> Result<Redirect> {
    debug!("In signin!");
    debug!("Generated URL! {url}");
    Ok(Redirect::to(url.as_ref()))
}

#[debug_handler]
pub async fn logout(
    State(state): State<AppState>,
    Path(_provider): Path<Provider>,
) -> Result<Redirect> {
    debug!("In signin!");
    Ok(Redirect::to(url.as_ref()))
}

*/
