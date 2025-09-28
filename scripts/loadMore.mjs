import { createPostsHtml } from "./displayPosts.mjs";

export function loadMorePosts(posts, currentIndex, pageSize = 10, containerId = "posts-container", isPost = true) {
  const nextPosts = posts.slice(currentIndex, currentIndex + pageSize);
  createPostsHtml(nextPosts, isPost, containerId);
  return currentIndex + pageSize;
}

export function toggleLoadMore(buttonId, currentIndex, totalPosts) {
const button = document.getElementById(buttonId);
if (!button) return;
button.style.display = currentIndex < totalPosts ? "block" : "none";
}

export function setupLoadMoreButton(buttonId, callback) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener("click", callback);
}
