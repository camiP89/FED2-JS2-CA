export function updateFollowCounts(profileData) {
  const followersElement = document.getElementById("followers-count");
  const followingElement = document.getElementById("following-count");

  if (!followersElement || !followingElement) return;

  const followersCount = Array.isArray(profileData.followers)
    ? profileData.followers.length
    : 0;

  const followingCount = Array.isArray(profileData.following)
    ? profileData.following.length
    : 0;

  followersElement.innerHTML = `<a href="#" id="followers-link">Followers: ${followersCount}</a>`;
  followingElement.innerHTML = `<a href="#" id="following-link">Following: ${followingCount}</a>`;

  document
    .getElementById("followers-link")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      showFollowersModal(profileData.followers);
    });

  document
    .getElementById("following-link")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      showFollowingModal(profileData.following);
    });
}

function showFollowersModal(followers) {
  const modal = document.createElement("div");
  modal.classList.add("followers-modal");

  followers.forEach((follower) => {
    const followerLink = document.createElement("a");
    followerLink.textContent = follower.name;
    followerLink.href = `/profile/index.html?username=${encodeURIComponent(follower.name)}`;
    followerLink.classList.add("follower-link");
    modal.appendChild(followerLink);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => modal.remove());
  modal.appendChild(closeButton);

  document.body.appendChild(modal);
}

function showFollowingModal(following) {
  const modal = document.createElement("div");
  modal.classList.add("following-modal");

  following.forEach((followedUser) => {
    const followingLink = document.createElement("a");
    followingLink.textContent = followedUser.name;
    followingLink.href = `/profile/index.html?username=${encodeURIComponent(followedUser.name)}`;
    followingLink.classList.add("following-link");
    modal.appendChild(followingLink);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => modal.remove());
  modal.appendChild(closeButton);

  document.body.appendChild(modal);
}
