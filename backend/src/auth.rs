use serde::{Deserialize, Serialize};

use crate::{
    model::user::NewUser,
    repo::{AccountRepository, UserRepository},
    result::Error,
};

mod oauth;

#[derive(Deserialize, Debug, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Provider {
    Github,
}

pub type ProviderType = Provider;
pub type IdentityProviderType = Provider;

pub type RegistrationToken = String;

pub async fn register<
    Persistence,
    UserRepo: UserRepository<Persistence>,
    AccountRepo: AccountRepository<Persistence>,
>(
    new_user: NewUser,
    identity_provider: IdentityProviderType,
    db: Persistence,
    user_repo: UserRepo,
    account_repo: AccountRepo,
) -> Result<RegistrationToken, Error> {
    todo!();
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
