# Novo Convite

1. Copie a pasta `Convite-Template` para uma nova pasta do cliente.
2. Altere `package.json` com o nome do convite.
3. Preencha `src/config/invite.ts`.
4. Substitua imagens em `public/images/hero`, `public/images/gallery` e `public/images/gifts`.
5. Crie um projeto Supabase novo.
6. Rode `001_base_rsvp.sql`.
7. Se `giftList.enabled` for `true`, rode `002_optional_gift_list.sql`.
8. Configure as variaveis na Vercel.
9. Rode `npm run typecheck`, `npm run build` e `npm run lint`.
10. Faca o checklist de QA antes de entregar.

## Arquivo Principal

O principal arquivo para vibecoding e personalizacao e `src/config/invite.ts`.

Evite mexer em `api/`, `shared/` e `supabase/migrations/` em convites comuns.
