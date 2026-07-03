# Banco de dados

Pasta com os scripts SQL do projeto.

## Arquivos

- init.sql — cria as tabelas users e customers
- seed.sql — cria o usuário admin de teste

## Variáveis

No postgres você precisa configurar:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=frostyhub_db
```

O nome do banco tem que bater com o que você colocar na DATABASE_URL do backend.

## Rodar com Docker

```bash
docker run -d \
  --name frostyhub-db \
  --network frostyhub-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=frostyhub_db \
  -p 5432:5432 \
  -v frostyhub_pgdata:/var/lib/postgresql/data \
  -v "$(pwd)/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro" \
  postgres:17-alpine
```

Na primeira vez que o container sobe, o init.sql roda sozinho.

Depois roda o seed:

```bash
docker exec -i frostyhub-db psql -U postgres -d frostyhub_db < seed.sql
```

## No EasyPanel

1. Cria o serviço de PostgreSQL
2. Ativa volume persistente
3. Abre o terminal e cola o conteúdo do init.sql
4. Depois roda o seed.sql
5. Na DATABASE_URL do backend, usa o hostname interno do postgres (não usa localhost)

Exemplo:

```
DATABASE_URL=postgresql://postgres:SENHA@nome-do-postgres:5432/frostyhub_db?sslmode=disable
```

## Usuário de teste

- admin@frostyhub.com
- admin123
