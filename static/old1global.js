function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2: Automatic current page link
let navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

if (currentLink) {
  currentLink.classList.add("current");
}


// Step 4.2: Adding HTML for the dark mode switch
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme" style="position: absolute; top: 1rem; right: 1rem; font-size: 0.8rem;">
      Theme:
      <select id="theme-select">
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
      </select>
  </label>`
);

// Step 4.4: Actual theme change logic
const select = document.getElementById('theme-select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  if (colorScheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  localStorage.colorScheme = colorScheme; // Persist the preference
}

select.addEventListener('input', function (event) {
  const selectedValue = event.target.value;
  setColorScheme(selectedValue);
});

// Step 4.5: Load user's preference
if ("colorScheme" in localStorage) {
  select.value = localStorage.colorScheme;
  setColorScheme(localStorage.colorScheme);
} else {
  // Default to system preference
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setColorScheme(prefersDarkScheme ? "dark" : "light");
}
