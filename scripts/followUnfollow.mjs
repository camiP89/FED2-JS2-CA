import { API_BASE_URL } from "./constants.mjs";
import { getAuthHeaders } from "./fetchData.mjs";

export async function followProfile(username) {
  const url = `${API_BASE_URL}/social/profiles/${username}/follow`;
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to follow");
  }

  const data = await response.json();
  return data.data;
}

export async function unfollowProfile(username) {
  const url = `${API_BASE_URL}/social/profiles/${username}/unfollow`;
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to unfollow");
  }

  const data = await response.json();
  return data.data;
}