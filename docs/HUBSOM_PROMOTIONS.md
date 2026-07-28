# Hubsom promotions (Admin)

Admin UI: `/promotions`  
Proxies (session-authed):

- `GET /api/hubsom/catalog` → Hubsom `GET /api/admin/catalog`
- `GET|POST|PUT|DELETE /api/hubsom/promotions` → Hubsom `/api/admin/promotions`

Env:

```bash
HUBSOM_API_BASE_URL=http://localhost:3000
HUBSOM_ADMIN_API_KEY=shared-secret-here
```

Server sends `X-Hubsom-Admin-Key` (and Bearer) — key is never exposed to the browser.

Contract: [ADMIN_PROMOTIONS.md](https://github.com/felixamay/hubsom/blob/cursor/hubsom-live-commerce-8a7a/docs/ADMIN_PROMOTIONS.md)
