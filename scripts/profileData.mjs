import { API_BASE_URL, getSingleProfile } from "./constants.mjs";
import { getAuthHeaders } from "./fetchData.mjs";

export async function fetchProfile(username) {
  const response = await fetch(
    `${getSingleProfile(username)}?_followers=true&_following=true&_count=true`,
    {
      headers: getAuthHeaders(),
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${json.errors?.[0]?.message || "Failed to fetch profile"}`
    );
  }
  return json.data;
}

export async function updateProfile(username, avatarUrl, bio) {
  const response = await fetch(`${API_BASE_URL}/social/profiles/${username}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      avatar: avatarUrl
        ? { url: avatarUrl, alt: `${username}'s avatar` }
        : undefined,
      bio: bio || undefined,
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${
        json.errors?.[0]?.message || "Failed to update profile"
      }`
    );
  }
  return json.data;
}