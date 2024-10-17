use oauth2::{
    basic::{BasicClient, BasicRequestTokenError, BasicTokenResponse},
    reqwest::AsyncHttpClientError,
    AccessToken, AuthorizationCode, CsrfToken, PkceCodeChallenge, PkceCodeVerifier, Scope,
};
use reqwest::Url;
use tracing::debug;
mod github;

struct OAuthAccount {
    email: String,
}

type Error = anyhow::Error;

#[trait_variant::make(Send)]
pub trait OAuthAuthenticator {
    type OAuthAccount;
    /// get_access_token
    async fn request_access_token(
        &mut self,
        authorization_code: AuthorizationCode,
        csrf_token: CsrfToken,
    ) -> Result<BasicTokenResponse, BasicRequestTokenError<AsyncHttpClientError>>;
    /// get the external account
    async fn get_oauth_account(access_token: AccessToken) -> Result<Self::OAuthAccount, Error>;
}

struct OAuthHttpClient<S: CsrfStorage> {
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

impl<S: CsrfStorage> OAuthHttpClient<S> {
    pub fn new(oauth_client: BasicClient, storage: S) -> Self {
        Self {
            oauth_client,
            storage,
        }
    }
    async fn generate_authorization_url(&mut self, scopes: Vec<Scope>) -> Url {
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
            .request_async(oauth2::reqwest::async_http_client)
            .await
    }
}
