export function createPostDetailsHtml(postData, isLoggedIn = false) {
  const singlePostContainer = document.createElement("article");
  singlePostContainer.classList.add("single-post-container");

  const { title, body, media, tags, created, author } = postData;

  const authorName = author?.name ?? "Unknown";
  const authorUserName = author?.name ?? null;

  const authorElement =document.createElement("p");
  authorElement.classList.add("post-author");

  if (authorUserName) {
    authorElement.innerHTML = `
    View Profile: <a href="../profile/index.html?username=${encodeURIComponent(authorUserName)}">
      ${authorName}
    </a>
  `;
  } else {
    authorElement.textContent = "Profile: unknown Author";
  }

  const postTitle = document.createElement("h2");
  postTitle.textContent = title || "Untitled Post";
  postTitle.classList.add("post-title");

  const postImage = document.createElement("img");
  postImage.classList.add("post-image");
  if (media?.url) {
    postImage.src = media.url;
    postImage.alt = media.alt || "Post Image";
    postImage.setAttribute("decoding", "async");
    postImage.setAttribute("fetchPriority", "high");
  } else {
    console.error("Invalid or missing image URL:", media);
  }

  const postCreated = document.createElement("p");
  postCreated.innerHTML = `<strong>Posted:</strong> ${new Date(created).toLocaleDateString()}`;
  postCreated.classList.add("post-created");

  const postBody = document.createElement("p");
  postBody.textContent = body || "No content available";
  postBody.classList.add("post-body");

  const postTags = document.createElement("p");
  if (tags?.length) {
    postTags.innerHTML = `<strong>Tags:</strong> ${tags.join(", ")};`;
    postTags.classList.add("post-tags");
  }

  singlePostContainer.append(
    postTitle,
    postImage,
    postCreated,
    postBody,
     authorElement
  );

  if (tags?.length) {
    singlePostContainer.appendChild(postTags);
  }

  return singlePostContainer;
}