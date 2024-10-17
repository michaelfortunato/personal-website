use oauth2::AccessToken;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct GhResponse {
    email: String,
}

pub type Error = anyhow::Error;

struct Github;

async fn get_oauth_account(access_token: AccessToken) {
    let access_token = access_token.secret();
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
        .map_err(|e| Error::from(format!("Something bad {}", e.to_string())))?
        .json::<GhResponse>()
        .await
        .map_err(|e| Error::from(format!("Something bad {}", e.to_string())))?;
}
