import {
  ALL_PROFILES_ENDPOINT,
  getSingleProfile,
  updateProfileUrl,
  FOLLOW_PROFILE_ENDPOINT,
  UNFOLLOW_PROFILE_ENDPOINT,
  getProfileWithFollowers,
  getPostsByProfile,
} from "../constants/constants.mjs";
import { fetchData } from "../api/apiFetch.mjs";

export function fetchAllProfiles() {
  return fetchData(ALL_PROFILES_ENDPOINT);
}

/**
 * Fetch a single profile by username
 * @param {string} username - The profile's username
 * @returns {Promise<Object>} The profile data
 */
export function fetchProfile(username) {
  return fetchData(
    `${getSingleProfile(username)}?_posts=true&_followers=true&_following=true&_count=true`
  );
}

export function fetchPostsByProfile(userName) {
  return fetchData(
    `${getPostsByProfile(userName)}?_author=true&_comments=true`
  );
}

export function updateProfile(username, avatarUrl, bio) {
  const body = {
    ...(avatarUrl && {
      avatar: { url: avatarUrl, alt: `${username}'s avatar` },
    }),
    ...(bio ? { bio } : {}),
  };
  return fetchData(updateProfileUrl(username), {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function followProfile(username) {
  return fetchData(FOLLOW_PROFILE_ENDPOINT(username), { method: "PUT" });
}

export function unfollowProfile(username) {
  return fetchData(UNFOLLOW_PROFILE_ENDPOINT(username), { method: "PUT" });
}

export function fetchProfileWithFollowers(username) {
  return fetchData(getProfileWithFollowers(username));
}
