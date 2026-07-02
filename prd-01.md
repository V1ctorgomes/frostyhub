# PRD-001 — Arquitetura do Projeto e Configuração Inicial

## Objetivo

Definir a arquitetura base da aplicação, estrutura de diretórios, tecnologias, padrões de desenvolvimento, configurações de ambiente e estratégia de deploy, criando uma fundação sólida para as próximas etapas do projeto.

---

# Visão Geral

A aplicação consiste em um sistema web para gerenciamento de usuários com integração à API ViaCEP para preenchimento automático de endereço.

A arquitetura será composta por três serviços independentes:

- Frontend
- Backend
- Banco de Dados PostgreSQL

Cada serviço deverá possuir seu próprio ciclo de vida e ser executado em um container Docker independente.

---

# Stack

## Frontend

- HTML5
- CSS3
- JavaScript ES6 (Vanilla)
- Nginx

**Não utilizar frameworks ou bibliotecas JavaScript.**

---

## Backend

- Node.js LTS
- Express.js
- PostgreSQL Driver (`pg`)
- CORS
- Dotenv

**Não utilizar ORM.**

Toda comunicação com o banco deverá utilizar SQL puro parametrizado.

---

## Banco de Dados

- PostgreSQL (Imagem Oficial Docker)

---

# Arquitetura da Aplicação

```text
                Navegador
                     │
                     ▼
        Frontend (HTML/CSS/JS)
             Porta 3000
                     │
          Requisições HTTP (Fetch)
                     │
                     ▼
           Backend (Express API)
             Porta 3001
                     │
              SQL Parametrizado
                     │
                     ▼
              PostgreSQL
                Porta 5432
```

---

# Estrutura do Projeto

```text
mini-cadastro/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── config.js
│   │   ├── api.js
│   │   ├── crud.js
│   │   ├── cep.js
│   │   └── main.js
│   │
│   ├── nginx.conf
│   ├── Dockerfile
│   └── index.html
│
├── database/
│   └── init.sql
│
├── README.md
└── .gitignore
```

---

# Arquitetura do Backend

A API deverá seguir uma arquitetura em camadas, separando responsabilidades para facilitar manutenção, escalabilidade e testes.

## Controllers

Responsáveis por:

- Receber requisições HTTP
- Validar dados de entrada
- Chamar os Services
- Retornar respostas HTTP

## Services

Responsáveis por:

- Implementar as regras de negócio
- Processar os dados da aplicação

**Nenhuma regra de negócio deverá existir nas rotas.**

## Database

Responsável por:

- Gerenciar a conexão com o PostgreSQL
- Executar consultas SQL parametrizadas

## Routes

Responsáveis apenas pelo roteamento da API.

## Middlewares

Responsáveis por:

- Tratamento de erros
- Configuração de CORS
- Validações futuras

## Utils

Funções auxiliares reutilizáveis.

---

# Estrutura do Frontend

A aplicação será desenvolvida utilizando apenas HTML, CSS e JavaScript.

A organização deverá seguir separação por responsabilidade.

## config.js

Centraliza todas as configurações públicas da aplicação.

Exemplo:

- URL da API

Nenhum outro arquivo poderá possuir URLs fixas da API.

## api.js

Responsável pelas funções de comunicação HTTP.

Todo `fetch()` deverá existir apenas neste arquivo.

## crud.js

Responsável pelas operações do CRUD.

## cep.js

Responsável pela integração com a API ViaCEP.

## main.js

Inicialização da aplicação e eventos globais.

---

# API REST

A aplicação deverá seguir o padrão REST.

Operações previstas:

- GET
- POST
- PUT
- DELETE

Todos os endpoints deverão retornar respostas padronizadas.

---

# Configuração das Portas

| Serviço | Porta |
|----------|------:|
| Frontend | 3000 |
| Backend | 3001 |
| PostgreSQL | 5432 |

---

# Variáveis de Ambiente

Todas as informações sensíveis deverão permanecer em arquivos `.env`.

Nenhuma credencial poderá ser armazenada diretamente no código-fonte.

## backend/.env

```env
PORT=3001

NODE_ENV=development

DATABASE_URL=

FRONTEND_URL=http://localhost:3000
```

A conexão com o banco deverá utilizar exclusivamente a variável `DATABASE_URL`.

## backend/.env.example

O repositório deverá conter apenas um arquivo de exemplo, sem nenhuma credencial real.

---

# Configuração do Frontend

Como aplicações em HTML, CSS e JavaScript puro não possuem suporte nativo a arquivos `.env`, as configurações públicas deverão ser centralizadas em um único arquivo.

Arquivo:

```text
frontend/js/config.js
```

Exemplo:

```javascript
const CONFIG = {
  API_URL: "http://localhost:3001/api"
};
```

Todas as chamadas HTTP deverão utilizar exclusivamente:

```javascript
CONFIG.API_URL
```

É proibido deixar URLs da API fixas em outros arquivos.

---

# Banco de Dados

O PostgreSQL será executado utilizando a imagem oficial do Docker.

A estrutura inicial será criada através do arquivo:

```text
database/init.sql
```

---

# Docker

Cada serviço deverá possuir seu próprio Dockerfile.

## Frontend

Responsável por:

- Copiar os arquivos estáticos
- Configurar o Nginx
- Expor a porta 3000
- Servir a aplicação

## Backend

Responsável por:

- Instalar dependências
- Copiar o código
- Ler variáveis do `.env`
- Expor a porta 3001
- Inicializar o servidor Express

## Banco de Dados

Utilizar a imagem oficial do PostgreSQL.

A estrutura inicial será criada através do arquivo `init.sql`.

---

# Deploy

A aplicação será hospedada utilizando o EasyPanel.

Cada serviço deverá ser publicado separadamente.

Serviços previstos:

- Frontend
- Backend
- PostgreSQL

As configurações deverão ser realizadas através das variáveis de ambiente do EasyPanel.

---

# Boas Práticas

Durante todo o desenvolvimento deverão ser seguidas as seguintes diretrizes:

- Código limpo e organizado.
- Separação clara de responsabilidades.
- HTML semântico.
- CSS modular e reutilizável.
- JavaScript ES6.
- SQL parametrizado.
- Não utilizar ORM.
- Não utilizar frameworks no frontend.
- Centralizar configurações.
- Não duplicar código.
- Utilizar nomes descritivos para arquivos, funções e variáveis.
- Manter estrutura consistente em todo o projeto.
- Preparar a aplicação para execução em ambiente Docker.

---

# Critérios de Aceite

- Estrutura de diretórios criada.
- Backend configurado com Express.
- Frontend estruturado.
- PostgreSQL definido como banco de dados.
- Dockerfile criado para o frontend.
- Dockerfile criado para o backend.
- Arquivo `database/init.sql` criado.
- Configuração de portas definida.
- Arquivos `.env` e `.env.example` preparados.
- Configuração da API centralizada em `config.js`.
- Arquitetura preparada para os próximos PRDs.

---

# Fora do Escopo

Nesta etapa não deverá ser implementado:

- CRUD de usuários
- Integração com ViaCEP
- Interface final
- Banco de dados funcional
- Endpoints da API
- Validações
- Regras de negócio
- Deploy
- Testes

---

# Resultado Esperado

Ao final deste PRD, o projeto deverá possuir uma arquitetura organizada, desacoplada e preparada para o desenvolvimento incremental das próximas funcionalidades, seguindo boas práticas de mercado, com foco em simplicidade, manutenção e facilidade de implantação via Docker e EasyPanel.