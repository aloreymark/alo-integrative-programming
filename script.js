/* ================= SIGNUP FORM ================= */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  console.log("✅ Signup form found!");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let valid = true;

    function showError(input, msg) {
      input.nextElementSibling.textContent = msg;
      valid = false;
    }

    function clearError(input) {
      input.nextElementSibling.textContent = "";
    }

    // Validation
    if (fullName.value.trim() === "") {
      showError(fullName, "Full Name required");
    } else {
      clearError(fullName);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, "Invalid email");
    } else {
      clearError(email);
    }

    if (!/^(?=.*[0-9]).{6,}$/.test(password.value)) {
      showError(password, "6+ chars, 1 number");
    } else {
      clearError(password);
    }

    if (valid) {
      const user = {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ AUTO-LOGIN: Set session data
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));

      console.log("✅ User created and auto-logged in:", user);
      alert("Account created successfully! Redirecting to profile...");

      // ✅ Redirect directly to profile, NOT login
      window.location.href = "profile.html";
    }
  });
}

/* ================= LOGIN FORM ================= */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  console.log("Login form found!"); // Check if this appears

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Login form submitted!"); // Check if this appears

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    console.log("Email entered:", email); // Check what email was entered
    console.log("Password entered:", password); // Check what password was entered

    const savedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Saved user from localStorage:", savedUser); // Check if user exists

    if (!savedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    console.log("Comparing:", {
      emailMatches: email === savedUser.email,
      passwordMatches: password === savedUser.password,
    });

    if (email === savedUser.email && password === savedUser.password) {
      // ✅ Store session
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(savedUser));

      console.log("Login successful! Redirecting to profile.html");
      alert("Login successful!");
      window.location.href = "profile.html";
    } else {
      console.log("Login failed - incorrect credentials");
      alert("Incorrect email or password");
    }
  });
} else {
  console.log("ERROR: Login form not found! Check ID in HTML");
}

/* ================= PROFILE PAGE ================= */
// This code only runs on profile.html
const usernameEl = document.querySelector(".username");
const emailEl = document.querySelector(".emailLink");

if (usernameEl && emailEl) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loggedIn = localStorage.getItem("loggedIn");

  if (!currentUser || loggedIn !== "true") {
    alert("Please log in first.");
    window.location.href = "login.html";
  } else {
    usernameEl.textContent = currentUser.fullName || "User";
    emailEl.textContent = currentUser.email || "No email";
    emailEl.href = "mailto:" + (currentUser.email || "");
  }
}

/* ================= LOGOUT ================= */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}

/* ================= SETTINGS FORM ================= */
const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
  settingsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("settingsEmail");
    const password = document.getElementById("settingsPassword");
    const theme = document.getElementById("settingsTheme").value;

    let valid = true;

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.nextElementSibling.textContent = "Invalid email";
      valid = false;
    } else {
      email.nextElementSibling.textContent = "";
    }

    // Validate password
    if (!/^(?=.*[0-9]).{6,}$/.test(password.value)) {
      password.nextElementSibling.textContent = "6+ chars, 1 number";
      valid = false;
    } else {
      password.nextElementSibling.textContent = "";
    }

    if (valid) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const updatedUser = {
        ...currentUser,
        email: email.value,
        password: password.value,
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("theme", theme);

      // Apply theme
      document.body.classList.remove("light-mode", "dark-mode");
      document.body.classList.add(
        theme === "Dark" ? "dark-mode" : "light-mode",
      );

      alert("Settings saved!");
    }
  });

  // Load saved data when settings page loads
  window.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loggedIn = localStorage.getItem("loggedIn");

    // Redirect if not logged in
    if (!currentUser || loggedIn !== "true") {
      alert("Please log in first.");
      window.location.href = "login.html";
      return;
    }

    // Populate form with current user data
    if (currentUser) {
      document.getElementById("settingsEmail").value = currentUser.email || "";
      document.getElementById("settingsPassword").value =
        currentUser.password || "";

      // Load and apply theme
      const theme = localStorage.getItem("theme") || "Light";
      document.getElementById("settingsTheme").value = theme;
      document.body.classList.add(
        theme === "Dark" ? "dark-mode" : "light-mode",
      );
    }
  });
}

/* ================= CHECK AUTH STATUS ON ALL PAGES ================= */
// This runs on every page to check if user is logged in
(function checkAuth() {
  const currentPage = window.location.pathname.split("/").pop();
  const publicPages = ["login.html", "signup.html", "index.html"];
  const loggedIn = localStorage.getItem("loggedIn");
  const currentUser = localStorage.getItem("currentUser");

  // If not on a public page and not logged in, redirect to login
  if (!publicPages.includes(currentPage) && (!loggedIn || !currentUser)) {
    if (currentPage !== "" && currentPage !== "/") {
      window.location.href = "login.html";
    }
  }
})();

// Example role check
let userRole = "admin";

if (userRole === "admin") {
  console.log("Admin access granted");
}

// Delete user from table
function deleteUser(button) {
  let row = button.parentElement.parentElement;
  row.remove();
}

