# Banco de Dados — PostgreSQL

Scripts SQL do FrostyHub para inicialização do banco.

## Arquivos

| Arquivo    | Descrição                              |
|------------|----------------------------------------|
| `init.sql` | Criação das tabelas `users` e `customers` |
| `seed.sql` | Dados iniciais (usuário admin de teste) |

## Variáveis de ambiente

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_DB=frosthub_db
```

> O nome do banco (`POSTGRES_DB`) deve ser o mesmo usado na `DATABASE_URL` do backend.

## Docker (desenvolvimento local)

```bash
docker run -d \
  --name frostyhub-db \
  --network frostyhub-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=frosthub_db \
  -p 5432:5432 \
  -v frostyhub_pgdata:/var/lib/postgresql/data \
  -v "$(pwd)/init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro" \
  postgres:17-alpine
```

O script `init.sql` é executado automaticamente na **primeira** inicialização do volume.

Após subir o container, execute o seed:

```bash
docker exec -i frostyhub-db psql -U postgres -d frosthub_db < seed.sql
```

## EasyPanel

1. Crie um serviço **PostgreSQL** (template do painel).
2. Configure `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB`.
3. Ative **volume persistente** (obrigatório).
4. No terminal do PostgreSQL, execute `init.sql` e depois `seed.sql`.
5. Use o **hostname interno** do serviço na `DATABASE_URL` do backend:

```env
DATABASE_URL=postgresql://postgres:SENHA@nome-servico-postgres:5432/frosthub_db?sslmode=disable
```

> Em produção, **nunca** use `localhost` na `DATABASE_URL` do backend — use o hostname do container na rede Docker.

## Credenciais de teste (seed)

- E-mail: `admin@frostyhub.com`
- Senha: `admin123`
