import { loginUser } from "../api/authApi.mjs";
import { createHeader } from "../components/header.mjs";
import { addToLocalStorage } from "../utils/utils.mjs";

createHeader();

let headingText = "Login";
let heading = document.querySelector("h1");
heading.innerHTML = headingText;

const formContainer = document.getElementById("form-container");

const container = document.createElement("section");
container.classList.add("container");

const loginForm = document.createElement("form");
loginForm.method = "POST";
loginForm.classList.add("form");

const loginFields = [
  {
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "Enter email",
    required: true,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Enter password",
    required: true,
  },
];

loginFields.forEach((field) => {
  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = field.type;
  input.id = field.id;
  input.name = field.id;
  input.placeholder = field.placeholder;

  if (field.required) input.required = true;

  loginForm.appendChild(label);
  loginForm.appendChild(input);
});

const loginButton = document.createElement("button");
loginButton.type = "submit";
loginButton.textContent = "Login";
loginButton.classList.add("button");
loginButton.setAttribute("aria-label", "Login into your CHATTA Links account");

loginForm.appendChild(loginButton);

container.appendChild(loginForm);
formContainer.appendChild(container);

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const result = await loginUser(email, password);

    if (result?.data) {
      addToLocalStorage("accessToken", result.data.accessToken);
      addToLocalStorage("userName", result.data.name);
      addToLocalStorage("userEmail", result.data.email);

      alert(`Welcome ${result.data.name}!`);
      window.location.href = "/profile/index.html";
    } else {
      throw new Error("Login failed: No data in response.");
    }
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
