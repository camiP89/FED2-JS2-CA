let spinnerCount = 0;

export function showSpinner() {
 spinnerCount++;
 let spinner = document.getElementById("loading-spinner");

 if (!spinner) {
  spinner = document.createElement("div");
  spinner.id = "loading-spinner";

  spinner.setAttribute('role', 'status');
  spinner.setAttribute('aria-live', 'polite');
  spinner.setAttribute('aria-label', 'Loading');

  const loader = document.createElement("div");
  loader.classList.add("loader");

  spinner.appendChild(loader);
  document.body.appendChild(spinner);
 }

 spinner.style.display = "flex";
 document.body.classList.add("loading");
}

export function hideSpinner() {
 if (spinnerCount > 0) spinnerCount--;

 if (spinnerCount === 0) {
   const spinner = document.getElementById("loading-spinner");
   if (spinner) {
   spinner.style.display = "none";
   document.body.classList.remove("loading");
  }
 }
}