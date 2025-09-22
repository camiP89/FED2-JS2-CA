import { API_BASE_URL } from "./constants.mjs";
import { getAuthHeaders } from "./fetchData.mjs";
import { getFromLocalStorage } from "./utils.mjs";

export async function deletePost(postId) {
  const token = getFromLocalStorage("accessToken");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const url = `${API_BASE_URL}/social/posts/${postId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to delete post.");
  }

  return true;
}
