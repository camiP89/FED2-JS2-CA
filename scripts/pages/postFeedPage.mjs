import { createPostsHtml } from "../components/displayPosts.mjs";
import { fetchAllPosts } from "../api/postsApi.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { createHeader } from "../components/header.mjs";
import {
  loadMorePosts,
  toggleLoadMore,
  setupLoadMoreButton,
} from "../components/loadMore.mjs";

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
