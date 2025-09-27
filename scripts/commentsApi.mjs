import { API_BASE_URL } from "./constants.mjs";
import { getAuthHeaders } from "./authApi.mjs";
import { fetchData } from "./apiFetch.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";

export async function fetchComments(postId) {
  try {
    showSpinner();
    const data = await fetchData(
      `${API_BASE_URL}/social/posts/${postId}?_comments=true`,
      {
        headers: getAuthHeaders(),
      }
    );
    return data?.comments || [];
  } catch (error) {
    console.error("Failed to fetch comments:", error.message);
    return [];
  } finally {
    hideSpinner();
  }
}

export async function postComment(postId, body) {
  try {
    showSpinner();
    const data = await fetchData(
      `${API_BASE_URL}/social/posts/${postId}/comment`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ body }),
      }
    );
    console.log("postComment:", data);
    return data;
  } catch (error) {
    console.error("Error posting comment:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function deleteComment(postId, commentId) {
  try {
    showSpinner();
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      let errorMessage = "Failed to delete comment";
      try {
        const errorData = await response.json();
        errorMessage = errorData.errors?.[0]?.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}
