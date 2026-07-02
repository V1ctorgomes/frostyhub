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
  -e POSTGRES_DB=frosthub_db \
  -p 5432:5432 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:17-alpine
```

## Variáveis de Ambiente

Consulte `backend/.env.example` para as variáveis necessárias.

## Status

- [x] PRD-001 — Arquitetura e configuração inicial
- [x] PRD-002 — Modelagem do banco de dados
- [ ] PRD-003 — (próximas etapas)
