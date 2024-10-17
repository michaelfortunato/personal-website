use std::{
    collections::HashMap,
    net::{IpAddr, Ipv4Addr, SocketAddr},
    ops::Deref,
    sync::Arc,
};

use auth::GithubAuthenticator;
use axum::{
    routing::{get, post},
    Router,
};
use oauth2::PkceCodeVerifier;
use std::env;
use tokio::sync::Mutex;

pub mod account;
pub mod auth;
pub mod controller;
pub mod db;
pub mod post;
mod result;
pub mod user;

use db::get_pg_pool;
pub use result::Result;
use sqlx::PgPool;
use tracing::{debug, info};

/// This library supports an http server.
/// This is the config for http server.
pub struct Config {
    /// The address the http server will live on
    pub ip: IpAddr,
    /// The address the http server will live on
    pub port: u16,
    /// The number of threads the http server will use
    pub number_of_threads: u16,
    /// The database url
    pub database_url: String,
}

impl Config {
    pub fn new(database_url: String) -> Self {
        Config {
            database_url,
            ip: IpAddr::V4(Ipv4Addr::new(0, 0, 0, 0)),
            port: 8080,
            number_of_threads: 2,
        }
    }
}

pub fn run(config: Config) {
    tokio::runtime::Builder::new_multi_thread()
        // .worker_threads(2)
        .enable_all()
        .build()
        .unwrap()
        .block_on(serve(config));
}

pub fn app(app_state: AppState) -> Router {
    Router::new()
        .route("/auth/login/:provider", post(controller::auth::login))
        .route("/auth/callback/:provider", get(controller::auth::callback))
        .route("/auth/me", get(controller::auth::me))
        .route("/auth/logout", post(controller::auth::logout))
        .route("/post", post(controller::post::create))
        .with_state(app_state)
}

#[derive(Clone)]
pub struct AppState(Arc<InnerAppState>);
// deref so you can still access the inner fields easily
impl Deref for AppState {
    type Target = InnerAppState;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

pub struct InnerAppState {
    db: PgPool,
    authenticators: Authenticators,
    private_key: String,
}

pub struct Authenticators {
    pub github_authenticator: Mutex<GithubAuthenticator<HashMap<String, PkceCodeVerifier>>>,
}

impl Authenticators {
    pub fn new() -> Self {
        Self {
            github_authenticator: Mutex::new(GithubAuthenticator::new(
                env::var("OAUTH_GITHUB_CLIENT_ID").unwrap(),
                env::var("OAUTH_GITHUB_CLIENT_SECRET").unwrap(),
                #[cfg(debug_assertions)]
                /* DEV */
                "http://localhost:8080/auth/oauth/callback/github".to_string(),
                #[cfg(not(debug_assertions))]
                /* PROD */
                "https://api.michaelfortunato.dev/auth/oauth/callback/github".to_string(),
                HashMap::new(),
            )),
        }
    }
}

impl Default for Authenticators {
    fn default() -> Self {
        Self::new()
    }
}

async fn serve(config: Config) {
    info!("Starting server...");
    debug!("Aquring database connection (app state)");
    let app_state = get_app_state(config.database_url.as_ref()).await.unwrap();
    debug!("Success. Preparing to listen...");
    let app = app(app_state);
    let listener = tokio::net::TcpListener::bind(SocketAddr::new(config.ip, config.port))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

pub async fn get_app_state(database_url: &str) -> Result<AppState> {
    let db = get_pg_pool(database_url).await?;
    Ok(AppState(Arc::new(InnerAppState {
        db,
        authenticators: Authenticators::new(),
        private_key: "SECRET".to_string(),
    })))
}

#[cfg(test)]
mod tests {
    use crate::get_app_state;

    use super::app;
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    // for `collect`
    use tower::ServiceExt; // for `call`, `oneshot`, and `ready`

    #[tokio::test]
    async fn hello_world() {
        let db = get_app_state("postgres://postgres:password@localhost:5432/postgres")
            .await
            .unwrap();
        let app = app(db);

        // `Router` implements `tower::Service<Request<Body>>` so we can
        // call it like any tower service, no need to run an HTTP server.
        let response = app
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();
        println!("{response:?}");

        assert_eq!(response.status(), StatusCode::OK);
    }
}
