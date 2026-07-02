const pool = require("./connection");

const userQueries = {
  findByEmail: `
    SELECT id, name, email, password
    FROM users
    WHERE email = $1
  `,
};

const customerQueries = {
  findAllByUser: `
    SELECT id, name, email, phone, cep, street, number, complement,
           neighborhood, city, state, uf, created_by, created_at, updated_at
    FROM customers
    WHERE created_by = $1
    ORDER BY name ASC
  `,

  findByIdAndUser: `
    SELECT id, name, email, phone, cep, street, number, complement,
           neighborhood, city, state, uf, created_by, created_at, updated_at
    FROM customers
    WHERE id = $1 AND created_by = $2
  `,

  create: `
    INSERT INTO customers (
      name, email, phone, cep, street, number, complement,
      neighborhood, city, state, uf, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id, name, email, phone, cep, street, number, complement,
              neighborhood, city, state, uf, created_by, created_at, updated_at
  `,

  update: `
    UPDATE customers
    SET name = $1,
        email = $2,
        phone = $3,
        cep = $4,
        street = $5,
        number = $6,
        complement = $7,
        neighborhood = $8,
        city = $9,
        state = $10,
        uf = $11,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $12 AND created_by = $13
    RETURNING id, name, email, phone, cep, street, number, complement,
              neighborhood, city, state, uf, created_by, created_at, updated_at
  `,

  delete: `
    DELETE FROM customers
    WHERE id = $1 AND created_by = $2
    RETURNING id
  `,
};

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { userQueries, customerQueries, query };
