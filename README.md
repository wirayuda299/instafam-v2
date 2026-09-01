# Instafam v2

Instagram-style social app. Monorepo with a Next.js client and a NestJS API server, backed by Postgres.

## Stack

**Client** (`client/`)
- Next.js 15 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS, shadcn/radix UI components
- Clerk (auth), Uploadthing (file uploads), Cloudinary (media), Socket.IO client (realtime), SWR

**Server** (`server/`)
- NestJS 12, TypeScript
- Postgres (`pg`), Cloudinary SDK, Socket.IO (realtime gateway)
- node-pg-migrate for schema migrations

**Database**
- PostgreSQL 16, run locally via Podman

## Features

- User profiles, follow/following
- Posts with media, likes, bookmarks
- Comments with replies + comment likes
- Direct messages (conversations + threaded messages)
- Post reporting

## Prerequisites

- Node.js + [pnpm](https://pnpm.io)
- [Podman](https://podman.io)

## Getting started

### 1. Start Postgres

```bash
podman run -d \
  --name instafam \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=instafam \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

### 2. Configure environment variables

Copy the example env files and fill in the blanks (Cloudinary, Clerk, Uploadthing keys):

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

`server/.env`'s `DATABASE_URL` is what node-pg-migrate and the app both read.

### 3. Install dependencies

```bash
cd server && pnpm install
cd ../client && pnpm install
```

### 4. Run migrations

```bash
cd server
pnpm migrate:up
```

See [`server/migrations`](./server/migrations) for existing migrations and how to add new ones (`pnpm migrate:create <name>`). Roll back the last migration with `pnpm migrate:down`.

### 5. Run the apps

```bash
# server (http://localhost:3001)
cd server && pnpm start:dev

# client (http://localhost:3000)
cd client && pnpm dev
```

## Project structure

```
instafam-v2/
├── client/    # Next.js frontend
└── server/    # NestJS API + migrations
```
