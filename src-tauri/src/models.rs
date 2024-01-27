use crate::error::TauriError;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub type APIResult<T, E = TauriError> = Result<T, E>;

pub type GenericParam<T> = Option<T>;

#[derive(Deserialize, Serialize)]
pub struct Commit {
    commit: Option<CommitNode>,
    committer: Option<Committer>
}

#[derive(Deserialize, Serialize)]
pub struct CommitNode {
    message: String,
    author: Option<CommitAuthor>
}

#[derive(Deserialize, Serialize)]
pub struct CommitAuthor {
    name: String
}

#[derive(Deserialize, Serialize)]
pub struct Committer {
    login: String,
    avatar_url: Option<String>
}

#[derive(Deserialize, Serialize)]
pub struct Gist {
    id: String,
    description: Option<String>,
    owner: GithubUser,
    files: HashMap<String, GistFile>,
    public: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GithubUser {
    login: String,
    name: Option<String>,
    avatar_url: Option<String>,
    location: Option<String>,
    email: Option<String>,
    bio: Option<String>,
    followers: Option<u32>,
    following: Option<u32>
}

#[derive(Deserialize, Serialize)]
pub struct GistFile {
    filename: String,
    language: Option<String>,
    raw_url: String,
}

#[derive(Deserialize, Serialize)]
struct GistContent {
    content: String,
}

#[derive(Deserialize, Serialize)]
pub struct GistInput {
    description: Option<String>,
    files: HashMap<String, GistContent>,
    public: bool,
}

#[derive(Deserialize, Serialize)]
pub struct NewGistResponse {
    id: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Repository {
    id: i32,
    name: String,
    description: Option<String>,
    owner: GithubUser,
    stargazers_url: String,
    commits_url: String,
    contributors_url: String,
}

pub enum URL {
    WithBaseUrl(String),
    WithoutBaseUrl(String),
}

impl URL {
    pub fn value(self) -> String {
        match self {
            URL::WithBaseUrl(url) => format!("https://api.github.com/{url}"),
            URL::WithoutBaseUrl(url) => url,
        }
    }
}

pub struct AuthState {
    pub access_token: String,
    pub expires_in: u64,
    pub refresh_token: String,
    pub refresh_token_expires_in: u64,
    pub scope: String,
    pub token_type: String
}