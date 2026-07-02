function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    data = { message: "Falha de comunicação com o servidor." };
  }

  return data;
}

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Falha de comunicação com o servidor.");
  }

  const data = await parseResponse(response);

  if (response.status === 401 && endpoint !== "/auth/login") {
    handleSessionExpired();
    throw new Error("Sessão expirada.");
  }

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

  async getCustomers() {
    const response = await request("/customers");
    return response.data || [];
  },

  async getCustomer(id) {
    const response = await request(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer) {
    const response = await request("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    });
    return response.data;
  },

  async updateCustomer(id, customer) {
    const response = await request(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    });
    return response.data;
  },

  async deleteCustomer(id) {
    return request(`/customers/${id}`, {
      method: "DELETE",
    });
  },
};
