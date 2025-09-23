import { createPost } from "./fetchData.mjs";
import { createHeader } from "./header.mjs";
import { hideSpinner, showSpinner } from "./loadingSpinner.mjs";

createHeader();

let headingText = "Create Post";
let heading = document.querySelector("h1");
heading.innerHTML = headingText;


const postsContainer = document.getElementById("posts-container");

const container = document.createElement("section");
container.classList.add("container");

const postForm = document.createElement("form");
postForm.method = "POST";
postForm.classList.add("form");

const postFields = [
  { label: "Post-Title", id: "post-title", type: "text", placeholder: "Enter title", required: true },
  { label: "Post-Content", id: "post-content", type: "text", placeholder: "Enter content", required: true },
  { label: "Image URL", id: "image-url", type: "text", placeholder: "Enter Image URL", required: true },
  { label: "Image Alt Text", id: "image-alt-text", type: "text", placeholder: "Enter Image Alt Text", required: true },
  { label: "Tags (Separate by commas)", id: "tags", type: "text", placeholder: "Enter Tags", required: true },
];

postFields.forEach((field) => {
  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  let input;
  if (field.id === "post-content") {
   input = document.createElement("textarea");
   input.rows = 6;
   input.style.resize = "vertical";
  } else {
   input = document.createElement("input");
   input.type = field.type;
  }

  input.id = field.id;
  input.name = field.id;
  input.placeholder = field.placeholder;
  if (field.required) input.required = true;

  postForm.appendChild(label);
  postForm.appendChild(input);
});

const publishButton = document.createElement("button");
publishButton.type = "submit";
publishButton.textContent = "Publish";
publishButton.classList.add("button");
publishButton.setAttribute('aria-label', 'Publish new post');

const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel";
cancelButton.classList.add("button");
cancelButton.setAttribute('aria-label', 'Cancel creating new post');

cancelButton.addEventListener("click", () => {
 const confirmCancel = confirm ("Are you sure you want to cancel this post?");
 if (confirmCancel) {
  window.location.href = "../profile-page/index.html";
 }
});

postForm.appendChild(publishButton);
postForm.appendChild(cancelButton);

container.appendChild(postForm);
postsContainer.appendChild(container);

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const postTitle = document.getElementById("post-title").value.trim();
  const postContent = document.getElementById("post-content").value.trim();
  const imageUrl = document.getElementById("image-url").value.trim();
  const imageAltText = document.getElementById("image-alt-text").value.trim();
  const tags = document.getElementById("tags").value
  .split(",")
  .map(tag => tag.trim())
  .filter(tag => tag.length > 0);

  try {
   showSpinner();
   await createPost(
    postTitle,
    postContent,
    tags,
    imageUrl,
    imageAltText
   );

   alert("Post created successfully!");
   window.location.href = "/posts/index.html";
  } catch (error) {
   alert("Failed to create post. Check console for details.");
  } finally {
   hideSpinner();
  }
});