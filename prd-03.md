# PRD-003 — Backend: API REST e Autenticação

## Objetivo

Desenvolver o backend do **FrostHub**, implementando uma API REST utilizando Node.js e Express, responsável pela autenticação dos usuários do sistema, gerenciamento de clientes e comunicação com o banco de dados PostgreSQL.

A API deverá seguir boas práticas de arquitetura, segurança e organização do código.

---

# Visão Geral

O backend será responsável por:

- Autenticação de usuários
- Login
- Controle de acesso
- CRUD de clientes
- Comunicação com PostgreSQL
- Validação dos dados
- Padronização das respostas da API
- Tratamento de erros

---

# Estrutura do Backend

```text
backend/

├── src/
│
├── controllers/
│   ├── authController.js
│   └── customerController.js
│
├── services/
│   ├── authService.js
│   └── customerService.js
│
├── routes/
│   ├── authRoutes.js
│   └── customerRoutes.js
│
├── database/
│   ├── connection.js
│   └── queries.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
│
├── utils/
│   └── response.js
│
├── app.js
└── server.js
```

---

# Tecnologias

- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken (JWT)
- dotenv
- cors

---

# Conexão com Banco

A conexão deverá utilizar exclusivamente:

```env
DATABASE_URL=
```

Exemplo:

```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
```

Nenhuma credencial poderá existir no código.

---

# Autenticação

A aplicação deverá possuir autenticação utilizando:

- JWT
- bcrypt

---

## Fluxo

Usuário

↓

Login

↓

Validação

↓

JWT

↓

Acesso ao sistema

---

# Login

O login deverá ocorrer utilizando:

- Email
- Senha

---

## Regras

- Validar usuário.
- Comparar senha utilizando bcrypt.
- Gerar JWT.
- Retornar token.
- Nunca retornar senha.

---

# Middleware de Autenticação

Todas as rotas de clientes deverão ser protegidas.

Fluxo:

```text
Request

↓

Verifica Token

↓

Token válido?

↓

Sim → Continua

Não → Retorna 401
```

---

# Endpoints

## Autenticação

### Login

```http
POST /api/auth/login
```

Body

```json
{
    "email": "",
    "password": ""
}
```

Resposta

```json
{
    "token": "",
    "user": {
        "id": 1,
        "name": "",
        "email": ""
    }
}
```

---

## Clientes

### Listar

```http
GET /api/customers
```

---

### Buscar por ID

```http
GET /api/customers/:id
```

---

### Cadastrar

```http
POST /api/customers
```

---

### Atualizar

```http
PUT /api/customers/:id
```

---

### Excluir

```http
DELETE /api/customers/:id
```

---

# Estrutura das Respostas

## Sucesso

```json
{
    "success": true,
    "message": "Operação realizada com sucesso.",
    "data": {}
}
```

---

## Erro

```json
{
    "success": false,
    "message": "Descrição do erro."
}
```

---

# Validações

Validar antes de salvar:

## Cliente

- Nome obrigatório
- CEP obrigatório
- Rua obrigatória
- Bairro obrigatório
- Cidade obrigatória
- Estado obrigatório
- UF obrigatória
- Número obrigatório

---

## Login

- Email obrigatório
- Senha obrigatória

---

# SQL

Todas as consultas deverão utilizar parâmetros.

Exemplo:

```javascript
await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
);
```

Nunca concatenar SQL.

---

# Tratamento de Erros

Implementar middleware global.

Exemplo:

```text
Erro de Banco

↓

Middleware

↓

Resposta Padronizada
```

Nunca enviar stack trace ao frontend.

---

# Organização

Controller

↓

Service

↓

Database

↓

PostgreSQL

Controllers não deverão acessar diretamente o banco.

---

# Segurança

Obrigatório implementar:

- SQL Parametrizado
- bcrypt
- JWT
- CORS
- Tratamento de erros
- Validação dos dados
- Nunca retornar senha

---

# Códigos HTTP

| Código | Situação |
|---------|----------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 404 | Não encontrado |
| 500 | Erro interno |

---

# Critérios de Aceite

- API Express criada.
- Conexão PostgreSQL funcionando.
- Login implementado.
- JWT funcionando.
- bcrypt implementado.
- CRUD completo de clientes.
- Rotas protegidas.
- Middleware de autenticação.
- Middleware de erros.
- Respostas padronizadas.
- SQL parametrizado.
- Código organizado em camadas.

---

# Fora do Escopo

Nesta etapa não deverá ser implementado:

- Interface gráfica.
- Integração ViaCEP.
- Docker.
- Deploy.
- Testes automatizados.

---

# Resultado Esperado

Ao final deste PRD, o backend deverá fornecer uma API REST completa, segura e organizada, preparada para autenticar usuários, gerenciar clientes e servir como base para o frontend do FrostHub, seguindo boas práticas de desenvolvimento e arquitetura em camadas.