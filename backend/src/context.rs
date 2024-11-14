//! Context is arguably the most important module in this crate
//! it is essentially the glue that allows us to code to state, while still
//! passing it in as a parameter. It's functionality is a bit overloaded,
//! but I am still learning.

use crate::repo::{AccountRepository, UserRepository};

/// This is a helper that returns the struct that is threadsafe
/// it is essentially the glue that allows us to code to state, while still
/// passing it in as a parameter. It's functionality is a bit overloaded,
/// but I am still learning.
#[trait_variant::make(Send)]
pub trait AppContext {
    type Persistence;
    type UserRepository: UserRepository<Self::Persistence>;
    type AccountRepository: AccountRepository<Self::Persistence>;
    fn db(&self) -> &Self::Persistence;
    fn user_repo(&self) -> &Self::UserRepository;
    fn account_repo(&self) -> &Self::AccountRepository;
}
