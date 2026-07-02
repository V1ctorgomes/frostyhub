# PRD-002 — Modelagem do Banco de Dados

## Objetivo

Projetar a estrutura do banco de dados do **FrostHub**, contemplando autenticação de usuários do sistema e gerenciamento de clientes, garantindo organização, integridade dos dados e facilidade de manutenção.

---

# Visão Geral

A aplicação possuirá autenticação.

Apenas usuários autenticados poderão acessar o sistema e realizar operações de cadastro de clientes.

O banco será composto inicialmente por duas tabelas:

- users
- customers

Futuramente novas tabelas poderão ser adicionadas sem necessidade de alterar a estrutura existente.

---

# Banco de Dados

Banco:

```text
PostgreSQL
```

Nome do banco:

```text
frosthub_db
```

Toda a estrutura inicial deverá ser criada através do arquivo:

```text
database/init.sql
```

---

# Tabela users

Responsável pelos usuários que poderão acessar o sistema.

## Campos

| Campo | Tipo | Restrições |
|---------|---------|----------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(150) | NOT NULL |
| email | VARCHAR(255) | UNIQUE NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Regras

- O e-mail deve ser único.
- A senha nunca poderá ser armazenada em texto puro.
- Utilizar hash (bcrypt) no momento do cadastro.
- O login será realizado utilizando e-mail e senha.

---

# Tabela customers

Responsável pelos clientes cadastrados.

## Campos

| Campo | Tipo | Restrições |
|---------|---------|----------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| email | VARCHAR(255) | NULL |
| phone | VARCHAR(20) | NULL |
| cep | VARCHAR(9) | NOT NULL |
| street | VARCHAR(255) | NOT NULL |
| number | VARCHAR(20) | NOT NULL |
| complement | VARCHAR(150) | NULL |
| neighborhood | VARCHAR(150) | NOT NULL |
| city | VARCHAR(150) | NOT NULL |
| state | VARCHAR(150) | NOT NULL |
| uf | CHAR(2) | NOT NULL |
| created_by | INTEGER | REFERENCES users(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Regras

- Todo cliente deverá possuir endereço.
- O CEP será utilizado para preenchimento automático através da API ViaCEP.
- O campo número deverá ser informado manualmente.
- Complemento será opcional.
- Cada cliente ficará vinculado ao usuário que realizou seu cadastro.

---

# Relacionamentos

```text
users
   │
   │ 1
   │
   │
   └───────────────∞
                customers
```

Um usuário pode cadastrar vários clientes.

Cada cliente pertence a apenas um usuário.

---

# Índices

Criar índices para melhorar consultas.

## users

- email

## customers

- name
- city
- created_by

---

# Integridade dos Dados

Implementar:

- Primary Keys
- Foreign Keys
- Constraints
- UNIQUE
- NOT NULL

---

# Padrões

Todos os nomes deverão seguir:

- snake_case
- letras minúsculas

Exemplo:

```text
created_at
updated_at
created_by
```

---

# Datas

Todas as tabelas deverão possuir:

```text
created_at

updated_at
```

para auditoria básica.

---

# Exclusão

Os registros de clientes serão removidos utilizando DELETE físico.

Não será implementado Soft Delete.

---

# Script init.sql

O arquivo deverá conter:

- Criação do banco (quando aplicável ao ambiente)
- Criação das tabelas
- Constraints
- Índices
- Relacionamentos

Organizado na seguinte ordem:

1. Users
2. Customers
3. Índices

---

# Segurança

As senhas deverão ser criptografadas utilizando:

```text
bcrypt
```

Jamais armazenar senhas em texto puro.

---

# Performance

Utilizar índices nas colunas frequentemente pesquisadas.

Evitar duplicidade de dados.

---

# Critérios de Aceite

- Banco PostgreSQL definido.
- Arquivo init.sql criado.
- Tabela users criada.
- Tabela customers criada.
- Relacionamento implementado.
- Índices criados.
- Constraints implementadas.
- Estrutura pronta para autenticação.
- Estrutura pronta para CRUD de clientes.

---

# Fora do Escopo

Nesta etapa não deverá ser implementado:

- Login
- JWT
- CRUD
- API
- Interface
- ViaCEP
- Docker

---

# Resultado Esperado

Ao final deste PRD, o banco de dados deverá estar completamente modelado e preparado para suportar autenticação de usuários e o gerenciamento de clientes, garantindo integridade, segurança e organização dos dados para as próximas etapas do desenvolvimento.