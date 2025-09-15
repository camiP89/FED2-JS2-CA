import { createHeader } from "./header.mjs";

createHeader();

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");

  const authButtons = document.getElementById("auth-buttons");
  const isLoggedInActions = document.getElementById("logged-in-actions");

  if (token) {
    if (authButtons) authButtons.style.display = "none";
    if (isLoggedInActions) isLoggedInActions.style.display = "block";
  } else {
    if (authButtons) authButtons.style.display = "block";
    if (isLoggedInActions) isLoggedInActions.style.display = "none";
  }
});