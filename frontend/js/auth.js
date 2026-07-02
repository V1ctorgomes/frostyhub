function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function getUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("user");
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      localStorage.setItem("token", "mock-jwt-token-prd-004");
      setUser({ id: 1, name: "Usuário Demo", email });

      window.location.href = "dashboard.html";
    } catch (error) {
      errorEl.textContent = error.message || "Email ou senha inválidos.";
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
