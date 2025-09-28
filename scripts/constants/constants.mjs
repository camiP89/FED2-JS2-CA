//Noroff Base Url
export const API_BASE_URL = "https://v2.api.noroff.dev";

//Auth
export const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
export const CREATE_API_KEY_ENDPOINT = `${API_BASE_URL}/auth/create-api-key`;

//Noroff API key - from API key tool
export const NOROFF_API_KEY = "e3f43060-ff38-4fd8-8128-f7cc02b4a5a9";

//Posts Endpoints
export const ALL_POSTS_ENDPOINT = `${API_BASE_URL}/social/posts`;
export const getSinglePost = (postId) =>
  `${API_BASE_URL}/social/posts/${postId}`;
export const deletePost = (postId) => `${API_BASE_URL}/social/posts/${postId}`;
export const updatePost = (postId) => `${API_BASE_URL}/social/posts/${postId}`;
export const POSTS_FROM_FOLLOWING = `${API_BASE_URL}/social/posts/following`;
export const searchPosts = (query) =>
  `${API_BASE_URL}/social/posts/search?q=${query}`;
export const createPostEndpoint = `${API_BASE_URL}/social/posts`;

//Profiles Endpoints
export const ALL_PROFILES_ENDPOINT = `${API_BASE_URL}/social/profiles`;
export const getSingleProfile = (username) =>
  `${API_BASE_URL}/social/profiles/${username}`;
export const getPostsByProfile = (username) =>
  `${API_BASE_URL}/social/profiles/${username}/posts`;
export const FOLLOW_PROFILE_ENDPOINT = (username) =>
  `${API_BASE_URL}/social/profiles/${username}/follow`;
export const UNFOLLOW_PROFILE_ENDPOINT = (username) =>
  `${API_BASE_URL}/social/profiles/${username}/unfollow`;
export const searchProfiles = (query) =>
  `${API_BASE_URL}/social/profiles/search?q=${query}`;
export const updateProfileUrl = (username) =>
  `${API_BASE_URL}/social/profiles/${username}`;
export const getProfileWithFollowers = (username) =>
  `${API_BASE_URL}/social/profiles/${username}?_followers=true&_count=true`;
