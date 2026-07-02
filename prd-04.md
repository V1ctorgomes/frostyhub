# PRD-004 — Frontend: Interface, Layout e Experiência do Usuário

## Objetivo

Desenvolver a interface do **FrostHub** utilizando HTML5, CSS3 e JavaScript puro, proporcionando uma experiência moderna, intuitiva e responsiva para autenticação e gerenciamento de clientes.

O frontend deverá consumir exclusivamente a API desenvolvida no PRD-003.

---

# Visão Geral

A aplicação possuirá apenas duas telas principais:

- Login
- Dashboard (Cadastro de Clientes)

Toda navegação deverá ocorrer sem recarregar a página sempre que possível.

---

# Estrutura do Frontend

```text
frontend/

├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── login.css
│   ├── dashboard.css
│   ├── components.css
│   └── style.css
│
├── js/
│   ├── config.js
│   ├── api.js
│   ├── auth.js
│   ├── customers.js
│   ├── cep.js
│   ├── ui.js
│   └── main.js
│
├── pages/
│   ├── login.html
│   └── dashboard.html
│
├── index.html
├── nginx.conf
└── Dockerfile
```

---

# Fluxo da Aplicação

```text
Usuário

↓

Tela de Login

↓

Login realizado

↓

Dashboard

↓

CRUD de Clientes
```

Caso o usuário não esteja autenticado, ele deverá ser redirecionado para a tela de login.

---

# Identidade Visual

A interface deverá transmitir organização e profissionalismo.

Características:

- Layout limpo
- Espaçamento consistente
- Bordas suaves
- Sombras discretas
- Tipografia moderna
- Ícones intuitivos
- Responsividade

Não utilizar frameworks CSS.

---

# Paleta de Cores

Priorizar tons claros.

Cor primária:

```text
Azul
```

Cor secundária:

```text
Cinza
```

Cores auxiliares:

- Verde (Sucesso)
- Vermelho (Erro)
- Amarelo (Aviso)

Todas as cores deverão ser centralizadas em:

```text
css/variables.css
```

---

# Tipografia

Utilizar fonte do Google Fonts.

Recomendação:

```text
Inter
```

ou

```text
Poppins
```

---

# Tela de Login

Componentes:

- Logo FrostHub
- Campo E-mail
- Campo Senha
- Botão Entrar

---

## Regras

- Campos obrigatórios.
- Botão desabilitado enquanto houver requisição.
- Exibir mensagem de erro caso login seja inválido.
- Armazenar JWT no Local Storage.
- Redirecionar para Dashboard após login.

---

# Dashboard

A Dashboard deverá conter:

## Header

- Logo
- Nome do sistema
- Nome do usuário logado
- Botão Logout

---

## Área Principal

Dividida em duas seções.

### Lado esquerdo

Formulário de cadastro.

### Lado direito

Tabela de clientes.

Em telas menores, os blocos deverão ficar empilhados.

---

# Formulário

Campos:

- Nome
- Email
- Telefone
- CEP
- Rua
- Número
- Complemento
- Bairro
- Cidade
- Estado
- UF

Botões:

- Salvar
- Atualizar
- Cancelar

---

## ViaCEP

Após preencher o CEP:

- Buscar automaticamente.
- Preencher endereço.
- Permitir edição manual caso necessário.

---

# Tabela

Colunas:

- Nome
- Email
- Telefone
- Cidade
- Estado

Ações:

- Editar
- Excluir

---

# Exclusão

Ao clicar em excluir:

Exibir modal de confirmação.

Pergunta:

```text
Deseja realmente excluir este cliente?
```

Botões:

- Cancelar
- Excluir

---

# Feedback Visual

A interface deverá possuir mensagens para:

- Cadastro realizado.
- Atualização realizada.
- Cliente removido.
- Erro na API.
- CEP inválido.
- Login inválido.

As mensagens deverão desaparecer automaticamente após alguns segundos.

---

# Loading

Durante qualquer requisição:

- Exibir indicador de carregamento.
- Desabilitar botões.

Evitar múltiplos cliques.

---

# Responsividade

A aplicação deverá funcionar corretamente em:

- Desktop
- Notebook
- Tablet
- Smartphone

Breakpoints sugeridos:

- Desktop ≥ 1200px
- Notebook ≥ 992px
- Tablet ≥ 768px
- Mobile < 768px

---

# Acessibilidade

Implementar:

- Labels para todos os campos.
- Placeholder apenas como auxílio.
- Navegação por teclado.
- Botões acessíveis.
- Contraste adequado.

---

# Organização do CSS

Separar por responsabilidade.

Exemplo:

```text
reset.css

variables.css

components.css

login.css

dashboard.css
```

Evitar CSS duplicado.

---

# Organização do JavaScript

## config.js

Configurações públicas.

---

## api.js

Comunicação com backend.

---

## auth.js

Login.

Logout.

Controle do token.

---

## customers.js

CRUD.

---

## cep.js

Integração ViaCEP.

---

## ui.js

Manipulação da interface.

---

## main.js

Inicialização da aplicação.

---

# Armazenamento

Salvar apenas:

JWT

no Local Storage.

Nunca armazenar:

- Senhas
- Dados sensíveis
- Informações dos clientes

---

# Navegação

Caso o JWT não exista:

↓

Redirecionar para Login.

Caso exista:

↓

Permitir acesso ao Dashboard.

---

# Critérios de Aceite

- Tela de login criada.
- Dashboard criada.
- Layout responsivo.
- Formulário completo.
- Tabela de clientes.
- Modal de confirmação.
- Mensagens de feedback.
- Loading implementado.
- Estrutura CSS organizada.
- Estrutura JavaScript organizada.
- Integração preparada para consumir a API.

---

# Fora do Escopo

Nesta etapa não deverá ser implementado:

- Comunicação real com a API.
- CRUD funcional.
- ViaCEP funcional.
- Docker.
- Deploy.

---

# Resultado Esperado

Ao final deste PRD, o FrostHub deverá possuir uma interface moderna, organizada e responsiva, composta por uma tela de login e um dashboard para gerenciamento de clientes. O frontend estará completamente estruturado para integração com a API desenvolvida nos próximos PRDs, seguindo boas práticas de organização, acessibilidade e experiência do usuário.