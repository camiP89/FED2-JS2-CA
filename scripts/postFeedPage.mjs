import { createPostsHtml } from "./displayPosts.mjs";
import { fetchAllPosts } from "./postsApi.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { createHeader } from "./header.mjs";
import {
  loadMorePosts,
  toggleLoadMore,
  setupLoadMoreButton,
} from "./loadMore.mjs";

createHeader();

let allPosts = [];
let currentIndex = 0;
const pageSize = 10;

document.addEventListener("DOMContentLoaded", () => {
  main();
});

async function main() {
  const heading = document.querySelector("h1");
  if (heading) heading.textContent = "All Posts";

  showSpinner();
  try {
    allPosts = await fetchAllPosts();

    currentIndex = loadMorePosts(allPosts, currentIndex, pageSize);

    toggleLoadMore("load-more-button", currentIndex, allPosts.length);

    setupLoadMoreButton("load-more-button", () => {
      currentIndex = loadMorePosts(allPosts, currentIndex, pageSize);
      toggleLoadMore("load-more-button", currentIndex, allPosts.length);
    });
  } catch (error) {
    const postContainer = document.getElementById("post-container");
    if (postContainer)
      postContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
  } finally {
    hideSpinner();
  }
}
