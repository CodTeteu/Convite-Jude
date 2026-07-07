# Prompt Para Adaptar Um Novo Convite

Use este projeto como template. Nao recrie backend, banco, autenticacao, APIs ou painel admin.

Altere principalmente `src/config/invite.ts` e imagens em `public/images/`.

Regras:

- Mantenha Supabase apenas no backend `api/`.
- Nao crie `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY`.
- Use `eventType: "graduation"` para formatura ou `eventType: "wedding"` para casamento.
- Use `giftList.enabled: true` apenas se o cliente quiser lista de presentes.
- Se `giftList.enabled: false`, nao mostre secao de presentes nem rota `/presentes`.
- Mantenha RSVP e admin funcionando.
- Depois das alteracoes, rode `npm run typecheck` e `npm run build`.

Dados do novo convite:

- Tipo do evento:
- Nome(s):
- Data:
- Horario:
- Local:
- Dominio:
- WhatsApp:
- Deadline RSVP:
- Lista de presentes: sim/nao
- PIX, se houver:
- Estilo visual desejado:
