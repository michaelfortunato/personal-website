use oauth2::AccessToken;
use serde::Deserialize;

use crate::auth::ExternalAccount;

use super::{CsrfStorage, OAuthAuthenticator, OAuthClient};

#[derive(Deserialize)]
pub struct GithubAccount {
    email: String,
}
impl ExternalAccount for GithubAccount {
    fn email(&self) -> &str {
        self.email.as_ref()
    }
}

pub type Error = anyhow::Error;

pub struct Github<S: CsrfStorage> {
    oauth_client: OAuthClient<S>,
}

impl<S: CsrfStorage> Github<S> {
    pub fn new(client_id: String, client_secret: String, redirect_url: String, storage: S) -> Self {
        let oauth_client = OAuthClient::new(
            client_id,
            client_secret,
            "https://github.com/login/oauth/authorize".to_string(),
            "https://github.com/login/oauth/access_token".to_string(),
            redirect_url,
            storage,
        );
        Self { oauth_client }
    }
    async fn github_api_http_user_request(
        access_token: &AccessToken,
    ) -> Result<GithubAccount, Error> {
        let access_token = access_token.secret();
        #[derive(Deserialize)]
        struct Response {
            email: String,
        }
        let http_client = reqwest::Client::new();
        let Response { email } = http_client
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
            .await?
            .json::<Response>()
            .await?;
        Ok(GithubAccount { email })
    }
}

impl<S: CsrfStorage> OAuthAuthenticator for Github<S> {
    type OAuthAccount = GithubAccount;

    /// get the external account
    async fn get_oauth_account(access_token: AccessToken) -> Result<Self::OAuthAccount, Error> {
        let account = Self::github_api_http_user_request(&access_token).await?;
        Ok(account)
    }
}
