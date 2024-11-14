use crate::model::account::{Account, NewAccount};
use crate::model::user::{NewUser, User};
use crate::model::Uuid;
use crate::Result;
pub mod sql;

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
pub trait Create<Entity, NewEntity> {
    type Persistence;
    async fn create(&self, db: &Self::Persistence, new_entity: NewEntity) -> Result<Entity>;
}
#[trait_variant::make(Send)]
pub trait Get<Entity> {
    type Persistence;
    async fn get(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
}

#[trait_variant::make(Send)]
pub trait Exists<Entity> {
    type Persistence;
    async fn exists(&self, db: &Self::Persistence, id: Uuid) -> Result<bool>;
}

#[trait_variant::make(Send)]
pub trait Update<Entity> {
    type Persistence;
    async fn update(&self, db: &Self::Persistence, entity: Entity) -> Result<Entity>;
}

#[trait_variant::make(Send)]
pub trait Delete<Entity> {
    type Persistence;
    async fn delete(&self, db: &Self::Persistence, id: Uuid) -> Result<Entity>;
}

/// Account Repo
#[trait_variant::make(Send)]
pub trait AccountRepository<Persistence>: CRUDRepository<Account, NewAccount, Persistence> {}

/// User Repo
#[trait_variant::make(Send)]
pub trait UserRepository<Persistence>: CRUDRepository<User, NewUser, Persistence> {}
