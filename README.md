# Hubsom Admin

Production-ready central administration portal for **Hubsom Marketplace** and **Huber Delivery**.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **Material UI 7**
- **Recharts** (analytics)
- **OpenStreetMap / Leaflet** (live map)
- **Auth.js (NextAuth v5)** with email/password + **TOTP MFA**
- Role-based access control (RBAC)

## Architecture

Clean Architecture layout:

```
src/
  domain/           # Entities, enums, permissions
  application/      # Server actions / use-cases
  infrastructure/   # Auth, in-memory seed store
  components/       # Shared UI (shell, tables, charts, map)
  app/
    (auth)/login
    (dashboard)/…   # All admin modules
    api/…
```

Data is seeded in-memory (aligned with Hubsom JSON models + Huber driver/verification models) so the portal runs without an external database. Swap `infrastructure/persistence/store.ts` for Postgres/Prisma when integrating live Hubsom/Huber backends.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Admin runs on **port 3001** so it can sit alongside Hubsom on 3000:

- Hubsom Admin → [http://localhost:3001](http://localhost:3001)
- Hubsom Marketplace → [http://localhost:3000](http://localhost:3000)

### Authentication

Real credentials auth (Auth.js + bcrypt). The owner account is bootstrapped from `.env.local`:

```
ADMIN_EMAIL=felixames0808@gmail.com
ADMIN_PASSWORD=…   # bcrypt-hashed on boot
ADMIN_NAME=Felix Amesimeku
AUTH_SECRET=…      # required
```

Operational data starts empty (no demo users/sellers/drivers). Persistence lives in `.data/admin-db.json`. MFA is optional per admin (TOTP via authenticator app when enabled).

## Modules

| Area | Capabilities |
|------|----------------|
| Dashboard | Real-time KPIs for users, sellers, drivers, streams, auctions, revenue, payouts, tickets |
| Users | Search, suspend/ban/unban/disable, purchase & order context |
| Sellers | Approve/reject/suspend/ban, verification, revenue |
| Drivers (Huber) | Verification gate (`canGoOnline` only when approved), suspend/ban |
| Document Verification | ID, license, vehicle, insurance, photos, selfie review |
| Payments | Platform-first capture, refunds, chargebacks |
| Payouts | Seller + driver (MTN MoMo, Telecel Cash, AirtelTigo, bank) |
| Orders / Deliveries | Cancel, refund, force-complete, reassign |
| Map | OSM live drivers, pickups, dropoffs |
| Live Streams / Auctions | Monitor, end, feature, pause, dispute |
| Products / Categories | Moderation, featured, taxonomy |
| Moderation / Reviews | Reports, abusive content, ratings |
| Support | Customer/seller/driver tickets, escalate/resolve |
| Promotions / Notifications | Coupons, flash sales, push/email campaigns |
| Analytics / Fraud | Revenue, retention signals, fraud cases |
| Security / Settings | Sessions, login history, audit logs, fees & pricing rules |

## Roles

- `super_admin` — full access  
- `finance_admin` — payments, payouts, analytics  
- `support_admin` — users, orders, tickets  
- `moderation_admin` — content, fraud, streams  
- `operations_admin` — drivers, verification, deliveries, map, promotions  

See `src/domain/permissions/index.ts`.

## Integration notes

Aligned with:

- [hubsom](https://github.com/felixamay/hubsom) — marketplace types (GHS, sellers, orders, streams, auctions, shipments)
- [Huber-](https://github.com/felixamay/Huber-) — driver verification, wallets, MoMo payouts, delivery lifecycle

Wire production data via Hubsom APIs + Huber `free-backend` / Hubers `/v1/delivery-offers` using env:

```
HUBSOM_API_BASE_URL=
HUBERS_API_BASE_URL=
HUBERS_API_KEY=
```

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve build
npm run lint     # ESLint
```

## Security

- MFA for privileged admins
- JWT sessions (8h)
- RBAC permission checks (extend middleware for per-route gates)
- Audit log for sensitive mutations
- Session revoke + login history in Security module

## License

Private — Hubsom / Felix Amesimeku
