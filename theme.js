const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
let loadedThemes = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch themes from Google Sheets
  await fetchAndPopulateThemes();

  // Get saved theme from localStorage or default to lower-case 'default'
  const savedThemeName = (localStorage.getItem("selectedTheme") || "Default").toLowerCase();
  
  // Find key in loadedThemes (case-insensitive lookup)
  const matchingKey = Object.keys(loadedThemes).find(
    (key) => key.toLowerCase() === savedThemeName
  ) || "Default";

  applyTheme(matchingKey);

  // If dropdown exists on this page (e.g., books.html), bind listener
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
      if (!theme.themeName) return; // Skip empty rows

      loadedThemes[theme.themeName] = theme;

      // Populate dropdown if present on current page
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
  root.style.setProperty("--siteLogoColor", theme.siteColor); // Mapped siteColor -> --siteLogoColor
  root.style.setProperty("--ribbonLinkColor", theme.ribbonLinkColor);
  root.style.setProperty("--bgColor", theme.bgColor);
  root.style.setProperty("--pageTitleColor", theme.pageTitleColor);
}
