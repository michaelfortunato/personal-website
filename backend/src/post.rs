//! This is the Post _entity_.
//! TODO: (doc) - add link referencing entity in the design doc

use crate::Result;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Post {
    pub id: Uuid,
    // The author of the post, refernces a User
    pub author_id: Uuid,
    pub title: String,
    pub tags: Option<Vec<String>>,
    pub is_published: bool,
    // Maybe this should be a proper String? Nah I think Im right, what about images?
    // I could also consider Base64 encoding the blob on the client.
    // By making this a blob, it is hard to index.
    pub content: Vec<u8>,
}

impl Post {
    pub fn publish(&mut self) {
        self.is_published = true;
    }
    pub fn unpublish(&mut self) {
        self.is_published = false;
    }
}

#[derive(Serialize, Debug, Deserialize)]
pub struct NewPost {
    pub author_id: Uuid,
    pub title: String,
    pub tags: Option<Vec<String>>,
    pub is_published: bool,
    // Maybe this should be a proper String? Nah I think Im right, what about images?
    // I could also consider Base64 encoding the blob on the client.
    // By making this a blob, it is hard to index.
    pub content: Vec<u8>,
}

#[trait_variant::make(Send)]
pub trait Repository {
    async fn get(&self, id: &Uuid) -> Result<Option<Post>>;
    async fn get_by_author_id(&self, author_id: &Uuid) -> Result<Option<Post>>;
    async fn create(&self, new_post: &NewPost) -> Result<Post>;
    async fn update(&self, post: Post) -> Result<Post>;
}
