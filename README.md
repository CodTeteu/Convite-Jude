# Formatura Camilla

Convite digital premium de formatura para `Camilla Santana Conegundes`, com experiência mobile-first, área administrativa segura e persistência de RSVP em Supabase.

## Stack

- `Vite + React + TypeScript`
- `Tailwind CSS v4`
- `Framer Motion`
- `Vercel Functions`
- `Supabase`

## Estrutura

- `src/config/invite.ts`: conteúdo centralizado do convite.
- `src/components/sections/*`: seções da landing.
- `src/pages/AdminPage.tsx`: painel administrativo.
- `api/*`: endpoints serverless do RSVP e do admin.
- `shared/*`: tipagem e schemas compartilhados entre frontend e backend.
- `supabase/migrations/*`: versionamento da estrutura do banco.
- `scripts/optimize-images.mjs`: pipeline de otimização das fotos locais.

## Scripts

- `npm run dev`: desenvolvimento visual do frontend.
- `npm run dev:vercel`: desenvolvimento full-stack com Vercel Functions.
- `npm run prepare:images`: gera versões otimizadas das fotos.
- `npm run typecheck`: checagem TypeScript do frontend, backend e scripts.
- `npm run lint`: lint do projeto.
- `npm run build`: otimiza imagens, valida tipos e gera o build de produção.

## Variáveis de ambiente

Copie `.env.example` e configure:

- `VITE_SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`

## Banco de dados

A migration principal cria a tabela `public.rsvp_confirmations` com:

- dados do convidado
- status de presença
- quantidade e nomes de acompanhantes
- observações do convidado
- observações internas do admin
- origem, slug do evento e carimbos de data

## Fluxo do RSVP

1. O convidado preenche o formulário.
2. O frontend envia `POST /api/rsvp`.
3. A função serverless valida e grava no Supabase usando service role.
4. O usuário recebe feedback elegante e pode continuar pelo WhatsApp com mensagem pronta.

## Fluxo do Admin

1. Acesso em `/admin`.
2. Login por senha privada via `POST /api/admin/login`.
3. Sessão em cookie HttpOnly assinado.
4. Listagem, filtro, busca, edição e exportação via funções protegidas.

## Observações

- As imagens finais são geradas a partir da pasta local `fotos`.
- O frontend não usa Supabase no browser.
- Para testar frontend + API localmente, prefira `npm run dev:vercel`.
