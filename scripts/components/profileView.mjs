import { addToLocalStorage } from "../utils/utils.mjs";

/**
 * Render the profile image and bio.
 * @param {Object} profileData - Profile data from the API
 * @param {HTMLElement} profileImgElement - The <img> element for avatar.
 * @param {HTMLElement} bioElement - The element to show bio text.
 */
export function renderProfile(
  profileData,
  profileImgElement,
  bioElement,
  userName
) {
  profileImgElement.src = profileData.avatar?.url || "../assets/smiley.jpg";
  profileImgElement.alt =
    profileData.avatar?.alt || `${userName}'s profile picture`;

  if (bioElement) {
    bioElement.textContent =
      profileData.bio || "This user hasn't written a bio yet.";

    if (profileData.avatar?.url)
      addToLocalStorage("avatarUrl", profileData.avatar.url);
  }
}

/**
 * Toggle the edit form for avatar and bio.
 * @param {HTMLElement} container - Where to append the form.
 * @param {Object} profileData - Current profile data.
 * @param {Function} onSave - Callback when the form is submitted.
 */
export function toggleEditForm(container, profileData, onSave) {
  const existingForm = document.querySelector(".edit-profile-form");
  if (existingForm) {
    existingForm.remove();
    return;
  }

  const form = document.createElement("form");
  form.classList.add("edit-profile-form");
  form.innerHTML = `
  <label>
      Avatar URL:
      <input type="url" name="avatarUrl" placeholder="Enter new avatar URL"
             value="${profileData.avatar?.url || ""}">
    </label>
    <label>
      Bio:
      <textarea name="bio" placeholder="Enter your bio">${profileData.bio || ""}</textarea>
    </label>
    <button class="save-button" type="submit">Save</button>
  `;

  form.addEventListener("submit", (e) => onSave(e, form));
  container.appendChild(form);
}
