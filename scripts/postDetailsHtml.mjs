import { renderReactions } from "./reactions.mjs";

export function createPostDetailsHtml(postData, isLoggedIn = false) {
 const singlePostContainer = document.createElement("article");
 singlePostContainer.classList.add("single-post-container");

 const { title, body, media, tags, created, author} = postData;

 const postTitle = document.createElement("h2");
 postTitle.textContent = title || "Untitled Post";
 postTitle.classList.add("post-title");

 const postImage = document.createElement("img");
 postImage.classList.add("post-image");
 if (media?.url) {
   postImage.src = media.url;
   postImage.alt = media.alt || "Post Image";

   postImage.width = 1200;
   postImage.height = 500;
   postImage.setAttribute("decoding", "async");
   postImage.setAttribute("fetchPriority", "high");
 } else {
   console.error("Invalid or missing image URL:", media);
 }

 const postCreated = document.createElement("p");
 postCreated.innerHTML = `<strong>Posted:</strong> ${new Date(created).toLocaleDateString()}`;
 postCreated.classList.add("post-created");

 const postAuthor = document.createElement("p");
 postAuthor.innerHTML = `<strong>Author:</strong> ${author?.name || "Unknown"}`;
 postAuthor.classList.add("post-author");

 const postBody = document.createElement("p");
 postBody.textContent = body || "No content available";
 postBody.classList.add("post-body");

const postTags = document.createElement("p");
if (tags?.length) {
  postTags.innerHTML = `<strong>Tags:</strong> ${tags.join(", ")};`;
  postTags.classList.add("post-tags");
}

const reactionsContainer = document.createElement("div");
reactionsContainer.classList.add("reactions-container");
renderReactions(postData.id, isLoggedIn, reactionsContainer);

singlePostContainer.append(
  postTitle,
  postImage,
  postAuthor,
  postCreated,
  postBody,
  reactionsContainer
);

if (tags?.length) {
  singlePostContainer.appendChild(postTags);
}

return singlePostContainer;
}
