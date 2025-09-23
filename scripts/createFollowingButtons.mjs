import { getFromLocalStorage } from "./utils.mjs";
import { followProfile, unfollowProfile } from "./followUnfollow.mjs";
import { updateFollowCounts } from "./followingCount.mjs";
import { fetchProfile } from "./profileData.mjs";

export function createFollowButtons(profileData) {
  const container = document.getElementById("follow-button-container");
  container.innerHTML = "";

  const loggedInUser = getFromLocalStorage("userName");
  console.log("Logged in user:", loggedInUser);
  console.log("Profile data at start:", profileData);
  if (!loggedInUser || loggedInUser === profileData.name) return;

  profileData.followers = profileData.followers || [];
  console.log("Initial followers:", profileData.followers);

  const isFollowing = profileData.followers.some(
    (follower) => follower.name === loggedInUser
  );
  console.log("Is following at start:", isFollowing);

  const followButton = document.createElement("button");
  followButton.textContent = "Follow";
  followButton.classList.add("follow-unfollow-button");
  followButton.style.display = isFollowing ? "none" : "inline-block";

  const unfollowButton = document.createElement("button");
  unfollowButton.textContent = "Unfollow";
  unfollowButton.classList.add("follow-unfollow-button");
  unfollowButton.style.display = isFollowing ? "inline-block" : "none";

  container.appendChild(followButton);
  container.appendChild(unfollowButton);

  followButton.addEventListener("click", async () => {
    console.log("Follow button clicked");
    try {
      await followProfile(profileData.name);
      const freshProfile = await fetchProfile(profileData.name);
      profileData.followers = freshProfile.followers || [];
      updateFollowCounts(freshProfile);
      followButton.style.display = "none";
      unfollowButton.style.display = "inline-block";
      console.log("Updated followers after follow:", profileData.followers);
      console.log("Is following after follow:", isFollowing);
    } catch (error) {
      alert(`Failed to follow user: ${error.message}`);
    }
  });

  unfollowButton.addEventListener("click", async () => {
    console.log("Follow button clicked");
    try {
      await unfollowProfile(profileData.name);
      const freshProfile = await fetchProfile(profileData.name);
      profileData.followers = freshProfile.followers || [];
      updateFollowCounts(freshProfile);
      unfollowButton.style.display = "none";
      followButton.style.display = "inline-block";
    } catch (error) {
      alert(`Failed to unfollow user: ${error.message}`);
    }
  });
}
