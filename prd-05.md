# PRD-005 — Integração Frontend ↔ Backend e Implementação do CRUD

## Objetivo

Implementar a comunicação entre o frontend e o backend do **FrostHub**, tornando a aplicação totalmente funcional.

Ao final deste PRD, o usuário deverá conseguir:

- Realizar login
- Permanecer autenticado
- Cadastrar clientes
- Listar clientes
- Editar clientes
- Excluir clientes
- Encerrar sessão

Toda comunicação deverá ocorrer através da API REST desenvolvida no PRD-003.

---

# Objetivos da Implementação

Implementar:

- Login funcional
- Logout
- Persistência da sessão
- Consumo da API
- CRUD completo
- Atualização dinâmica da interface
- Tratamento de erros
- Feedback ao usuário

---

# Fluxo da Aplicação

```text
Usuário

↓

Tela Login

↓

POST /auth/login

↓

JWT recebido

↓

Salvar Token

↓

Dashboard

↓

GET /customers

↓

Renderizar tabela

↓

CRUD

↓

Atualizar Interface
```

---

# Login

Ao clicar em **Entrar**:

1. Validar os campos.
2. Enviar requisição para:

```http
POST /api/auth/login
```

3. Receber JWT.
4. Armazenar token.
5. Salvar informações básicas do usuário.
6. Redirecionar para Dashboard.

---

# Persistência da Sessão

Ao abrir a aplicação:

Verificar se existe um token válido.

Caso exista:

↓

Ir diretamente para Dashboard.

Caso contrário:

↓

Redirecionar para Login.

---

# Logout

Ao clicar em Logout:

- Remover JWT.
- Remover dados do usuário.
- Redirecionar para Login.

---

# Armazenamento

Salvar apenas:

```text
JWT

Nome do usuário

Email
```

Nunca armazenar:

- Senha
- Clientes
- Informações sensíveis

---

# Comunicação com API

Toda comunicação deverá ocorrer exclusivamente através de:

```text
js/api.js
```

Nenhum outro arquivo poderá realizar chamadas utilizando `fetch()`.

---

# Cabeçalhos HTTP

Todas as rotas protegidas deverão enviar:

```http
Authorization: Bearer TOKEN
```

automaticamente.

---

# CRUD de Clientes

## Listar

Ao abrir o Dashboard:

```http
GET /api/customers
```

Renderizar automaticamente a tabela.

---

## Cadastro

Ao clicar em Salvar:

```http
POST /api/customers
```

Após sucesso:

- Limpar formulário.
- Atualizar tabela.
- Exibir mensagem de sucesso.

---

## Atualização

Ao clicar em Editar:

Preencher formulário.

Alterar botão para:

```text
Atualizar
```

Enviar:

```http
PUT /api/customers/:id
```

Após sucesso:

- Atualizar tabela.
- Limpar formulário.
- Voltar botão para "Salvar".

---

## Exclusão

Ao confirmar exclusão:

```http
DELETE /api/customers/:id
```

Após sucesso:

- Atualizar tabela.
- Exibir mensagem.

---

# Atualização da Interface

A tabela nunca deverá exigir atualização da página.

Todas as alterações deverão ocorrer dinamicamente utilizando JavaScript.

---

# Estados da Interface

Durante qualquer requisição:

- Desabilitar botão.
- Mostrar loading.
- Impedir múltiplos envios.

Após finalizar:

- Remover loading.
- Reabilitar botão.

---

# Tratamento de Token Expirado

Caso a API retorne:

```http
401 Unauthorized
```

O sistema deverá:

- Limpar Local Storage.
- Redirecionar para Login.
- Informar que a sessão expirou.

---

# Tratamento de Erros

Caso ocorra erro:

Exibir mensagem amigável.

Nunca exibir:

- Stack Trace
- SQL
- Erros internos

---

# Organização dos Arquivos

## auth.js

Responsável por:

- Login
- Logout
- Token
- Sessão

---

## api.js

Responsável por:

- Todas as requisições HTTP
- Headers
- Tratamento de erros

---

## customers.js

Responsável por:

- Cadastro
- Listagem
- Atualização
- Exclusão
- Renderização da tabela

---

## ui.js

Responsável por:

- Loading
- Toasts
- Modais
- Manipulação visual

---

## main.js

Responsável por:

- Inicialização
- Eventos globais
- Controle de navegação

---

# Feedback ao Usuário

Exibir mensagens para:

- Login realizado.
- Cliente cadastrado.
- Cliente atualizado.
- Cliente removido.
- Erro ao salvar.
- Erro ao excluir.
- Sessão expirada.
- Falha de comunicação.

As mensagens deverão desaparecer automaticamente após alguns segundos.

---

# Regras de UX

Após cadastrar:

↓

Limpar formulário.

↓

Focar novamente no campo Nome.

---

Após editar:

↓

Retornar botão para "Salvar".

↓

Cancelar modo edição.

---

Após excluir:

↓

Atualizar tabela automaticamente.

---

# Segurança

Nunca confiar nas validações do frontend.

Toda validação continuará sendo realizada pelo backend.

O frontend deverá apenas melhorar a experiência do usuário.

---

# Critérios de Aceite

- Login funcional.
- Logout funcional.
- Sessão persistente.
- JWT enviado automaticamente.
- CRUD totalmente funcional.
- Atualização dinâmica da tabela.
- Formulário de edição funcional.
- Exclusão com confirmação.
- Feedback visual implementado.
- Loading durante requisições.
- Tratamento de sessão expirada.
- Código organizado em módulos.

---

# Fora do Escopo

Não implementar nesta etapa:

- Integração ViaCEP.
- Testes automatizados.
- Docker.
- Deploy.

---

# Resultado Esperado

Ao final deste PRD, o **FrostHub** deverá estar completamente funcional do ponto de vista da comunicação entre frontend e backend. O usuário conseguirá autenticar-se, gerenciar clientes através de um CRUD completo e utilizar a aplicação de forma dinâmica, sem recarregamentos de página, consumindo exclusivamente a API REST desenvolvida nos PRDs anteriores.