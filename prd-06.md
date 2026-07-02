# PRD-006 — Integração com ViaCEP e Automação de Endereço

## Objetivo

Implementar a integração do **FrostHub** com a API pública ViaCEP para preenchimento automático de endereço no cadastro e edição de clientes, reduzindo erro humano e acelerando o preenchimento de formulários.

---

# Visão Geral

Sempre que o usuário informar um CEP válido (8 dígitos), o sistema deverá consultar a API:

```text
https://viacep.com.br/ws/{CEP}/json/
```

E preencher automaticamente os campos de endereço no formulário de cliente.

---

# Fluxo da Funcionalidade

```text
Usuário digita CEP
        │
        ▼
Evento (blur ou botão buscar)
        │
        ▼
Validação do CEP (8 dígitos)
        │
        ▼
Requisição ViaCEP
        │
        ▼
Resposta recebida
        │
        ▼
Preenchimento automático dos campos
```

---

# Regras de Negócio

- O CEP deve conter exatamente **8 dígitos numéricos**
- Não permitir caracteres especiais ou letras
- A busca deve ocorrer no evento:
  - `blur` (perda de foco) **OU**
  - botão "Buscar CEP"
- Em caso de erro:
  - CEP inválido
  - CEP não encontrado
  - Falha de rede

o sistema deve informar o usuário

---

# Endpoint ViaCEP

## Requisição

```http
GET https://viacep.com.br/ws/{cep}/json/
```

## Exemplo

```http
GET https://viacep.com.br/ws/60811210/json/
```

---

## Resposta esperada

```json
{
  "cep": "60811-210",
  "logradouro": "Rua Exemplo",
  "complemento": "",
  "bairro": "Centro",
  "localidade": "Fortaleza",
  "uf": "CE"
}
```

---

# Campos a serem preenchidos automaticamente

Ao receber resposta válida:

| Campo API | Campo do Sistema |
|----------|------------------|
| logradouro | street |
| bairro | neighborhood |
| localidade | city |
| uf | state / uf |

---

# Comportamento da Interface

## Sucesso

- Preencher campos automaticamente
- Destacar campos preenchidos (leve feedback visual)
- Permitir edição manual após preenchimento

---

## CEP inválido (formato)

- Exibir mensagem:
```text
CEP inválido. Digite 8 números.
```

- Não realizar requisição

---

## CEP não encontrado

Resposta ViaCEP:

```json
{ "erro": true }
```

Exibir mensagem:

```text
CEP não encontrado.
```

---

## Falha de rede

Exibir mensagem genérica:

```text
Erro ao buscar CEP. Tente novamente.
```

---

# Validação

Antes de chamar a API:

```text
Regex: /^[0-9]{8}$/
```

Qualquer outro formato deve ser bloqueado.

---

# Arquitetura Frontend

## cep.js

Responsável por toda lógica de integração ViaCEP:

- Capturar evento do input CEP
- Validar formato
- Fazer request HTTP
- Tratar resposta
- Preencher formulário
- Tratar erros

---

## api.js (não utilizar aqui)

A integração ViaCEP **não deve passar pelo backend**, pois:

- É uma API pública
- Não contém dados sensíveis
- Reduz carga do servidor

---

# UX (Experiência do Usuário)

- Busca automática ao sair do campo CEP
- Ou botão "Buscar CEP"
- Feedback visual durante carregamento
- Preenchimento instantâneo dos campos
- Permitir edição manual após autopreenchimento

---

# Loading

Durante requisição:

- Exibir indicador pequeno ao lado do input CEP
- Desabilitar botão de busca temporariamente

---

# Segurança

- Não armazenar dados do ViaCEP no backend
- Não persistir resposta sem validação
- Sanitizar dados antes de enviar ao backend

---

# Regras de Implementação

- Usar `fetch()` diretamente no frontend
- Não criar dependência no backend
- Não salvar CEP sem validação
- Não bloquear edição dos campos preenchidos

---

# Estrutura de Arquivos

```text
frontend/js/
├── cep.js
```

---

# Critérios de Aceite

- CEP com 8 dígitos válido dispara busca
- Integração com ViaCEP funcionando
- Campos de endereço preenchidos automaticamente
- Tratamento de CEP inválido
- Tratamento de CEP não encontrado
- Tratamento de erro de rede
- Interface com feedback visual
- Campos continuam editáveis após preenchimento

---

# Fora do Escopo

- Persistência de dados do ViaCEP no backend
- Cache de CEPs
- Autocomplete avançado
- Sugestão de endereços
- Validação geográfica avançada

---

# Resultado Esperado

Ao final deste PRD, o FrostHub deverá possuir uma integração funcional com o ViaCEP, permitindo que o usuário preencha automaticamente o endereço a partir do CEP, melhorando significativamente a usabilidade do sistema e reduzindo erros de digitação no cadastro de clientes.