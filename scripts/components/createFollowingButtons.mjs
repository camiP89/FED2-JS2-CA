import { getFromLocalStorage } from "../utils/utils.mjs";
import { followProfile, unfollowProfile } from "../api/profileApi.mjs";
import { updateFollowCounts } from "../components/followingCount.mjs";
import { fetchProfile } from "../api/profileApi.mjs";

export function createFollowButtons(profileData) {
  const container = document.getElementById("follow-button-container");
  container.innerHTML = "";

  const loggedInUser = getFromLocalStorage("userName");
  if (!loggedInUser || loggedInUser === profileData.name) return;

  profileData.followers = profileData.followers || [];

  const isFollowing = profileData.followers.some(
    (follower) => follower.name === loggedInUser
  );

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
    try {
      await followProfile(profileData.name);
      const freshProfile = await fetchProfile(profileData.name);
      profileData.followers = freshProfile.followers || [];
      updateFollowCounts(freshProfile);
      followButton.style.display = "none";
      unfollowButton.style.display = "inline-block";
    } catch (error) {
      alert(`Failed to follow user: ${error.message}`);
    }
  });

  unfollowButton.addEventListener("click", async () => {
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
