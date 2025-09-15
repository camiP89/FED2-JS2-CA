import { API_BASE_URL } from "./constants.mjs";
import { getAuthHeaders } from "./fetchData.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";

export async function reactToPost(postId, emoji) {
  try {
    showSpinner();
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${postId}/react/${encodeURIComponent(emoji)}`,
      { method: "PUT", headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error("Failed to react");

    return await response.json();
  } catch (err) {
    console.error("Error reacting:", err);
  } finally {
    hideSpinner();
  }
}

export function renderReactions(postId, isLoggedIn, container) {
  container.innerHTML = "";
  container.classList.add("reactions-container");

  const emojis = ["😊", "😂", "👌", "👍", "😉", "😎"];
  const reactionKey = `post_${postId}_reactions`;
  const savedReactions = JSON.parse(localStorage.getItem(reactionKey)) || {};

  emojis.forEach((emoji) => {
    const button = document.createElement("button");
    button.classList.add("emoji-button");
    button.dataset.emoji = emoji;

    const emojiSpan = document.createElement("span");
    emojiSpan.textContent = emoji;

    const countSpan = document.createElement("span");
    countSpan.classList.add("count");
    countSpan.textContent = savedReactions[emoji] || 0;

    button.appendChild(emojiSpan);
    button.appendChild(countSpan);

    if (isLoggedIn) {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const result = await reactToPost(postId, emoji);
        if (!result?.data?.reactions) return;

        const newCount =
          result.data.reactions.find((r) => r.symbol === emoji)?.count || 0;

        updateReactionCount(postId, emoji, newCount);
      });
    } else {
      button.disabled = true;
      button.title = "Log in to react";
    }

    container.appendChild(button);
  });

  return container;
}

export function updateReactionCount(postId, emoji, count) {
  const reactionKey = `post_${postId}_reactions`;
  const reactions = JSON.parse(localStorage.getItem(reactionKey)) || {};
  reactions[emoji] = count;
  localStorage.setItem(reactionKey, JSON.stringify(reactions));

  const button = document.querySelector(
    `#post-${postId} .emoji-button[data-emoji="${emoji}"] .count`
  );
  if (button) button.textContent = count;
}
