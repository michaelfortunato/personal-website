use std::collections::HashMap;

use oauth2::{
    basic::{BasicClient, BasicRequestTokenError, BasicTokenResponse},
    reqwest::{self, AsyncHttpClientError},
    url::Url,
    AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge,
    PkceCodeVerifier, RedirectUrl, Scope, TokenUrl,
};
use serde::{Deserialize, Serialize};
use tracing::debug;

use crate::result::Error;
mod jwt;
mod oauth;

#[derive(sqlx::Type, Deserialize, Debug, Serialize)]
#[sqlx(type_name = "provider", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum Provider {
    Github,
}

pub type ProviderType = Provider;

impl sqlx::postgres::PgHasArrayType for Provider {
    fn array_type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("_provider")
    }
}

#[trait_variant::make(Send)]
pub trait OAuthAuthenticator {
    /// This method starts the auth flow
    fn generate_authorization_url(&mut self, scopes: Vec<Scope>) -> Url;
    /// This method starts the auth flow
    async fn request_access_token(
        &mut self,
        pkce_code: String,
        csrf_token: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>>;
}

pub struct GithubAuthenticator<S: CsrfStorage>(CustomOAuthAuthenticator<S>);

impl CsrfStorage for HashMap<String, PkceCodeVerifier> {
    fn insert_csrf_token(
        &mut self,
        csrf_token: CsrfToken,
        pkce_verifier: PkceCodeVerifier,
    ) -> Result<(), Error> {
        self.insert(csrf_token.secret().clone(), pkce_verifier);
        Ok(())
    }

    fn remove_csrf_token(&mut self, csrf_token: CsrfToken) -> Result<PkceCodeVerifier, Error> {
        let pkce_verifier = self
            .remove(csrf_token.secret())
            .expect("No csrf state exists");
        Ok(pkce_verifier)
    }
}

impl<S: CsrfStorage> std::ops::Deref for GithubAuthenticator<S> {
    type Target = CustomOAuthAuthenticator<S>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<S: CsrfStorage> GithubAuthenticator<S> {
    pub fn new(client_id: String, client_secret: String, redirect_url: String, storage: S) -> Self {
        let oauth_client = BasicClient::new(
            ClientId::new(client_id),
            Some(ClientSecret::new(client_secret)),
            AuthUrl::new("https://github.com/login/oauth/authorize".to_string()).unwrap(),
            Some(TokenUrl::new("https://github.com/login/oauth/access_token".to_string()).unwrap()),
        )
        // Set the URL the user will be redirected to after the authorization process.
        .set_redirect_uri(RedirectUrl::new(redirect_url).unwrap());

        let inner = CustomOAuthAuthenticator {
            oauth_client,
            storage,
        };
        Self(inner)
    }
}

pub struct CustomOAuthAuthenticator<S: CsrfStorage> {
    oauth_client: BasicClient,
    storage: S,
}

#[trait_variant::make(Send)]
pub trait CsrfStorage {
    fn insert_csrf_token(
        &mut self,
        csrf_token: CsrfToken,
        pkce_verifier: PkceCodeVerifier,
    ) -> Result<(), Error>;
    fn remove_csrf_token(&mut self, csrf_token: CsrfToken) -> Result<PkceCodeVerifier, Error>;
}

impl<S: CsrfStorage> CustomOAuthAuthenticator<S> {
    pub fn new(oauth_client: BasicClient, storage: S) -> Self {
        Self {
            oauth_client,
            storage,
        }
    }
}

impl<S: CsrfStorage> OAuthAuthenticator for CustomOAuthAuthenticator<S> {
    fn generate_authorization_url(&mut self, scopes: Vec<Scope>) -> Url {
        // Generate a PKCE challenge.
        let (pkce_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();
        // Generate the full authorization URL.
        let authorization_url = self
            .oauth_client
            .authorize_url(CsrfToken::new_random)
            .add_scopes(scopes);

        let (auth_url, csrf_token) = authorization_url
            // Set the PKCE code challenge.
            .set_pkce_challenge(pkce_challenge)
            .url();
        debug!("Stashing state token away for later:  {csrf_token:?}...");
        self.storage
            .insert_csrf_token(csrf_token, pkce_code_verifier)
            .unwrap();
        auth_url
    }
    async fn request_access_token(
        &mut self,
        authorization_code: String,
        csrf_token: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>> {
        let pkce_code_verifier = self.storage.remove_csrf_token(csrf_token).unwrap();

        self.oauth_client
            .exchange_code(AuthorizationCode::new(authorization_code))
            // Set the PKCE code verifier.
            .set_pkce_verifier(pkce_code_verifier)
            .request_async(reqwest::async_http_client)
            .await
    }
}
