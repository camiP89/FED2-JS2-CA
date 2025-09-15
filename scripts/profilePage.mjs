import { API_BASE_URL } from "./constants.mjs";
import { createPostsHtml } from "./displayPosts.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { createHeader } from "./header.mjs";
import { getAuthHeaders } from "./fetchData.mjs";

createHeader();

const params = new URLSearchParams(window.location.search);
const viewedUser = params.get("username");
const loggedInUser = localStorage.getItem("username");
const token = localStorage.getItem("accessToken");

const userName = viewedUser || loggedInUser;
const isLoggedIn = !!token;
const isOwner = userName === loggedInUser;

let profileData = {};

const heading = document.querySelector("h1");
if (heading) {
  heading.textContent = isOwner
    ? `${userName}'s Profile`
    : `${userName}'s Public Profile`;

  if (heading) {
    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profile-container");

    const profileImg = document.createElement("img");
    profileImg.classList.add("profile-avatar");
    profileImg.src = "../assets/smiley.jpg";
    profileImg.alt = `${userName}'s profile picture`;
    profileContainer.appendChild(profileImg);

    if (isLoggedIn && isOwner) {
      const editButton = document.createElement("button");
      editButton.textContent = "Edit Profile";
      editButton.classList.add("edit-profile-button");
      profileContainer.appendChild(editButton);

      editButton.addEventListener("click", () =>
        toggleEditForm(profileContainer, profileImg)
      );

      const createButton = document.createElement("button");
      createButton.textContent = "Create New Post";
      createButton.classList.add("create-post-button");
      createButton.addEventListener("click", () => {
        window.location.href = "../posts/create.html";
      });

      heading.insertAdjacentElement("afterend", createButton);
    }

    heading.insertAdjacentElement("afterend", profileContainer);
  }

  loadProfile(profileImg);
  loadPosts();
}

function toggleEditForm(container, profileImg) {
  const existingForm = document.querySelector(".editprofile-form");
  if (existingForm) {
    existingForm.remove();
    return;
  }

  const form = document.createElement("form");
  form.classList.add("edit-profile-form");
  form.innerHTML = `
  <label>
      Avatar URL:
      <input type="url" name="avatarUrl" placeholder="Enter new avatar URL"
             value="${profileData.avatar?.url || ""}">
    </label>
    <label>
      Bio:
      <textarea name="bio" placeholder="Enter your bio">${profileData.bio || ""}</textarea>
    </label>
    <button type="submit">Save</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const avatarUrl = form.avatarUrl.value.trim();
    const bio = form.bio.value.trim();

    try {
      const response = await fetch(
        `${API_BASE_URL}/social/profiles/${userName}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            avatar: avatarUrl
              ? { url: avatarUrl, alt: `${userName}'s avatar` }
              : undefined,
            bio: bio || undefined,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.errors?.[0]?.message || "Failed to update profile");
      }

      const data = await response.json();
      profileData = data.data;

      profileImg.src = profileData.avatar?.url || "../assets/smiley.jpg";
      profileImg.alt =
        profileData.avatar?.alt || `${userName}'s profile picture`;

      const bioElement = document.querySelector(".bio-text");
      if (bioElement) {
        bioElement.textContent =
          profileData.bio || "This user hasn't written a bio yet.";
      }

      if (profileData.avatar?.url)
        localStorage.setItem("avatarUrl", profileData.avatar.url);
      form.remove();
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Could not update profile.");
    }
  });

  container.appendChild(form);
}

async function loadProfile(profileImgElement) {
  if (!userName || !token) return;

  try {
    showSpinner();
    const response = await fetch(
      `${API_BASE_URL}/social/profiles/${userName}`,
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
  } catch (error) {
    console.error("Error fetching profile data", error);
  } finally {
    hideSpinner();
  }
}

async function loadPosts() {
  try {
    showSpinner();
    const endpoint = `${API_BASE_URL}/social/profiles/${userName}/posts`;
    const response = await fetch(endpoint, { headers: getAuthHeaders() });

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
