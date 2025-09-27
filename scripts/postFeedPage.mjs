import { createPostsHtml } from "./displayPosts.mjs";
import { fetchAllPosts } from "./postsApi.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { createHeader } from "./header.mjs";

createHeader();

let allPosts = [];

document.addEventListener("DOMContentLoaded", () => {
 main();
});

async function main() {
  const heading = document.querySelector("h1");
  if (heading) heading.textContent = "All Posts";

  showSpinner();

  try {
    allPosts = await fetchAllPosts();
    createPostsHtml(allPosts);
  } catch (error) {
    const postContainer = document.getElementById("posts-container");
    if (postContainer) postContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
  } finally {
  hideSpinner();
  }
}