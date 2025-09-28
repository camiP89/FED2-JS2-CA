import { createHeader } from "../components/header.mjs";
import { getFromLocalStorage } from "../utils/utils.mjs";

createHeader();

document.addEventListener("DOMContentLoaded", () => {
  const token = getFromLocalStorage("accessToken");

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
