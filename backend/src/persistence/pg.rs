use crate::Result;
use sqlx::{postgres::PgPoolOptions, Pool as SqlxPool, Postgres};

pub type Pool<T> = SqlxPool<T>;
pub type Persistence = Pool<Postgres>;

pub use sqlx::query_as;

pub async fn connect(database_url: &str) -> Result<Pool<Postgres>> {
    // We create a single connection pool for SQLx that's shared across the whole application.
    // This saves us from opening a new connection for every API call, which is wasteful.
    let db = PgPoolOptions::new()
        // The default connection limit for a Postgres server is 100 connections, minus 3 for superusers.
        // Since we're using the default superuser we don't have to worry about this too much,
        // although we should leave some connections available for manual access.
        //
        // If you're deploying your application with multiple replicas, then the total
        // across all replicas should not exceed the Postgres connection limit.
        .max_connections(50)
        .connect(database_url)
        .await?;
    sqlx::migrate!().run(&db).await?;
    Ok(db)
}

//TODO: This is a workaround Impl To Prevent query_as! from error-ing
// https://docs.rs/sqlx/latest/sqlx/postgres/trait.PgHasArrayType.html
// And this should have worked https://github.com/launchbadge/sqlx/issues/1004
// impl sqlx::postgres::PgHasArrayType for crate::model::acccount::Provider {
//     fn array_type_info() -> sqlx::postgres::PgTypeInfo {
//         PgTypeInfo::with_name("_provider")
//     }
// }
