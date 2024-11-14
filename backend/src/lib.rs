use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use axum::{routing::post, Router};

pub mod auth;
pub mod context;
pub mod http;
pub(crate) mod log;
pub mod model;
pub mod persistence;
pub mod repo;
mod result;

use context::AppContext;
use log::*;
pub use result::Result;

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

// TODO: Stop generics invasion
// All the credit goes here!
// Great idea. https://tulipemoutarde.be/posts/2023-08-20-depencency-injection-rust-axum/#static-dispatch-with-generics

pub fn app<S: 'static + AppContext + Sync + Clone + Send>(app_context: S) -> Router {
    Router::new()
        .route("/user", post(http::user::create_user::<S>))
        .with_state(app_context)
}

#[derive(Clone)]
struct AppContextImpl {
    persistence: persistence::pg::Persistence,
    user_repo: repo::sql::Repo,
    account_repo: repo::sql::Repo,
}

impl AppContextImpl {
    pub fn new(persistence: persistence::pg::Persistence) -> Self {
        let user_repo = repo::sql::Repo;
        let account_repo = repo::sql::Repo;
        Self {
            persistence,
            user_repo,
            account_repo,
        }
    }
}

impl AppContext for AppContextImpl {
    type Persistence = persistence::pg::Persistence;

    type UserRepository = repo::sql::Repo;

    type AccountRepository = repo::sql::Repo;

    fn db(&self) -> &Self::Persistence {
        &self.persistence
    }

    fn user_repo(&self) -> &Self::UserRepository {
        &self.user_repo
    }

    fn account_repo(&self) -> &Self::AccountRepository {
        &self.account_repo
    }
}

async fn serve(config: Config) {
    info!("Starting server...");
    debug!("Aquring database connection (app state)");
    let persistence = persistence::pg::connect(config.database_url.as_ref())
        .await
        .unwrap();
    let context = AppContextImpl::new(persistence);
    debug!("Success. Requesting port...");
    let app = app(context);
    let listener = tokio::net::TcpListener::bind(SocketAddr::new(config.ip, config.port))
        .await
        .unwrap();
    debug!("Success. Start listening...");
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    // use crate::get_app_state;

    use super::app;
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    // for `collect`
    use tower::ServiceExt; // for `call`, `oneshot`, and `ready`

    #[tokio::test]
    async fn hello_world() {
        /*
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
        */
    }
}
