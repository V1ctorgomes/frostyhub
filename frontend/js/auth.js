const STORAGE_KEYS = {
  token: "token",
  userName: "userName",
  userEmail: "userEmail",
};

function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.token);
}

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
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
  window.location.href = "login.html";
}

function handleSessionExpired() {
  clearSession();
  sessionStorage.setItem("sessionExpired", "1");
  window.location.href = "login.html";
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = "dashboard.html";
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    errorEl.hidden = true;

    if (!email || !password) {
      errorEl.textContent = "Email e senha são obrigatórios.";
      errorEl.hidden = false;
      return;
    }

    showLoading();
    loginBtn.disabled = true;

    try {
      const result = await api.login(email, password);

      saveSession(result.token, result.user);

      showToast("Login realizado com sucesso.");
      window.location.href = "dashboard.html";
    } catch (error) {
      const message = error.message || "Email ou senha inválidos.";
      errorEl.textContent = message;
      errorEl.hidden = false;
      showToast("Login inválido.", "error");
    } finally {
      hideLoading();
      loginBtn.disabled = false;
    }
  });
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
