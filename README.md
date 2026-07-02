# FrostyHub

Sistema web para gerenciamento de clientes com integração à API ViaCEP.

## Arquitetura

| Serviço    | Porta | Tecnologia              |
|------------|------:|-------------------------|
| Frontend   |  3000 | HTML, CSS, JS + Nginx   |
| Backend    |  3001 | Node.js + Express       |
| PostgreSQL |  5432 | PostgreSQL              |

```text
Usuário → Frontend (Nginx :3000) → Backend (Express :3001) → PostgreSQL (:5432)
```

Cada serviço roda em um **container Docker independente**, com comunicação via rede interna.

## Estrutura do Projeto

```text
frostyhub/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── docker-entrypoint.sh
│   └── arquivos estáticos (HTML, CSS, JS)
├── backend/
│   ├── Dockerfile
│   └── src/
└── database/
    ├── init.sql
    └── seed.sql
```

## Pré-requisitos

- Docker
- Node.js LTS (apenas para desenvolvimento local sem Docker)

## Desenvolvimento Local

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

Edite `frontend/js/config.js` com a URL da API local:

```javascript
const CONFIG = {
  API_URL: "http://localhost:3001/api",
};
```

Sirva os arquivos estáticos ou abra `frontend/index.html` via servidor local.

### Banco de Dados

Consulte [database/README.md](database/README.md).

## Docker (build por serviço)

### Frontend

```bash
cd frontend
docker build -t frostyhub-frontend .
docker run -p 3000:3000 \
  -e API_URL=http://localhost:3001/api \
  frostyhub-frontend
```

### Backend

```bash
cd backend
docker build -t frostyhub-backend .
docker run -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://postgres:postgres@host-do-postgres:5432/frosthub_db \
  -e FRONTEND_URL=http://localhost:3000 \
  -e JWT_SECRET=sua_chave_secreta \
  frostyhub-backend
```

## Deploy no EasyPanel

O deploy usa **3 serviços separados** no painel, cada um com seu Dockerfile. Não é necessário docker-compose.

### 1. PostgreSQL

1. Crie um serviço **PostgreSQL** (template).
2. Configure as variáveis:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB` (ex: `frosthub_db`)
3. Ative **volume persistente**.
4. No terminal do container, execute `database/init.sql` e `database/seed.sql`.

### 2. Backend

1. Crie um App com **Path**: `/backend`
2. Porta interna: **3001**
3. Variáveis de ambiente:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:SENHA@hostname-interno-postgres:5432/frosthub_db?sslmode=disable
FRONTEND_URL=https://seu-frontend.easypanel.host
JWT_SECRET=uma_chave_secreta_forte_e_fixa
```

> Use o **hostname interno** do PostgreSQL (não `localhost`).

### 3. Frontend

1. Crie um App com **Path**: `/frontend`
2. Porta interna: **3000**
3. Variável de ambiente:

```env
API_URL=https://seu-backend.easypanel.host/api
```

O `docker-entrypoint.sh` gera `js/config.js` automaticamente na inicialização do container.

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

### Backend

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `PORT` | — | Porta do servidor (padrão: 3001) |
| `NODE_ENV` | — | `production` em produção |
| `DATABASE_URL` | Sim* | Conexão PostgreSQL |
| `FRONTEND_URL` | Sim* | URL do frontend (CORS) |
| `JWT_SECRET` | Sim* | Chave secreta para tokens JWT |

\* Obrigatórias quando `NODE_ENV=production`

### Frontend

| Variável | Descrição |
|----------|-----------|
| `API_URL` | URL pública da API (ex: `https://backend.exemplo.com/api`) |

### PostgreSQL

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_USER` | Usuário do banco |
| `POSTGRES_PASSWORD` | Senha do banco |
| `POSTGRES_DB` | Nome do banco (ex: `frosthub_db`) |

## Segurança

- Nunca versione arquivos `.env`
- Credenciais ficam apenas no backend e no PostgreSQL
- CORS restrito à URL configurada em `FRONTEND_URL`
- Banco acessível apenas pelo backend na rede interna

## Credenciais de teste

Após executar `database/seed.sql`:

- E-mail: `admin@frostyhub.com`
- Senha: `admin123`

## Status

- [x] PRD-001 — Arquitetura e configuração inicial
- [x] PRD-002 — Modelagem do banco de dados
- [x] PRD-003 — API REST e autenticação
- [x] PRD-004 — Interface, layout e experiência do usuário
- [x] PRD-005 — Integração frontend ↔ backend e CRUD
- [x] PRD-006 — Integração ViaCEP e automação de endereço
- [x] PRD-007 — Polimento da aplicação (UX e robustez)
- [x] PRD-008 — Dockerização final e padronização de deploy (EasyPanel)
