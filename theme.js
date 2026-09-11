const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
let loadedThemes = {};

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch themes from Google Sheets
  await fetchAndPopulateThemes();

  // 2. Get saved theme from localStorage (or default to 'Default')
  const savedThemeName = (localStorage.getItem("selectedTheme") || "Default").toLowerCase();
  
  // 3. Match theme key case-insensitively
  const matchingKey = Object.keys(loadedThemes).find(
    (key) => key.toLowerCase() === savedThemeName
  ) || "Default";

  // 4. Apply current theme to the current page
  applyTheme(matchingKey);

  // 5. If themeDropdown exists on this page (index.html), attach change event listener
  const dropdown = document.getElementById("themeDropdown");
  if (dropdown) {
    dropdown.value = matchingKey;
    dropdown.addEventListener("change", (e) => {
      const selectedName = e.target.value;
      applyTheme(selectedName);
      localStorage.setItem("selectedTheme", selectedName);
    });
  }
});

async function fetchAndPopulateThemes() {
  const dropdown = document.getElementById("themeDropdown");

  try {
    const response = await fetch(SCRIPT_URL);
    const themes = await response.json();

    loadedThemes = {};

    if (dropdown) {
      dropdown.innerHTML = "";
    }

    themes.forEach((theme) => {
      if (!theme.themeName) return; // Skip blank rows

      loadedThemes[theme.themeName] = theme;

      // Fill options if dropdown exists on this page
      if (dropdown) {
        const option = document.createElement("option");
        option.value = theme.themeName;
        option.textContent = theme.themeName;
        dropdown.appendChild(option);
      }
    });
  } catch (err) {
    console.error("Failed to load themes from Google Sheets:", err);
  }
}

function applyTheme(themeName) {
  const theme = loadedThemes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--ribbonColor", theme.ribbonColor);
  root.style.setProperty("--siteNameColor", theme.siteNameColor);
  root.style.setProperty("--siteLogoColor", theme.siteColor);
  root.style.setProperty("--ribbonLinkColor", theme.ribbonLinkColor);
  root.style.setProperty("--bgColor", theme.bgColor);
  root.style.setProperty("--pageTitleColor", theme.pageTitleColor);
}
