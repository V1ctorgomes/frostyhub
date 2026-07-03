# FrostHub

Projeto feito para o teste técnico da Frosty. É um sistema simples de cadastro de clientes com login.

## Sobre o projeto

A ideia é ter uma tela de login e, depois de entrar, um dashboard onde dá pra listar, cadastrar, editar e excluir clientes. Quando você digita o CEP, o endereço é buscado na API do ViaCEP.

Fui montando o projeto aos poucos, seguindo os PRDs que a Frosty passou.

## Tecnologias

- Frontend: HTML, CSS e JavaScript puro (sem framework)
- Backend: Node.js com Express
- Banco: PostgreSQL
- Deploy: Docker no EasyPanel

## Como o sistema se comunica

```
navegador → frontend (porta 3000) → backend (porta 3001) → postgres (porta 5432)
```

O frontend só serve os arquivos estáticos. O backend é quem fala com o banco.

No backend eu separei assim: rotas → controllers → services → queries SQL.

## Estrutura das pastas

```
frostyhub/
├── frontend/     interface
├── backend/      api
├── database/     scripts sql
└── docs/         prints e coisas extras
```

## Rodar na sua máquina

Você vai precisar do Docker instalado. Se quiser rodar o backend sem container, precisa do Node também.

### Com Docker

Primeiro cria a rede (só precisa fazer uma vez):

```bash
docker network create frostyhub-net
```

Sobe o banco:

```bash
docker run -d \
  --name frostyhub-db \
  --network frostyhub-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=frosthub_db \
  -p 5432:5432 \
  -v frostyhub_pgdata:/var/lib/postgresql/data \
  -v "$(pwd)/database/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro" \
  postgres:17-alpine
```

Roda o seed pra criar o usuário de teste:

```bash
docker exec -i frostyhub-db psql -U postgres -d frosthub_db < database/seed.sql
```

Sobe o backend:

```bash
cd backend
docker build -t frostyhub-backend .
docker run -d \
  --name frostyhub-backend \
  --network frostyhub-net \
  -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://postgres:postgres@frostyhub-db:5432/frosthub_db \
  -e FRONTEND_URL=http://localhost:3000 \
  -e JWT_SECRET=chave_local_desenvolvimento \
  frostyhub-backend
```

Sobe o frontend:

```bash
cd frontend
docker build -t frostyhub-frontend .
docker run -d \
  --name frostyhub-frontend \
  --network frostyhub-net \
  -p 3000:3000 \
  -e API_URL=http://localhost:3001/api \
  frostyhub-frontend
```

Abre http://localhost:3000 no navegador.

### Sem Docker (só pra desenvolver)

No backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

No frontend, abre o arquivo frontend/js/config.js e deixa assim:

```javascript
const CONFIG = {
  API_URL: "http://localhost:3001/api",
};
```

Aí sobe a pasta frontend com algum servidor estático. Eu usei `npx serve .` dentro da pasta frontend.

O banco você configura separado. Tem mais detalhe no database/README.md.

## Login de teste

Depois de rodar o seed.sql:

- email: admin@frostyhub.com
- senha: admin123

## Versão online (EasyPanel)

Deixei o projeto no ar pra facilitar a avaliação:

- Frontend: https://frostyhub-frontend.pknzmz.easypanel.host/
- Backend: https://frostyhub-backend.pknzmz.easypanel.host/

No EasyPanel são 3 serviços separados: postgres, backend e frontend. Cada um com seu Dockerfile. O repositório é o mesmo, mas no deploy eu aponto o path da pasta certa (/backend ou /frontend).

No postgres roda o init.sql e o seed.sql manualmente pelo terminal do painel. No backend coloco as variáveis de ambiente. No frontend só preciso da API_URL apontando pro backend.

## Rotas da API

Login (público):

- POST /api/auth/login

Clientes (precisa estar logado, manda o token no header Authorization):

- GET /api/customers
- GET /api/customers/:id
- POST /api/customers
- PUT /api/customers/:id
- DELETE /api/customers/:id

Exemplo do header: Authorization: Bearer seu_token_aqui

## Variáveis de ambiente

Backend (.env):

```
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://usuario:senha@host-do-banco:5432/frosthub_db
FRONTEND_URL=https://url-do-frontend
JWT_SECRET=uma_chave_secreta
```

Frontend (no EasyPanel):

```
API_URL=https://url-do-backend/api
```

Postgres:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=frosthub_db
```

Importante: no deploy, o backend não pode usar localhost pra falar com o banco. Tem que ser o hostname interno que o EasyPanel mostra.

## Prints

Ainda vou colocar as imagens na pasta docs/screenshots/. Por enquanto dá pra testar direto no link do frontend.

## Repositório

https://github.com/V1ctorgomes/frostyhub
