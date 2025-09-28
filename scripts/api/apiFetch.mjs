import { getAuthHeaders } from "../api/authApi.mjs";
import { showSpinner, hideSpinner } from "../components/loadingSpinner.mjs";

export async function fetchData(url, options = {}) {
  try {
    showSpinner();

    const headers = { ...(options.headers || {}) };
    if (!options.skipAuth) {
      Object.assign(headers, getAuthHeaders());
    }

    const response = await fetch(url, {
      headers,
      ...options,
      ...options,
    });

    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(
        json.errors?.[0]?.message || `Could not fetch data: ${response.status}`
      );
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  } finally {
    hideSpinner();
  }
}
