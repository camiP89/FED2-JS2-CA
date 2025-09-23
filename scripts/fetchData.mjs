import {
  ALL_POSTS_ENDPOINT,
  getSinglePost,
  API_BASE_URL,
  REGISTER_ENDPOINT,
  LOGIN_ENDPOINT,
  NOROFF_API_KEY,
  ALL_PROFILES_ENDPOINT,
  getSingleProfile,
  getProfileWithFollowers,
} from "./constants.mjs";
import { showSpinner, hideSpinner } from "./loadingSpinner.mjs";
import { getFromLocalStorage } from "./utils.mjs";

/**
 * Get headers for authenticated requests
 * @returns {object} headers
 */
export function getAuthHeaders() {
  const token = getFromLocalStorage("accessToken");
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": NOROFF_API_KEY,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Register a new user
 * @param {string} name (Required)
 * @param {string} email (Required)
 * @param {string} password (Required)
 * @param {string} avatarUrl (Optional)
 * @returns {Promise<Object>}
 */
export async function registerUser(name, email, password, avatarUrl) {
  const bodyData = { name, email, password };
  if (avatarUrl) {
    bodyData.avatar = { url: avatarUrl, alt: `${name}'s avatar` };
  }

  try {
    showSpinner();
    const response = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.message ||
          `Registration failed: ${response.status}`
      );
    }

    const data = await response.json();
    alert("Registration Successful! Redirecting to login...");
    window.location.href = "../account/login.html";
    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function loginUser(email, password) {
  try {
    showSpinner();
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.message || `login failed: ${response.status}`
      );
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("userName", data.data.name);
    localStorage.setItem("userEmail", data.data.email);

    if (data.data.avatar?.url) {
      localStorage.setItem("avatar.url", data.data.avatar.url);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function fetchAllPosts() {
  try {
    showSpinner();
    const response = await fetch(
      `${ALL_POSTS_ENDPOINT}?_author=true&_comments=true&_reactions=true`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching all posts:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function fetchSinglePostById(postId) {
  if (!postId) throw new Error("Post ID is required");

  try {
    showSpinner();
    const response = await fetch(getSinglePost(postId), {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching single post:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function fetchAllProfiles() {
  try {
    showSpinner();
    const response = await fetch(ALL_PROFILES_ENDPOINT, {
      headers: getAuthHeaders(),
    });

    if (!response.ok)
      throw new Error(`Failed to fetch profiles: ${response.statusText}`);

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

/**
 * Fetch a single profile by username
 * @param {string} username - The profile's username
 * @returns {Promise<Object>} The profile data
 */
export async function fetchSingleProfile(username) {
  try {
    showSpinner();
    const response = await fetch(
      `${getSingleProfile(username)}?_posts=true&_followers=true&following=true`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Fetched profile data:", result);
    return result.data;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

/**
 * Create a new post
 * @param {string} title
 * @param {string} body
 * @param {Array<string>} tags
 * @param {string} mediaUrl
 * @param {string} mediaAlt
 * @returns
 */
export async function createPost(title, body, tags, mediaUrl, mediaAlt) {
  const url = `${API_BASE_URL}/social/posts`;
  const postData = {
    title,
    body,
    tags,
    media: {
      url: mediaUrl,
      alt: mediaAlt,
    },
  };

  try {
    showSpinner();
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Post creation failed");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Post creation failed:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function fetchPostsByProfile(userName) {
  const url = `${API_BASE_URL}/social/profiles/${userName}/posts?_author=true&_comments=true&_reactions=true`;
  try {
    showSpinner();
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched posts for profile:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching profile posts:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function updatePostById(postId, postData) {
  const url = `${API_BASE_URL}/social/posts/${postId}`;
  try {
    showSpinner();
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update post: ${errorData.errors?.[0]?.message || response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Network or unexpected error updating post:");
    throw error;
  } finally {
    hideSpinner();
  }
}

export async function fetchProfileWithFollowers(userName) {
  try {
    showSpinner();
    const response = await fetch(
      `${getProfileWithFollowers}${userName}?_followers=true&_count=true`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }
    const result = await response.json();
    console.log("Fetched profile with followers:", result);
    return result.data;
  } catch (error) {
    console.error("Error fetching profile with followers:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}
