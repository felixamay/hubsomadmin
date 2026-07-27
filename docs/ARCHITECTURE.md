# Hubsom Admin — Architecture

## Goals

Single secure dashboard with operational control over Hubsom Marketplace and Huber Delivery: identity verification, platform-first payments, payouts, live ops, moderation, and configuration.

## Layers

### Domain (`src/domain`)

Pure types and policies:

- Entities mirrored from Hubsom (`Order`, `Seller`, `LiveStream`, `Auction`) and Huber (`Driver`, `VerificationStatus`, `Withdrawal`/`Payout`, MoMo methods)
- Enums for status machines
- RBAC permission catalog and role maps

### Application (`src/application`)

Server Actions that:

1. Require an authenticated admin session
2. Mutate the store
3. Append audit log entries
4. Revalidate affected routes

### Infrastructure (`src/infrastructure`)

- **Auth:** Auth.js credentials + TOTP (`otplib`) + demo MFA bypass
- **Persistence:** Process-local seed store (`globalThis`) suitable for demos; replace with shared DB for multi-instance production
- **Seed:** Ghana-centric Accra/Kumasi/Tema sample data

### Presentation (`src/app`, `src/components`)

- `(auth)/login` — email, password, MFA challenge
- `(dashboard)/*` — module pages + client action components
- Shared shell, tables, charts, Leaflet map

## Payment model

Customers pay **Hubsom** first. Captured payments record:

- Gross amount (GHS)
- Processor fee
- Platform commission
- Net (available for seller/driver settlement)

Payouts are explicit admin (or scheduled) releases to sellers/drivers.

## Driver online gate

`Driver.canGoOnline === (verificationStatus === "approved")`. Suspended/banned/rejected drivers are forced offline.

## Extending to production

1. Replace `adminStore` with Prisma/Postgres (or Hubsom `.data` + Huber SQLite/Firebase adapters)
2. Add webhook consumers for Huber delivery events
3. Enforce `roleHasPermission` in a shared `requirePermission()` guard on every action
4. Move MFA secrets to encrypted vault; remove demo bypass
5. Add background jobs for auto-payouts and fraud rules
