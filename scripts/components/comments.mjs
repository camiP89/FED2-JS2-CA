import {
  fetchComments,
  postComment,
  deleteComment,
} from "../api/commentsApi.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";

export async function loadComments(
  postId,
  commentsContainerId,
  isLoggedIn,
  userName
) {
  const commentsContainer = document.getElementById(commentsContainerId);
  if (!commentsContainer) return;

  commentsContainer.innerHTML = "";
  showSpinner();

  try {
    const commentsListContainer = document.createElement("div");
    commentsListContainer.classList.add("comments-list-container");
    commentsContainer.appendChild(commentsListContainer);

    let commentsFormContainer;
    if (isLoggedIn) {
      commentsFormContainer = document.createElement("div");
      commentsFormContainer.classList.add("comment-form-container");
      commentsContainer.appendChild(commentsFormContainer);
    }

    const comments = await fetchComments(postId);

    renderComments(commentsListContainer, comments, isLoggedIn, userName);

    if (isLoggedIn) {
      addCommentsForm(
        postId,
        commentsFormContainer,
        commentsListContainer,
        isLoggedIn,
        userName
      );
    }
  } catch (error) {
    console.error("Error loading comments:", error);
    commentsContainer.textContent = "Error loading comments.";
  } finally {
    hideSpinner();
  }

  function renderComments(container, comments, isLoggedIn, userName) {
    container.innerHTML = "";

    if (!comments.length) {
      container.innerHTML =
        '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }

    const commentsList = document.createElement("ul");
    commentsList.classList.add("comments-list");

    comments.forEach((comment) => {
      const li = document.createElement("li");
      li.classList.add("comment-item");

      li.innerHTML = `<span class="comment-author">${comment.owner || "Anonymous"}</span> <p class="comment-body">${comment.body}</p>`;

      if (isLoggedIn && comment.owner === userName) {
        const deleteCommentButton = document.createElement("button");
        deleteCommentButton.type = "button";
        deleteCommentButton.textContent = "Delete";
        deleteCommentButton.classList.add("button");
        deleteCommentButton.setAttribute("aria-label", "Delete this comment");

        deleteCommentButton.addEventListener("click", async () => {
          if (!confirm("Are you sure you want to delete this comment?")) return;
          try {
            showSpinner();
            await deleteComment(postId, comment.id);
            li.remove();
          } catch (error) {
            console.error("Failed to delete comment:, error");
            alert("Failed to delete comment.");
          } finally {
            hideSpinner();
          }
        });

        li.appendChild(deleteCommentButton);
      }
      commentsList.appendChild(li);
    });
    container.appendChild(commentsList);
  }

  function addCommentsForm(
    postId,
    formContainer,
    commentsListContainer,
    isLoggedIn,
    userName
  ) {
    formContainer.innerHTML = "";

    const form = document.createElement("form");
    form.classList.add("comment-form");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Write your comment...";
    textarea.required = true;
    textarea.rows = 3;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Post Comment";

    form.appendChild(textarea);
    form.appendChild(submitButton);
    formContainer.appendChild(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = textarea.value.trim();
      if (!body) return;

      try {
        showSpinner();
        await postComment(postId, body);
        textarea.value = "";

        const updatedComments = await fetchComments(postId);
        renderComments(
          commentsListContainer,
          updatedComments,
          isLoggedIn,
          userName
        );
      } catch (error) {
        console.error("Failed to post comment:", error);
        alert("Failed to post comment.");
      } finally {
        hideSpinner();
      }
    });
  }
}
