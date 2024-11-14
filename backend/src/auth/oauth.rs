use std::collections::HashMap;

use oauth2::{
    basic::{BasicClient, BasicRequestTokenError, BasicTokenResponse},
    reqwest::AsyncHttpClientError,
    AccessToken, AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge,
    PkceCodeVerifier, RedirectUrl, Scope, TokenUrl,
};
use reqwest::Url;

use super::ExternalAccount;
use crate::log::*;
mod github;

type Error = anyhow::Error;

#[trait_variant::make(Send)]
trait OAuthAuthenticator {
    type OAuthAccount: ExternalAccount;
    /// get the external account
    async fn get_oauth_account(access_token: AccessToken) -> Result<Self::OAuthAccount, Error>;
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

pub struct OAuthClient<S: CsrfStorage> {
    oauth_client: BasicClient,
    storage: S,
}

impl<S: CsrfStorage> OAuthClient<S> {
    pub fn new(
        client_id: String,
        client_secret: String,
        auth_url: String,
        token_url: String,
        redirect_url: String,
        storage: S,
    ) -> Self {
        let oauth_client = BasicClient::new(
            ClientId::new(client_id),
            Some(ClientSecret::new(client_secret)),
            AuthUrl::new(auth_url).unwrap(),
            Some(TokenUrl::new(token_url).unwrap()),
        )
        // Set the URL the user will be redirected to after the authorization process.
        .set_redirect_uri(RedirectUrl::new(redirect_url).unwrap());

        Self {
            oauth_client,
            storage,
        }
    }
    pub async fn generate_authorization_url(&mut self, scopes: Vec<Scope>) -> Url {
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
    pub async fn request_access_token(
        &mut self,
        authorization_code: String,
        csrf_token: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>> {
        let pkce_code_verifier = self.storage.remove_csrf_token(csrf_token).unwrap();

        self.oauth_client
            .exchange_code(AuthorizationCode::new(authorization_code))
            // Set the PKCE code verifier.
            .set_pkce_verifier(pkce_code_verifier)
            .request_async(oauth2::reqwest::async_http_client)
            .await
    }
}

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

pub type BasicOAuthClient = OAuthClient<HashMap<String, PkceCodeVerifier>>;
