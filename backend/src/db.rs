use sqlx::{postgres::PgPoolOptions, Executor, Pool, Postgres};

use crate::Result;

pub trait SqlExecutor<'c>: Executor<'c> {}

pub async fn get_pg_pool(database_url: &str) -> Result<Pool<Postgres>> {
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
