import { fetchProfile, updateProfile } from "../api/profileApi.mjs";
import { renderProfile, toggleEditForm } from "../components/profileView.mjs";
import { getAuthHeaders } from "../api/authApi.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";
import { createHeader } from "../components/header.mjs";
import { createPostsHtml } from "../components/displayPosts.mjs";
import { getSingleProfile, getPostsByProfile } from "../constants/constants.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";
import { updateFollowCounts } from "../components/followingCount.mjs";
import { createFollowButtons } from "../components/createFollowingButtons.mjs";

createHeader();

const params = new URLSearchParams(window.location.search);
const viewedUser = params.get("username");
const loggedInUser = getFromLocalStorage("userName");
const token = getFromLocalStorage("accessToken");

const userName = viewedUser || loggedInUser;
const isLoggedIn = !!token;
const isOwner = userName === loggedInUser;

let profileData;

const heading = document.querySelector("h1");
if (heading) {
  heading.textContent = isOwner
    ? `${userName}'s Profile`
    : `${userName}'s Public Profile`;
  const profileContainer = document.createElement("div");
  profileContainer.classList.add("profile-container");

  const profileImgElement = document.createElement("img");
  profileImgElement.classList.add("profile-avatar");
  profileImgElement.src = "../assets/smiley.jpg";
  profileImgElement.alt = `${userName}'s profile picture`;
  profileContainer.appendChild(profileImgElement);

  let bioElement = document.querySelector(".bio-text");
  if (!bioElement) {
    bioElement = document.createElement("p");
    bioElement.classList.add("bio-text");
    profileContainer.appendChild(bioElement);
  }
  heading.insertAdjacentElement("afterend", profileContainer);

  profileData = await fetchProfile(userName);
  renderProfile(profileData, profileImgElement, bioElement, userName);
  createFollowButtons(profileData);
  updateFollowCounts(profileData);

  if (isLoggedIn && isOwner) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Profile";
    editButton.classList.add("edit-profile-button");
    profileContainer.appendChild(editButton);

    editButton.addEventListener("click", () =>
      toggleEditForm(profileContainer, profileData, async (e, form) => {
        e.preventDefault();
        const avatarUrl = form.avatarUrl.value.trim();
        const bio = form.bio.value.trim();
        const updatedData = await updateProfile(userName, avatarUrl, bio);
        renderProfile(updatedData, profileImgElement, bioElement);
        form.remove();
      })
    );

    const createButton = document.createElement("button");
    createButton.textContent = "Create New Post";
    createButton.classList.add("create-post-button");
    createButton.addEventListener("click", () => {
      window.location.href = "../posts/create.html";
    });
    profileContainer.appendChild(createButton);
  }
}

async function loadPosts() {
  try {
    showSpinner();
    const apiUrl = `${getPostsByProfile(userName)}?_author=true`;
    console.log("getPostsByProfile(userName):", getPostsByProfile(userName));

    const response = await fetch(
      `${getPostsByProfile(userName)}?_author=true`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok)
      throw new Error(`Failed to fetch posts: ${response.statusText}`);

    const { data } = await response.json();
    const allPosts = data || [];

    const postContainer = document.getElementById("posts-container");
    if (!postContainer) return;

    if (allPosts.length === 0) {
      postContainer.innerHTML = "<p>No posts available.</p>";
    } else {
      createPostsHtml(allPosts, isLoggedIn, "posts-container", userName);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    const postContainer = document.getElementById("posts-container");
    if (postContainer) {
      postContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    }
  } finally {
    hideSpinner();
  }
}

loadPosts();

async function loadProfile(profileImgElement) {
  if (!userName || !token) return;

  try {
    showSpinner();
    const response = await fetch(
      getSingleProfile(userName) + "?_followers=true&_count=true",
      {
        headers: getAuthHeaders(),
      }
    );
    const { data } = await response.json();
    profileData = data;

    profileImgElement.src = data.avatar?.url || "../assets/smiley.jpg";
    profileImgElement.alt = data.avatar?.alt || `${userName}'s profile picture`;

    if (data.avatar?.url) localStorage.setItem("avatarUrl", data.avatar.url);

    const bioElement = document.querySelector(".bio-text");
    if (bioElement) {
      bioElement.textContent =
        data.bio || "This user hasn't written a bio yet.";
    }

    const followersElement = document.getElementById("followers-count");
    if (followersElement && data._count?.followers !== undefined) {
      followersElement.textContent = `Followers: ${data._count.followers}`;
    }

    createFollowButtons(profileData, updateFollowersCount);
  } catch (error) {
    console.error("Error fetching profile data", error);
  } finally {
    hideSpinner();
  }
}
