# Instafam v2

Instagram-style social app. Monorepo with a Next.js client and a NestJS API server, backed by Postgres.

## Stack

**Client** (`client/`)
- Next.js 15 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS, shadcn/radix UI components
- Clerk (auth), Uploadthing (file uploads), Cloudinary (media), Socket.IO client (realtime), SWR

**Server** (`server/`)
- NestJS 10, TypeScript
- Postgres (`pg`), Cloudinary SDK, Socket.IO (realtime gateway)
- golang-migrate for schema migrations

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
- [Go](https://go.dev) (only needed to install the `migrate` CLI)

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

### 2. Install the migration CLI

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
export PATH=$PATH:$(go env GOPATH)/bin
```

### 3. Run migrations

```bash
cd server
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/instafam?sslmode=disable" up
```

See [`server/migrations`](./server/migrations) for existing migrations and how to add new ones.

### 4. Configure environment variables

Copy the example env files and fill in the blanks (Cloudinary, Clerk, Uploadthing keys):

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

### 5. Install dependencies

```bash
cd server && pnpm install
cd ../client && pnpm install
```

### 6. Run the apps

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
