use sqlx::{postgres::PgPoolOptions, Executor, Pool, Postgres};
use uuid::Uuid;

pub trait SqlExecutor<'c>: Executor<'c> {}

pub type Error = anyhow::Error;
pub type Result<T> = std::result::Result<T, Error>;

#[trait_variant::make(Send)]

pub trait CRUDRepository<Entity, NewEntity, Persistence>:
    Create<Entity, NewEntity, Persistence = Persistence>
    + Get<Entity, Persistence = Persistence>
    + Exists<Entity, Persistence = Persistence>
    + Update<Entity, Persistence = Persistence>
    + Delete<Entity, Persistence = Persistence>
{
}

#[trait_variant::make(Send)]
pub trait Repository<Entity, NewEntity> {
    type Persistence;
    async fn create(&self, db: &Self::Persistence, new_entity: NewEntity) -> Result<Entity>;
    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool>;
    async fn update(&self, db: &Self::Persistence, entity: Entity) -> Result<Entity>;
    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
}

pub trait Create<Entity, NewEntity> {
    type Persistence;
    async fn create(&self, db: &Self::Persistence, new_entity: NewEntity) -> Result<Entity>;
}
pub trait Get<Entity> {
    type Persistence;
    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
}

pub trait Exists<Entity> {
    type Persistence;
    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool>;
}

pub trait Update<Entity> {
    type Persistence;
    async fn update(&self, db: &Self::Persistence, entity: Entity) -> Result<Entity>;
}

pub trait Delete<Entity> {
    type Persistence;
    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
}

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
