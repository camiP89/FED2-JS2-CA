import { createSinglePostHtml } from "../components/createSinglePost.mjs";

export function createPostsHtml(
  posts,
  isLoggedIn = false,
  containerId = "posts-container",
  profileUserName = ""
) {
  const postsContainer = document.getElementById(containerId);

  if (!postsContainer) return;

  if (!Array.isArray(posts)) {
    postsContainer.innerHTML = "<p>Could not load posts.</p>";
    return;
  }

  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available</p>";
    return;
  }

  posts.forEach((post) => {
    try {
      const postHtml = createSinglePostHtml(post, isLoggedIn, profileUserName);
      postsContainer.appendChild(postHtml);
    } catch (error) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Error displaying a post.";
      errorMsg.style.color = "red";
      postsContainer.appendChild(errorMsg);
    }
  });
}
