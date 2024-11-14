//! This module exports a type
//! which implements the repository for all models in the model module
//! given an sql based persistence layer
use super::{
    AccountRepository, CRUDRepository, Create, Delete, Exists, Get, Update, UserRepository,
};
use crate::{
    model::{
        account::{Account, NewAccount},
        user::{NewUser, User},
        Uuid,
    },
    persistence::pg::{query_as, Persistence as SqlPool},
    Result,
};
#[derive(Clone)]
pub struct Repo;
mod account;
mod user;

impl UserRepository<SqlPool> for Repo {}
impl CRUDRepository<User, NewUser, SqlPool> for Repo {}

impl Create<User, NewUser> for Repo {
    type Persistence = SqlPool;

    async fn create(&self, db: &Self::Persistence, new_user: NewUser) -> Result<User> {
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
}

impl Get<User> for Repo {
    type Persistence = SqlPool;

    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<User> {
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
}

impl Update<User> for Repo {
    type Persistence = SqlPool;

    async fn update(&self, db: &Self::Persistence, entity: User) -> Result<User> {
        todo!()
    }
}

impl Delete<User> for Repo {
    type Persistence = SqlPool;

    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<User> {
        todo!()
    }
}

impl Exists<User> for Repo {
    type Persistence = SqlPool;

    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool> {
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
}

impl AccountRepository<SqlPool> for Repo {}

impl CRUDRepository<Account, NewAccount, SqlPool> for Repo {}

impl Create<Account, NewAccount> for Repo {
    type Persistence = SqlPool;

    async fn create(&self, db: &Self::Persistence, new_account: NewAccount) -> Result<Account> {
        let mut conn = db.acquire().await?;
        let account = query_as!(
            Account,
            r#"
        INSERT INTO "account"(user_id, email, provider)
        VALUES($1, $2, $3)
        RETURNING *;
        "#,
            new_account.user_id,
            new_account.email,
            new_account.provider as _,
        )
        .fetch_one(&mut *conn)
        .await?;
        Ok(account)
    }
}

impl Get<Account> for Repo {
    type Persistence = SqlPool;

    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<Account> {
        todo!()
    }
}
impl Update<Account> for Repo {
    type Persistence = SqlPool;

    async fn update(&self, db: &Self::Persistence, entity: Account) -> Result<Account> {
        todo!()
    }
}

impl Delete<Account> for Repo {
    type Persistence = SqlPool;

    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<Account> {
        todo!()
    }
}

impl Exists<Account> for Repo {
    type Persistence = SqlPool;

    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool> {
        todo!();
    }
}

/*
impl AccountRepository<> for Repo {
    type Persistence = PgPool;
    async fn create(&self, db: &Self::Persistence, new_account: NewAccount) -> Result<Account> {
        let conn = db.acquire().await?;
        let account = query_as!(
            Account,
            r#"
        INSERT INTO "account"(user_id, email, provider)
        VALUES($1, $2, $3)
        RETURNING *;
        "#,
            new_account.user_id,
            new_account.email,
            new_account.identity_provider,
        )
        .fetch_one(&mut *conn)
        .await?;
        Ok(account)
    }
    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<Account> {
        todo!();
    }
    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool> {
        todo!();
    }
    async fn update(&self, db: &Self::Persistence, entity: Account) -> Result<Account> {
        todo!();
    }
    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<Account> {
        todo!();
    }
}
*/
