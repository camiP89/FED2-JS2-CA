import {
  REGISTER_ENDPOINT,
  LOGIN_ENDPOINT,
  NOROFF_API_KEY,
} from "./constants.mjs";
import { fetchData } from "./apiFetch.mjs";
import { getFromLocalStorage, addToLocalStorage } from "./utils.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";

/**
 * Get headers for authenticated requests
 * @returns {object} headers
 */
export function getAuthHeaders() {
  const token = getFromLocalStorage("accessToken");
  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": NOROFF_API_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Register a new user
 * @param {string} name (Required)
 * @param {string} email (Required)
 * @param {string} password (Required)
 * @param {string} avatarUrl (Optional)
 * @returns {Promise<Object>} user data
 */
export async function registerUser(name, email, password, avatarUrl) {
  const bodyData = { name, email, password };
  if (avatarUrl) {
    bodyData.avatar = { url: avatarUrl, alt: `${name}'s avatar` };
  }
  return fetchData(REGISTER_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(bodyData),
  });
}

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function loginUser(email, password) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  try {
    showSpinner();
    const response = await fetch(LOGIN_ENDPOINT, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error", errorData);
      throw new Error(
        errorData.errors?.[0]?.message || `login failed: ${response.status}`
      );
    }

    const data = await response.json();

    addToLocalStorage("accessToken", data.data.accessToken);
    addToLocalStorage("userName", data.data.name);
    addToLocalStorage("userEmail", data.data.email);

    if (data.data.avatar?.url) {
      addToLocalStorage("avatar.url", data.data.avatar.url);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}
