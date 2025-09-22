import { API_BASE_URL } from "./constants.mjs";
import { getFromLocalStorage } from "./utils.mjs";
import { getAuthHeaders } from "./fetchData.mjs";

export async function followProfile(username) {
  const url = `${API_BASE_URL}/social/profiles/${username}/follow`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to follow");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error following profile:", error.message);
    throw error;
  }
}

export async function unfollowProfile(username) {
  const url = `${API_BASE_URL}/social/profiles/${username}/unfollow`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to unfollow");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error unfollowing profile:", error.message);
    throw error;
  }
}

export function createFollowButtons(profileData) {
  const container = document.getElementById("follow-button-container");
  container.innerHTML = "";

  const loggedInUser = getFromLocalStorage("userName");
  if (!loggedInUser || loggedInUser === profileData.name) return;

  const isFollowing =
    profileData.followers?.some((follower) => follower.name === loggedInUser) ||
    false;

  const followButton = document.createElement("button");
  followButton.textContent = "Follow";
  followButton.style.display = isFollowing ? "none" : "inline-block";

  const unfollowButton = document.createElement("button");
  unfollowButton.textContent = "Unfollow";
  unfollowButton.style.display = isFollowing ? "inline-block" : "none";

  container.appendChild(followButton);
  container.appendChild(unfollowButton);

  followButton.addEventListener("click", async () => {
    try {
      const data = await followProfile(profileData.name);
      profileData.followers = data.followers;

      followButton.style.display = "none";
      unfollowButton.style.display = "inline-block";
    } catch (error) {
      alert(`Failed to follow user: ${error.message}`);
    }
  });

  unfollowButton.addEventListener("click", async () => {
    try {
      const data = await unfollowProfile(profileData.name);
      profileData.followers = data.followers;
      unfollowButton.style.display = "none";
      followButton.style.display = "inline-block";
    } catch (error) {
      console.error("Unfollow error:", error);
      alert(`Failed to unfollow user: ${error.message}`);
    }
  });
}
