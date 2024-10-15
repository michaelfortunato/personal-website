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
pub trait Repository {
    async fn get(&self, id: &Uuid) -> Result<Option<User>>;
    async fn get_by_username(&self, username: &str) -> Result<Option<User>>;
    async fn get_by_email(&self, email: &str) -> Result<Option<User>>;
    async fn create(&self, new_user: &NewUser) -> Result<User>;
    async fn link_account(&self, user: &User, account: NewAccount) -> Result<Account>;
    async fn unlink_account(&self, user: &User, id: &Uuid) -> Result<Account>;
}

pub struct PgRepository<'c> {
    db_pool: &'c PgPool,
}

impl<'c> PgRepository<'c> {
    pub fn new(db_pool: &'c PgPool) -> Self {
        Self { db_pool }
    }
}

impl<'c> Repository for PgRepository<'c> {
    async fn create(&self, new_user: &NewUser) -> Result<User> {
        let mut conn = self.db_pool.acquire().await.unwrap();
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
        .await
        .map_err(Error::from)?; // Manual conversion here
        Ok(user)
    }
    async fn get(&self, id: &Uuid) -> Result<Option<User>> {
        let mut conn = self.db_pool.acquire().await.unwrap();
        let user = query_as!(
            User,
            r#"
        SELECT * from "user"
        WHERE id = $1;
        "#,
            id
        )
        .fetch_optional(&mut *conn)
        .await
        .map_err(Error::from)?; // Manual conversion here
        Ok(user)
    }
    async fn get_by_username(&self, _username: &str) -> Result<Option<User>> {
        todo!()
    }
    async fn get_by_email(&self, _email: &str) -> Result<Option<User>> {
        todo!()
    }

    async fn link_account(&self, user: &User, new_account: NewAccount) -> Result<Account> {
        let mut conn = self.db_pool.acquire().await.unwrap();
        let account = query_as!(
            Account,
            r#"
        INSERT INTO "account"(email, provider)
        VALUES($1, $2)
        RETURNING email, provider "provider: Provider";
        "#,
            new_account.email,
            new_account.provider as Provider
        )
        .fetch_one(&mut *conn)
        .await
        .map_err(Error::from)?;
        Ok(account)
    }

    async fn unlink_account(&self, user: &User, id: &Uuid) -> Result<Account> {
        todo!();
    }
}
