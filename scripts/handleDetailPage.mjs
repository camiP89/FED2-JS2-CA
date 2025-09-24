import { API_BASE_URL } from "./constants.mjs";
import { createPostDetailsHtml } from "./postDetailsHtml.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { createHeader } from "./header.mjs";
import { getAuthHeaders } from "./fetchData.mjs";
import { loadComments } from "./comments.mjs";

createHeader();

const heading = document.querySelector(".heading-post-title");
const postDetailsContainer = document.querySelector("#post-details-container");

export function getIdFromURL() {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  return {
    postId: params.get("id"),
    user: params.get("user") || localStorage.getItem("userName"),
  };
}

export async function fetchData(url) {
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch post data: ${response.status} ${response.statusText}`
    );
  }
  return await response.json();
}

export async function mainId() {
  const { postId, user } = getIdFromURL();

  if (!postId || !user) {
    postDetailsContainer.innerHTML =
      "<p>Invalid or missing post identifier.</p>";
    console.error("Missing post ID or username.");
    return;
  }

  const url = `${API_BASE_URL}/social/posts/${postId}?_author=true`;

  showSpinner();

  try {
    const data = await fetchData(url);
    const postData = data.data;

    if (!postData) {
      console.error("Post not found.");
      postDetailsContainer.innerHTML = "<p>Post not found.</p>";
      return;
    }

    if (heading && postData?.title) {
      heading.textContent = postData.title;
    }

    const singlePostHtml = createPostDetailsHtml(postData);
    postDetailsContainer.append(singlePostHtml);

    const isLoggedIn = !!localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    const commentsContainerId = "comments-container";
    loadComments(postData.id, commentsContainerId, isLoggedIn, userName);
  } catch (error) {
    console.error("Error fetching post details:", error);
    postDetailsContainer.innerHTML = "<p>Error loading post.</p>";
  } finally {
    hideSpinner();
  }
}

(async () => {
  try {
    await mainId();
  } catch (err) {
    console.error(err);
    postDetailsContainer.innerHTML = "<p>Unexpected error occurred.</p>";
  }
})();
