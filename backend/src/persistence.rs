pub mod pg;
// TODO: Remove these re-exports
pub use pg::{connect, Persistence as SqlPersistence};

// TODO: pub trait Persistence {
//  Type Client;
// pub fn start() -> Self::Client
// pub fn commit()
// pub fn rollback()
// }
// TODO: pub trait SqlExecutor<'c>: Executor<'c> {}
