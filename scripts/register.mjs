import { registerUser } from "./authApi.mjs";
import { createHeader } from "./header.mjs";

createHeader();

const heading = document.querySelector("h1");
heading.textContent = "Register";

const formContainer = document.getElementById("form-container");
const container = document.createElement("section");
container.classList.add("container");

const registrationForm = document.createElement("form");
registrationForm.method = "POST";
registrationForm.classList.add("form");

const registrationFields = [
  {
    label: "Name",
    id: "name",
    type: "text",
    placeholder: "Enter name",
    required: true,
  },
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
  {
    label: "Avatar URL",
    id: "avatarUrl",
    type: "url",
    placeholder: "Enter a public image URL",
    required: false,
  },
];

registrationFields.forEach((field) => {
  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = field.type;
  input.id = field.id;
  input.name = field.id;
  input.placeholder = field.placeholder;
  if (field.required) input.required = true;

  registrationForm.appendChild(label);
  registrationForm.appendChild(input);
});

const registerButton = document.createElement("button");
registerButton.type = "submit";
registerButton.textContent = "Register";
registerButton.classList.add("button");
registerButton.setAttribute(
  "aria-label",
  "Register a new CHATTA Links account"
);

registrationForm.appendChild(registerButton);
container.appendChild(registrationForm);
formContainer.appendChild(container);

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const avatarUrl = document.getElementById("avatarUrl").value.trim();

  try {
    const result = await registerUser(name, email, password, avatarUrl);
    console.log("User registered:", result);

    alert("Registration successful! Redirecting to login...");
    window.location.href = "../account/login.html";
    registrationForm.reset();
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
});
