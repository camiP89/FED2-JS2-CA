import { fetchAllPosts } from "./fetchData.mjs";
import { createPostsHtml } from "./displayPosts.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { createHeader } from "./header.mjs";

createHeader();

const main = document.querySelector("main");

let heading = document.querySelector("main h1");
if (!heading) {
  heading = document.createElement("h1");
  heading.classList.add("heading");
  main.prepend(heading);
}
heading.textContent = "Search Posts";

let searchInput = document.getElementById("search-input");
if (!searchInput) {
  searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search posts...";
  searchInput.classList.add("search-input");
}

let searchContainer = document.getElementById("search-container");
if (!searchContainer) {
  searchContainer = document.createElement("div");
  searchContainer.id = "search-container";
  searchContainer.classList.add("search-results");
}

main.append(searchInput, searchContainer);

let allPosts = [];

function renderPosts() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredPosts = allPosts.filter(
    (post) =>
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(query))
  );

  searchContainer.innerHTML = "";

  if (filteredPosts.length === 0) {
    searchContainer.textContent = "No posts found.";
    return;
  }

  createPostsHtml(
    filteredPosts,
    !!localStorage.getItem("accessToken"),
    "search-container"
  );
}

async function initPosts() {
  try {
    showSpinner();
    allPosts = await fetchAllPosts();
    hideSpinner();
    renderPosts();
  } catch (err) {
    hideSpinner();
    console.error("Error fetching posts:", err);
    searchContainer.textContent = "Error loading posts.";
  }
}

searchInput.addEventListener("input", renderPosts);

initPosts();