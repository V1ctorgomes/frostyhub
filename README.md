# FrostyHub

Sistema web para gerenciamento de usuários com integração à API ViaCEP.

## Arquitetura

| Serviço    | Porta | Tecnologia              |
|------------|------:|-------------------------|
| Frontend   |  3000 | HTML, CSS, JS + Nginx   |
| Backend    |  3001 | Node.js + Express       |
| PostgreSQL |  5432 | PostgreSQL (Docker)     |

## Estrutura do Projeto

```
frostyhub/
├── backend/       # API REST (Express)
├── frontend/      # Interface (HTML/CSS/JS)
└── database/      # Scripts SQL iniciais
```

## Pré-requisitos

- Node.js LTS
- Docker e Docker Compose (opcional)
- PostgreSQL (local ou via Docker)

## Configuração

### Backend

```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais
npm install
npm run dev
```

### Frontend

Abra `frontend/index.html` no navegador ou sirva via Docker:

```bash
cd frontend
docker build -t frostyhub-frontend .
docker run -p 3000:3000 frostyhub-frontend
```

### Banco de Dados

```bash
docker run -d \
  --name frostyhub-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=frostydb \
  -p 5432:5432 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:17-alpine
```

Após criar as tabelas, execute o seed para criar o usuário de teste:

```bash
psql -U postgres -d frostydb -f database/seed.sql
```

Credenciais de teste: `admin@frostyhub.com` / `admin123`

## API REST

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (retorna JWT) |

### Clientes (requer token JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/customers` | Listar clientes |
| GET | `/api/customers/:id` | Buscar por ID |
| POST | `/api/customers` | Cadastrar |
| PUT | `/api/customers/:id` | Atualizar |
| DELETE | `/api/customers/:id` | Excluir |

Envie o token no header: `Authorization: Bearer <token>`

## Variáveis de Ambiente

Consulte `backend/.env.example` para as variáveis necessárias.

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (3001) |
| `DATABASE_URL` | Conexão PostgreSQL |
| `FRONTEND_URL` | URL do frontend (CORS) |
| `JWT_SECRET` | Chave secreta para tokens JWT |

## Status

- [x] PRD-001 — Arquitetura e configuração inicial
- [x] PRD-002 — Modelagem do banco de dados
- [x] PRD-003 — API REST e autenticação
- [x] PRD-004 — Interface, layout e experiência do usuário
- [x] PRD-005 — Integração frontend ↔ backend e CRUD
- [x] PRD-006 — Integração ViaCEP e automação de endereço
- [ ] PRD-007 — (próximas etapas)
