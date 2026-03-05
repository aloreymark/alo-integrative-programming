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
