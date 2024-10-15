use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::migrate::MigrateError as SqlxMigrateError;
use sqlx::Error as SqlxError;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Error, Debug)]
pub enum Error {
    #[error("Database error.")]
    Database(#[from] SqlxError),
    #[error("Unspecified error. See message for more detail.")]
    Other(#[from] anyhow::Error),
}

impl From<SqlxMigrateError> for Error {
    fn from(value: SqlxMigrateError) -> Self {
        Error::from(SqlxError::from(value))
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        match self {
            Error::Database(e) => {
                (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response()
            }
            Error::Other(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
        }
    }
}
