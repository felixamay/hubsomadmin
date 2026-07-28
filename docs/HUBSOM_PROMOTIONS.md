# Hubsom promotions (Admin)

Admin UI: `/promotions`  
Proxies (session-authed):

- `GET /api/hubsom/status` → connectivity check (catalog + promotions)
- `GET /api/hubsom/catalog` → Hubsom `GET /api/admin/catalog`
- `GET|POST|PUT|DELETE /api/hubsom/promotions` → Hubsom `/api/admin/promotions`

Env (admin `.env.local`):

```bash
HUBSOM_API_BASE_URL=http://127.0.0.1:3000
HUBSOM_ADMIN_API_KEY=shared-secret-here
```

Prefer `127.0.0.1` over `localhost` if Node resolves IPv6 and Hubsom only listens on IPv4.

Server sends `X-Hubsom-Admin-Key` (and Bearer) — key is never exposed to the browser.

## If you see "fetch failed" / Hubsom not reachable

1. Run **Hubsom** on branch `cursor/hubsom-live-commerce-8a7a` (port **3000**).
2. Set the **same** `HUBSOM_ADMIN_API_KEY` in Hubsom and admin.
3. Restart admin (`npm run dev` on **3001**) after changing `.env.local`.
4. Open `/promotions` and use **Refresh** — the status banner shows the target URL and whether the key is set.

Contract: [ADMIN_PROMOTIONS.md](https://github.com/felixamay/hubsom/blob/cursor/hubsom-live-commerce-8a7a/docs/ADMIN_PROMOTIONS.md)
