const STORAGE_KEYS = {
  token: "token",
  userName: "userName",
  userEmail: "userEmail",
};

let isLoggingIn = false;

function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.token);
}

function getUser() {
  const name = localStorage.getItem(STORAGE_KEYS.userName);
  const email = localStorage.getItem(STORAGE_KEYS.userEmail);

  if (!name && !email) return null;

  return { name, email };
}

function saveSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.userName, user.name);
  localStorage.setItem(STORAGE_KEYS.userEmail, user.email);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.userName);
  localStorage.removeItem(STORAGE_KEYS.userEmail);
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

function updateLoginFormState(form) {
  const email = form.email.value.trim();
  const password = form.password.value;
  const errors = getLoginValidationErrors(email, password);
  const loginBtn = document.getElementById("login-btn");

  clearFormErrors(form);
  applyFormErrors(errors);

  if (loginBtn) {
    loginBtn.disabled = Object.keys(errors).length > 0 || isLoggingIn;
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

  form.email.addEventListener("input", () => updateLoginFormState(form));
  form.password.addEventListener("input", () => updateLoginFormState(form));

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
      updateLoginFormState(form);
    }
  });

  updateLoginFormState(form);
}

function initDashboardAuth() {
  if (!requireAuth()) return;

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
