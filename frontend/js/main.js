document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "login") {
    initLogin();
  }

  if (page === "dashboard") {
    initDashboardAuth();
    initCepField();
    initCustomers();
  }
});
