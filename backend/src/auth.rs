use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tracing::debug;

mod oauth;

#[derive(sqlx::Type, Deserialize, Debug, Serialize)]
#[sqlx(type_name = "provider", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum Provider {
    Github,
}

pub type ProviderType = Provider;
pub type IdentityProviderType = Provider;

impl sqlx::postgres::PgHasArrayType for Provider {
    fn array_type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("_provider")
    }
}

/// The name is a bit ambiguous here but we use it to keep in line with
/// the other trait names in this auth package.
/// This should really be understood to be "IdentityProvider", but
/// we will continue to use `Identifier for the rest of this documentation
/// to be consistent.
/// The job of the `Identifier` is to create a new id for clients.
/// An id is simply a trusted object with info about the associated client.
/// In order to do that, the client must:
///     - First, request an id be minted
///     - And then, prove the veracity of the id.
pub trait Identifier {
    /// The id-card that gets minted if a client successfully proves his
    /// identity.
    type Identification;
    /// An opaque token used to reference a given request for an identification.
    type RequestReference;
    /// The information that "proves" the requester is who they say they are
    type Proof;

    // TODO: fn request_identification(&self) -> Result<RequestReference>
    // TODO: fn prove_and_mint_identification(&self, request_token: Self::request_reference, proof:
    // Self::Proof) -> Result<Identification>
}

#[trait_variant::make(Send)]
pub trait Authenticator {
    type Credential;
    async fn authenticate(&self, credential: Self::Credential);
}

trait ExternalAccount {
    fn email(&self) -> &str;
}
