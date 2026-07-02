# PRD-008 — Dockerização Final e Padronização de Deploy (EasyPanel)

## Objetivo

Garantir que o **FrostHub** esteja completamente containerizado e padronizado para execução em produção no **EasyPanel**, com builds previsíveis, independência entre serviços e configuração limpa de ambiente.

---

# Visão Geral

O sistema será composto por 3 containers independentes:

- Frontend (Nginx)
- Backend (Node.js + Express)
- Banco de dados (PostgreSQL)

Cada serviço deverá ser isolado, com comunicação via rede Docker.

---

# Arquitetura de Deploy

```text
Usuário
   │
   ▼
Frontend (Nginx - porta 3000)
   │
   ▼
Backend (Node.js - porta 3001)
   │
   ▼
PostgreSQL (porta 5432)
```

---

# 1. Frontend (Docker)

## Responsabilidades

- Servir arquivos estáticos (HTML, CSS, JS)
- Utilizar Nginx
- Expor porta 3000

---

## Requisitos do Dockerfile

- Base: nginx:alpine
- Copiar build estático do frontend
- Incluir nginx.conf customizado
- Expor porta 3000

---

## nginx.conf

Deverá suportar:

- SPA routing (fallback para index.html)
- Cache básico de assets
- Servir arquivos estáticos corretamente

---

# 2. Backend (Docker)

## Responsabilidades

- API REST (Express)
- Autenticação JWT
- CRUD de clientes
- Integração com PostgreSQL

---

## Requisitos do Dockerfile

- Base: node:lts-alpine
- Instalar dependências (npm install)
- Copiar código fonte
- Expor porta 3001
- Executar: npm start

---

## Variáveis de Ambiente

Deverá utilizar exclusivamente:

```env
PORT=3001
DATABASE_URL=
FRONTEND_URL=
NODE_ENV=production
```

---

# 3. Banco de Dados (PostgreSQL)

## Responsabilidades

- Persistência dos dados
- Inicialização via script

---

## Requisitos

- Imagem oficial postgres
- Volume persistente obrigatório
- Execução do init.sql na inicialização

---

## Variáveis

```env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=frosthub_db
```

---

# 4. Comunicação entre containers

Todos os serviços deverão estar na mesma rede Docker.

### Regras

- Backend deve acessar PostgreSQL via hostname do container
- Frontend deve acessar backend via URL configurada
- Nunca usar localhost entre containers em produção

---

# 5. Build e Execução

Cada serviço deve ser independente:

## Frontend

```bash
docker build -t frosthub-frontend .
```

## Backend

```bash
docker build -t frosthub-backend .
```

## Banco

```bash
docker run postgres
```

---

# 6. Padronização para EasyPanel

## Requisitos obrigatórios

- Cada serviço separado no painel
- Variáveis de ambiente configuradas via UI do EasyPanel
- Sem dependência de docker-compose obrigatório
- Deploy baseado em Dockerfile

---

# 7. Segurança

- Não versionar `.env`
- Nunca expor credenciais no frontend
- Banco acessível apenas pelo backend
- CORS restrito ao frontend

---

# 8. Performance

- Frontend servido via Nginx (rápido e leve)
- Backend otimizado (alpine image)
- Evitar dependências desnecessárias

---

# 9. Estrutura final esperada

```text
frosthub/

├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src static
│
├── backend/
│   ├── Dockerfile
│   └── src
│
├── database/
│   └── init.sql
```

---

# Critérios de Aceite

- Frontend rodando em container (porta 3000)
- Backend rodando em container (porta 3001)
- PostgreSQL persistente e funcional
- Comunicação entre containers funcionando
- Deploy compatível com EasyPanel
- Nenhuma dependência de localhost entre serviços
- Build reproduzível via Dockerfile
- Variáveis de ambiente funcionando corretamente

---

# Fora do Escopo

- docker-compose obrigatório
- Kubernetes
- CI/CD pipeline
- Auto scaling
- Load balancer
- Testes automatizados

---

# Resultado Esperado

Ao final deste PRD, o **FrostHub** deverá estar completamente containerizado e pronto para produção no EasyPanel, com arquitetura isolada por serviços, comunicação segura entre containers e deploy reproduzível apenas via Dockerfiles e variáveis de ambiente.