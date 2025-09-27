import {
  ALL_POSTS_ENDPOINT,
  API_BASE_URL,
  getSinglePost,
} from "./constants.mjs";
import { fetchData } from "./apiFetch.mjs";
import { getAuthHeaders } from "./authApi.mjs";

export async function fetchAllPosts() {
  return fetchData(
    `${ALL_POSTS_ENDPOINT}?_author=true&_comments=true&_reactions=true`
  );
}

export function fetchSinglePostById(postId) {
  return fetchData(getSinglePost(postId));
}

/**
 * Create a new post
 * @param {string} title
 * @param {string} body
 * @param {Array<string>} tags
 * @param {string} Optional image URL
 * @param {string} Optional image Alt text
 * @returns { Promise<Object}
 */
export function createPost(
  title,
  body,
  tags = [],
  mediaUrl,
  mediaAlt) {
  const url = `${API_BASE_URL}/social/posts`;

  const postData = {
    title,
    body,
    tags,
      ...(mediaUrl ? {media: { url: mediaUrl, alt: mediaAlt || "" } } : {}),
  };

  return fetchData(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });
}

export function updatePostById(postId, postData) {
  return fetchData(`${API_BASE_URL}/social/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });
}

export function fetchPostsByProfile(userName) {
  return fetchData(
    `${API_BASE_URL}/social/profiles/${userName}/posts?_author=true&_comments=true`
  );
}

export async function deletePost(postId) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to delete post.");
  }

  return true;
}
