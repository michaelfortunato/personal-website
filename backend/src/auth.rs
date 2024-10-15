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

#[derive(sqlx::Type, Deserialize, Debug, Serialize)]
#[sqlx(type_name = "provider", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum Provider {
    Github,
}

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

pub struct GithubAuthenticator(CustomOAuthAuthenticator);

impl GithubAuthenticator {
    pub fn new(client_id: String, client_secret: String, redirect_url: String) -> Self {
        let inner = CustomOAuthAuthenticator::new(
            client_id,
            client_secret,
            redirect_url,
            "https://github.com/login/oauth/authorize".to_string(),
            "https://github.com/login/oauth/access_token".to_string(),
        );
        Self(inner)
    }
}

impl OAuthAuthenticator for GithubAuthenticator {
    fn generate_authorization_url(&mut self, scopes: Vec<Scope>) -> Url {
        self.0.generate_authorization_url(scopes)
    }

    async fn request_access_token(
        &mut self,
        authorization_code: String,
        csrf_state: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>> {
        self.0
            .request_access_token(authorization_code, csrf_state)
            .await
    }
}

pub struct CustomOAuthAuthenticator {
    oauth_client: BasicClient,
    csrf_state: HashMap<String, PkceCodeVerifier>,
}

impl CustomOAuthAuthenticator {
    pub fn new(
        client_id: String,
        client_secret: String,
        redirect_url: String,
        auth_url: String,
        token_url: String,
    ) -> Self {
        let client = BasicClient::new(
            ClientId::new(client_id),
            Some(ClientSecret::new(client_secret)),
            AuthUrl::new(auth_url).unwrap(),
            Some(TokenUrl::new(token_url).unwrap()),
        )
        // Set the URL the user will be redirected to after the authorization process.
        .set_redirect_uri(RedirectUrl::new(redirect_url).unwrap());

        Self {
            oauth_client: client,
            csrf_state: HashMap::new(),
        }
    }
    fn insert_csrf_token(
        &mut self,
        csrf_token: CsrfToken,
        pkce_verifier: PkceCodeVerifier,
    ) -> Result<(), Error> {
        self.csrf_state
            .insert(csrf_token.secret().clone(), pkce_verifier);
        Ok(())
    }
    fn remove_csrf_token(&mut self, csrf_token: CsrfToken) -> Result<PkceCodeVerifier, Error> {
        let pkce_verifier = self
            .csrf_state
            .remove(csrf_token.secret())
            .expect("No csrf state exists");
        Ok(pkce_verifier)
    }
}

impl OAuthAuthenticator for CustomOAuthAuthenticator {
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
        self.insert_csrf_token(csrf_token, pkce_code_verifier)
            .unwrap();
        auth_url
    }
    async fn request_access_token(
        &mut self,
        authorization_code: String,
        csrf_token: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>> {
        let pkce_code_verifier = self.remove_csrf_token(csrf_token).unwrap();

        self.oauth_client
            .exchange_code(AuthorizationCode::new(authorization_code))
            // Set the PKCE code verifier.
            .set_pkce_verifier(pkce_code_verifier)
            .request_async(reqwest::async_http_client)
            .await
    }
}