// Add new user to table
function addUser(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  let table = document.querySelector("table");

  let newRow = table.insertRow();

  newRow.insertCell(0).innerText = table.rows.length - 1;
  newRow.insertCell(1).innerText = name;
  newRow.insertCell(2).innerText = email;

  let actionCell = newRow.insertCell(3);
  actionCell.innerHTML = '<button onclick="deleteUser(this)">Delete</button>';

  document.querySelector("form").reset();
}

/**
 * Country Explorer App
 * Fetches and displays country information using REST Countries API
 */

// API Configuration
const API_BASE_URL = "https://restcountries.com/v3.1";
const API_FIELDS =
  "name,capital,region,subregion,population,area,currencies,languages,flags,timezones,borders,cca2";

// DOM Elements
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const resultsSection = document.getElementById("resultsSection");
const loadingTemplate = document.getElementById("loadingTemplate");

// Example buttons
const exampleBtns = document.querySelectorAll(".example-btn");

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
countryInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Add click listeners to example buttons
exampleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const country = btn.getAttribute("data-country");
    countryInput.value = country;
    handleSearch();
  });
});

/**
 * Main search handler
 * Validates input and fetches country data
 */
async function handleSearch() {
  const countryName = countryInput.value.trim();

  // Validate input
  if (!countryName) {
    showError("Please enter a country name");
    return;
  }

  // Show loading state
  showLoading();

  try {
    // Fetch country data from API
    const countryData = await fetchCountryData(countryName);

    // Display the results
    displayCountryInfo(countryData);
  } catch (error) {
    console.error("Error:", error);
    showError(error.message);
  }
}

/**
 * Fetch country data from REST Countries API
 * @param {string} countryName - Name of the country to search for
 * @returns {Promise<Object>} Country data
 */
async function fetchCountryData(countryName) {
  const url = `${API_BASE_URL}/name/${encodeURIComponent(countryName)}?fields=${API_FIELDS}`;

  try {
    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Country not found. Please check the spelling and try again.",
        );
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    }

    const data = await response.json();

    // Handle empty response
    if (!data || data.length === 0) {
      throw new Error("No country data found");
    }

    // Return the first matching country
    return data[0];
  } catch (error) {
    // Re-throw network errors
    if (error.name === "TypeError") {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
}

/**
 * Display country information in the UI
 * @param {Object} country - Country data object
 */
function displayCountryInfo(country) {
  // Clear previous results
  resultsSection.innerHTML = "";

  // Format population with commas
  const formattedPopulation = country.population?.toLocaleString() || "N/A";

  // Format area with commas and add km²
  const formattedArea = country.area
    ? `${country.area.toLocaleString()} km²`
    : "N/A";

  // Extract currency information
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => `${currency.name} (${currency.symbol || "N/A"})`)
        .join(", ")
    : "N/A";

  // Extract languages
  const languages = country.languages ? Object.values(country.languages) : [];

  // Create country card HTML
  const countryCard = `
        <div class="country-card">
            <div class="country-header">
                <div class="country-flag">
                    ${
                      country.flags?.svg
                        ? `<img src="${country.flags.svg}" alt="${country.name.common} flag" style="max-width: 120px; max-height: 80px; object-fit: cover;">`
                        : "🏳️"
                    }
                </div>
                <div class="country-name">
                    <h2>${country.name?.common || "N/A"}</h2>
                    <p class="official-name">${country.name?.official || ""}</p>
                </div>
            </div>
            
            <div class="country-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Capital</span>
                        <span class="detail-value">${country.capital?.[0] || "N/A"}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Region</span>
                        <span class="detail-value">${country.region || "N/A"}${country.subregion ? `, ${country.subregion}` : ""}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Population</span>
                        <span class="detail-value">${formattedPopulation}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Area</span>
                        <span class="detail-value">${formattedArea}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Currencies</span>
                        <span class="detail-value">${currencies}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Languages</span>
                        <div class="languages">
                            ${languages.map((lang) => `<span class="language-tag">${lang}</span>`).join("") || "N/A"}
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label">Time Zones</span>
                        <span class="detail-value">${country.timezones?.length || 0}</span>
                    </div>
                </div>
                
                ${
                  country.borders?.length
                    ? `
                    <div class="borders-section">
                        <h3>Bordering Countries</h3>
                        <div class="border-tags">
                            ${country.borders
                              .map(
                                (border) =>
                                  `<span class="border-tag" data-country="${border}">${border}</span>`,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    `;

  // Insert the card
  resultsSection.innerHTML = countryCard;

  // Add click handlers for border countries
  document.querySelectorAll(".border-tag").forEach((tag) => {
    tag.addEventListener("click", async () => {
      countryInput.value = tag.textContent;
      await handleSearch();
    });
  });
}

/**
 * Display loading indicator
 */
function showLoading() {
  const loading = loadingTemplate.content.cloneNode(true);
  resultsSection.innerHTML = "";
  resultsSection.appendChild(loading);
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  resultsSection.innerHTML = `
        <div class="error-message">
            <i>⚠️</i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Initialize the app with a default country
 */
function initializeApp() {
  // Load a default country on first visit
  countryInput.value = "Japan";
  handleSearch();
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", initializeApp);
