function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição.");
  }

  return data;
}

const api = {
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getCustomers() {
    return request("/customers");
  },

  getCustomer(id) {
    return request(`/customers/${id}`);
  },

  createCustomer(customer) {
    return request("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  },

  updateCustomer(id, customer) {
    return request(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    });
  },

  deleteCustomer(id) {
    return request(`/customers/${id}`, {
      method: "DELETE",
    });
  },
};
