//! Context is arguably the most important module in this crate
//! it is essentially the glue that allows us to code to state, while still
//! passing it in as a parameter. It's functionality is a bit overloaded,
//! but I am still learning.

use std::{ops::Deref, sync::Arc};

use crate::repo::{AccountRepository, UserRepository};

/// This is a helper that returns the struct that is threadsafe
/// it is essentially the glue that allows us to code to state, while still
/// passing it in as a parameter. It's functionality is a bit overloaded,
/// but I am still learning.
pub struct AppContext<P, UR: UserRepository<P>, AR: AccountRepository<P>> {
    pub persistence: P,
    pub user_repo: UR,
    pub account_repo: AR,
}

impl<P, UR, AR> AppContext<P, UR, AR>
where
    UR: UserRepository<P>,
    AR: AccountRepository<P>,
{
    pub fn new(persistence: P, user_repo: UR, account_repo: AR) -> Self {
        Self {
            persistence,
            user_repo,
            account_repo,
        }
    }
}

/// This is a helper that returns the struct that is threadsafe
#[derive(Clone)]
pub struct ThreadSafeAppContext<P, UR, AR>(Arc<AppContext<P, UR, AR>>)
where
    P: Send + Sync + Clone,
    UR: UserRepository<P> + Clone + Send + Sync,
    AR: AccountRepository<P> + Clone + Send + Sync;
// deref so you can still access the inner fields easily
impl<P, UR, AR> Deref for ThreadSafeAppContext<P, UR, AR>
where
    P: Send + Sync + Clone,
    UR: UserRepository<P> + Clone + Send + Sync,
    AR: AccountRepository<P> + Clone + Send + Sync,
{
    type Target = AppContext<P, UR, AR>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<P, UR, AR> From<AppContext<P, UR, AR>> for ThreadSafeAppContext<P, UR, AR>
where
    P: Send + Sync + Clone,
    UR: UserRepository<P> + Clone + Send + Sync,
    AR: AccountRepository<P> + Clone + Send + Sync,
{
    fn from(value: AppContext<P, UR, AR>) -> Self {
        Self(Arc::new(value))
    }
}
