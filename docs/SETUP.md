# Setup Do Template

## Requisitos

- Node.js compativel com Vite 7.
- Conta Vercel.
- Projeto Supabase novo para cada convite.

## Variaveis Da Vercel

Configure no projeto Vercel:

- `VITE_SITE_URL`: dominio publico do convite.
- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: service role do Supabase. Nunca use prefixo `VITE_`.
- `ADMIN_PASSWORD`: senha unica do painel admin.
- `ADMIN_JWT_SECRET`: segredo longo para assinar cookie admin.
- `CRON_SECRET`: segredo para cron, se o keep-alive estiver ativo.

## Banco Supabase

Rode sempre o SQL de `supabase/migrations/001_base_rsvp.sql`.

Rode apenas se a lista de presentes estiver ativa: `supabase/migrations/002_optional_gift_list.sql`.

## Desenvolvimento Local

Use `npm run dev` para frontend.

Use `npm run dev:vercel` para testar APIs Vercel localmente.
