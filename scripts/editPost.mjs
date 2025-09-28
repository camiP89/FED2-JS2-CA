import { updatePostById, fetchSinglePostById } from "./postsApi.mjs";
import { getFromLocalStorage } from "./utils.mjs";
import { createHeader } from "./header.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";

createHeader();

document.querySelector("h1").textContent = "Edit Post";

function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
const postId = getPostIdFromURL();

const editPostsContainer = document.getElementById("edit-post-container");
const container = document.createElement("section");
container.classList.add("container");

const editForm = document.createElement("form");
editForm.classList.add("form");

const postFields = [
  {
    label: "Post-Title",
    id: "post-title",
    type: "text",
    placeholder: "Enter title",
    required: true,
  },
  {
    label: "Post-Content",
    id: "post-content",
    type: "textarea",
    placeholder: "Enter content",
    required: true,
  },
  {
    label: "Image URL",
    id: "image-url",
    type: "text",
    placeholder: "Enter Image URL",
    required: false,
  },
  {
    label: "Image Alt Text",
    id: "image-alt-text",
    type: "text",
    placeholder: "Enter Image Alt Text",
    required: false,
  },
  {
    label: "Tags (Separate by commas)",
    id: "tags",
    type: "text",
    placeholder: "Enter Tags",
    required: false,
  },
];

postFields.forEach((field) => {
  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  const input =
    field.type === "textarea"
      ? Object.assign(document.createElement("textarea"), {
          rows: 6,
          style: "resize: vertical",
        })
      : document.createElement("input");

  input.id = field.id;
  input.name = field.id;
  input.placeholder = field.placeholder;
  if (field.required) input.required = true;

  editForm.appendChild(label);
  editForm.appendChild(input);
});

const publishButton = document.createElement("button");
publishButton.type = "submit";
publishButton.textContent = "Update Post";
publishButton.classList.add("button");
publishButton.setAttribute("aria-label", "Update this post");

const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel Update";
cancelButton.classList.add("button");
cancelButton.setAttribute("aria-label", "Cancel this update");

cancelButton.addEventListener("click", async () => {
  if (confirm("Are you sure you want to cancel editing this post?")) {
    const loggedInUser = getFromLocalStorage("userName");
    window.location.href = `../profile/index.html?username=${getFromLocalStorage("userName")}`;
  }
});

editForm.appendChild(publishButton);
editForm.appendChild(cancelButton);
container.appendChild(editForm);
editPostsContainer.appendChild(container);

async function populateForm() {
  try {
    showSpinner();
    const post = await fetchSinglePostById(postId);

    document.getElementById("post-title").value = post.title || "";
    document.getElementById("post-content").value = post.body || "";
    document.getElementById("image-url").value = post.media?.url || "";
    document.getElementById("image-alt-text").value = post.media?.alt || "";
    document.getElementById("tags").value = post.tags?.join(", ") || "";
    console.log("Fetched post:", post);
  } catch (error) {
    console.error("Failed to fetch post data:", error);
    alert("Could not load post for editing.");
  } finally {
    hideSpinner();
  }
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-content").value.trim();
    const tags = document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);


     const mediaUrl = document.getElementById("image-url").value.trim();
      const mediaAlt = document.getElementById("image-alt-text").value.trim();
      const media = mediaUrl || mediaAlt ? { url: mediaUrl, alt: mediaAlt } : undefined;

      const updatePost = { title, body, tags };
      if (media) updatePost.media = media;

  try {
    showSpinner();
    await updatePostById(postId, updatePost);
    alert("Post updated successfully!");
    window.location.href = `../profile/index.html?username=${getFromLocalStorage("userName")}`;
  } catch (error) {
    console.error("Failed to update post:", error);
    alert("Failed to update post.");
  } finally {
    hideSpinner();
  }
});


populateForm();
