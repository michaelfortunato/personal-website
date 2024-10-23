use crate::{auth::Provider, result::Error, Result};
use serde::{Deserialize, Serialize};
use sqlx::{query_as, PgPool};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub email: String,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewAccount {
    pub email: String,
    pub provider: Provider,
}
#[derive(Serialize, Debug, Deserialize)]
pub struct Account {
    pub email: String,
    pub provider: Provider,
}

#[trait_variant::make(Send)]
pub trait UserRepository<P>: crate::db::Repository<User, NewUser, Persistence = P> {}

pub struct PgRepository2;

use crate::db::Result as RepoResult;
impl crate::db::Repository<User, NewUser> for PgRepository2 {
    type Persistence = PgPool;
    async fn create(&self, db: &Self::Persistence, new_user: NewUser) -> RepoResult<User> {
        let mut conn = db.acquire().await?;
        let user = query_as!(
            User,
            r#"
        INSERT INTO "user"(username, email)
        VALUES($1, $2)
        RETURNING *;
        "#,
            new_user.username,
            new_user.email,
        )
        .fetch_one(&mut *conn)
        .await?;
        Ok(user)
    }
    async fn get(&self, db: &Self::Persistence, id: Uuid) -> RepoResult<User> {
        let mut conn = db.acquire().await?;
        let user = query_as!(
            User,
            r#"
        SELECT * from "user"
        WHERE id = $1;
        "#,
            id
        )
        .fetch_one(&mut *conn)
        .await?;

        Ok(user)
    }
    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> RepoResult<bool> {
        let mut conn = db.acquire().await?;
        struct Row {
            exists: Option<bool>,
        }
        let Row { exists } = query_as!(
            Row,
            r#"
            SELECT EXISTS(SELECT 1 FROM "user" WHERE id=$1) as "exists"
        "#,
            id
        )
        .fetch_one(&mut *conn)
        .await?;
        Ok(exists.unwrap_or(false))
    }
    async fn update(&self, db: &Self::Persistence, entity: User) -> RepoResult<User> {
        todo!();
    }
    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> RepoResult<User> {
        todo!();
    }
}

impl UserRepository<PgPool> for PgRepository2 {}
