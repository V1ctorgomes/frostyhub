let isLoggingIn = false;

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function getUser() {
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  if (!name && !email) return null;

  return { name, email };
}

function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("userName", user.name);
  localStorage.setItem("userEmail", user.email);
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
}

function logout() {
  clearSession();
  window.location.replace("login.html");
}

function handleSessionExpired() {
  clearSession();
  sessionStorage.setItem("sessionExpired", "1");
  window.location.replace("login.html");
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace("login.html");
    return false;
  }
  return true;
}

function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.replace("dashboard.html");
  }
}

function initLogin() {
  redirectIfAuthenticated();

  if (sessionStorage.getItem("sessionExpired")) {
    sessionStorage.removeItem("sessionExpired");
    showToast("Sua sessão expirou. Faça login novamente.", "warning");
  }

  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  const loginBtn = document.getElementById("login-btn");

  form.email.addEventListener("input", () => clearFieldError("email"));
  form.password.addEventListener("input", () => clearFieldError("password"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isLoggingIn) return;

    const email = form.email.value.trim();
    const password = form.password.value;
    const errors = getLoginValidationErrors(email, password);

    errorEl.hidden = true;
    clearFormErrors(form);

    if (Object.keys(errors).length > 0) {
      applyFormErrors(errors);
      errorEl.textContent = "Preencha os campos corretamente.";
      errorEl.hidden = false;
      return;
    }

    isLoggingIn = true;
    showLoading();
    setButtonLoading(loginBtn, true);

    try {
      const result = await api.login(email, password);
      saveSession(result.token, result.user);
      showToast("Login realizado com sucesso.");
      window.location.replace("dashboard.html");
    } catch (error) {
      const message = sanitizeErrorMessage(
        error.message || "Email ou senha inválidos."
      );
      errorEl.textContent = message;
      errorEl.hidden = false;
      showToast("Login inválido.", "error");
    } finally {
      isLoggingIn = false;
      hideLoading();
      setButtonLoading(loginBtn, false);
    }
  });
}

function initDashboardAuth() {
  const user = getUser();
  const userNameEl = document.getElementById("user-name");

  if (user && userNameEl) {
    userNameEl.textContent = user.name;
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}
