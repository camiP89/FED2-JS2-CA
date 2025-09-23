export function createHeader() {
  const navContainer = document.getElementById("nav-container");
  const welcomeText = document.getElementById("welcome-text");
  const logoutButton = document.getElementById("logout-button");

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("accessToken");

  if (navContainer) {
    navContainer.innerHTML = `
    <a href="/profile/index.html">My Profile</a>
    <a href="/search/index.html">Search</a>
    <a href="${userName && token ? "/posts/index.html" : "/posts/index.html"}">All Posts</a>
    ${
      !(userName && token)
        ? `
      <a href="/account/login.html">Sign In</a>
      <a href="/account/register.html">Register</a>
    `
        : ""
    }
    `;

    navContainer.classList.add(
      userName && token ? `nav-logged-in` : `nav-logged-out`
    );
  }

  if (userName && token) {
    if (welcomeText) welcomeText.textContent = `Welcome, ${userName}!`;

    if (logoutButton) {
      logoutButton.style.display = "inline-block";
      logoutButton.addEventListener("click", () => {
        localStorage.clear();
        alert("You have logged out! Redirecting to login...");
        location.href = "/account/login.html";
      });
    }
  }
}