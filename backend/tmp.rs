use anyhow::anyhow;
use axum::{
    extract::{FromRequestParts, Path, Query, State},
    http::request::Parts,
    response::Redirect,
};
use axum_macros::debug_handler;
use oauth2::{CsrfToken, Scope, TokenResponse};
use serde::Deserialize;
use tracing::{debug, info};

use crate::{
    auth::{OAuthAuthenticator, Provider},
    error::{Error, Result},
    user::NewUser,
    AppState,
};

/// This does not actually log the user in.
/// But rather initiates the oauth flow, see callback
/// for help
#[debug_handler]
pub async fn login(
    State(state): State<AppState>,
    Path(provider): Path<Provider>,
) -> Result<Redirect> {
    debug!("In signin!");
}

trait Registrar {}

pub fn get_registrar(state: AppState, provider_type: Provider) -> impl Registrar {}

#[derive(Deserialize)]
pub struct CallbackParameters {
    state: CsrfToken,
    code: String,
}

#[derive(Deserialize)]
pub struct GhResponse {
    email: String,
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
    let mut github_authenticator = state.authenticators.github_authenticator.lock().await;
    let token = github_authenticator
        .request_access_token(code, csrf_state)
        .await?;
    let access_token = token.access_token().secret();
    let client = reqwest::Client::new();
    let GhResponse { email: gh_email } = client
        .get("https://api.github.com/user")
        .header(
            reqwest::header::USER_AGENT,
            "DEV: Michael Fortunato's Personal Website",
        )
        .header(reqwest::header::ACCEPT, "application/vnd.github+json")
        .header(
            reqwest::header::AUTHORIZATION,
            format!("Bearer {}", access_token),
        )
        .send()
        .await
        .map_err(|e| Error::Other(anyhow!("Something bad {}", e.to_string())))?
        .json::<GhResponse>()
        .await
        .map_err(|e| Error::Other(anyhow!("Something bad {}", e.to_string())))?;
    let new_user = NewUser {
        username: gh_email.clone(),
        email: gh_email,
    };
    // Now we need to link the account

    todo!()
}

#[debug_handler]
pub async fn me(
    State(state): State<AppState>,
    Path(_provider): Path<Provider>,
) -> Result<Redirect> {
    debug!("In signin!");
    let mut github_authenticator = state.authenticators.github_authenticator.lock().await;
    debug!("Generating URL!");
    let url = github_authenticator.generate_authorization_url(vec![
        Scope::new("read".to_string()),
        Scope::new("write".to_string()),
    ]);
    debug!("Generated URL! {url}");
    Ok(Redirect::to(url.as_ref()))
}

#[debug_handler]
pub async fn logout(
    State(state): State<AppState>,
    Path(_provider): Path<Provider>,
) -> Result<Redirect> {
    debug!("In signin!");
    let mut github_authenticator = state.authenticators.github_authenticator.lock().await;
    debug!("Generating URL!");
    let url = github_authenticator.generate_authorization_url(vec![
        Scope::new("read".to_string()),
        Scope::new("write".to_string()),
    ]);
    debug!("Generated URL! {url}");
    Ok(Redirect::to(url.as_ref()))
}
