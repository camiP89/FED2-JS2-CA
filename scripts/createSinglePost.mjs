import { deletePost } from "./deletePost.mjs";
import { getFromLocalStorage } from "./utils.mjs";

export function createSinglePostHtml(
  post,
  isLoggedIn = false,
  profileUserName = null
) {
  const postListItem = document.createElement("div");
  postListItem.classList.add("post-wrapper");
  postListItem.id = `post-${post.id}`;

  const authorName = post.author?.name || profileUserName || "Unknown Author";

  const loggedInUser = getFromLocalStorage("userName");
  const isOwnPost = loggedInUser === authorName;

  const postLink = document.createElement("a");
  postLink.href = `../posts/post.html?id=${post.id}&user=${authorName}`;
  postLink.classList.add("post-thumbnail");

  const postImage = document.createElement("img");
  postImage.classList.add("thumbnail-image");
  postImage.loading = "lazy";
  postImage.src = post.media?.url ?? "../assets/smiley.jpg";
  postImage.alt = post.media?.alt ?? "Default post image";

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("post-content");

  const postTitle = document.createElement("h2");
  postTitle.textContent = post.title || "No Title Available";
  postTitle.classList.add("thumbnail-title");
  contentContainer.appendChild(postTitle);

  if (post.body) {
    const postBody = document.createElement("p");
    postBody.classList.add("post-body");
    postBody.textContent = post.body;
    contentContainer.appendChild(postBody);
  }

  const authorElement = document.createElement("p");
  authorElement.classList.add("post-author");
  authorElement.innerHTML = `
    By: <a href="../profile/index.html?username=${encodeURIComponent(authorName)}">
          ${authorName}
        </a>
  `;
  contentContainer.appendChild(authorElement);

  if (post.created) {
    const createdDate = new Date(post.created).toLocaleDateString();
    const dateElement = document.createElement("p");
    dateElement.classList.add("post-date");
    dateElement.textContent = `Created: ${createdDate}`;
    contentContainer.appendChild(dateElement);
  }

  if (isLoggedIn && isOwnPost) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("post-action-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `../posts/edit.html?id=${post.id}`;
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
        try {
          await deletePost(post.id);
          alert("Post deleted successfully!");
          postListItem.remove();
        } catch (error) {
          console.error("Failed to delete post:", error);
          alert("Failed to delete post!");
        }
      }
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    contentContainer.appendChild(buttonContainer);
  }

  postLink.appendChild(postImage);
  postLink.appendChild(contentContainer);
  postListItem.appendChild(postLink);

  return postListItem;
}
