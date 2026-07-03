INSERT INTO users (name, email, password)
VALUES (
  'Administrador',
  'admin@frostyhub.com',
  '$2b$10$zJxrYfYo0ukKwp2yhj2XQOV9yuFCLK.4xIzaZpuJk0d.BdlYL4g/q'
)
ON CONFLICT (email) DO NOTHING;
