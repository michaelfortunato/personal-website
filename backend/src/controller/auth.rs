use axum::{
    extract::{Path, Query, State},
    response::Redirect,
};
use axum_macros::debug_handler;
use oauth2::{reqwest, CsrfToken, Scope, TokenResponse};
use serde::Deserialize;
use tracing::debug;

use crate::{
    auth::{OAuthAuthenticator, Provider},
    result::Result,
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
    match provider {
        Provider::Github => {
            let mut github_authenticator = state.authenticators.github_authenticator.lock().await;
            debug!("Generating URL!");
            let url = github_authenticator
                .generate_authorization_url(vec![Scope::new("user".to_string())]);
            debug!("Generated URL! {url}");
            Ok(Redirect::to(url.as_ref()))
        }
    }
}

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
    let mut github_authenticator = state.authenticators.github_authenticator.lock().await;
    let token_res = github_authenticator
        .request_access_token(code, csrf_state)
        .await;
    match token_res {
        Ok(token) => {
            let access_token = token.access_token().secret();
            let mut headers = oauth2::http::header::HeaderMap::new();
            headers.insert(
                oauth2::http::header::AUTHORIZATION,
                format!("Bearer {access_token}").try_into().unwrap(),
            );
            let url = oauth2::url::Url::parse("https://api.github.com/user").unwrap();

            let user_request = oauth2::HttpRequest {
                url,
                headers,
                method: oauth2::http::Method::GET,
                body: vec![],
            };
            let response = reqwest::async_http_client(user_request).await.unwrap();
            debug!("{response:?}");
        }
        Err(_) => todo!(),
    };
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
