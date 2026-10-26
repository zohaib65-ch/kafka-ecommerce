# MERN Ecommerce

## Description

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable three main different flows or implementations:

1. Buyers browse the store categories, products and brands
2. Sellers or Merchants manage their own brand component
3. Admins manage and control the entire store components 

### Features:

  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * Next.js (App Router) and React for the storefront and dashboards, written in TypeScript
  * Tailwind CSS and shadcn/ui for the interface, with Lucide icons
  * React Hook Form and Zod for forms and validation
  * Redux Toolkit (with thunks) to manage application's state

## Demo

This application is deployed on Vercel Please check it out :smile: [here](https://mern-store-gold.vercel.app).

See admin dashboard [demo](https://mernstore-bucket.s3.us-east-2.amazonaws.com/admin.mp4)

## Docker Guide

To run this project locally you can use docker compose provided in the repository. Here is a guide on how to run this project locally using docker compose.

Clone the repository
```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
```

Edit the dockercompose.yml file and update the the values for MONGO_URI and JWT_SECRET

Then simply start the docker compose:

```
docker-compose build
docker-compose up
```

## Database Seed

* The seed command will create an admin user in the database
* The email and password are passed with the command as arguments
* Like below command, replace brackets with email and password. 
* For more information, see code [here](server/utils/seed.js)

```
cd server
npm run seed:db -- [email-***@****.com] [password-******] // This is just an example.
```

## Install

`npm install` in the project root will install dependencies in both `client` and `server`. [See package.json](package.json)

Some basic Git commands are:

```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
cd project
npm install
```

## ENV

Create `.env` file for both client and server. See examples:

[Frontend ENV](client/.env.example)

[Backend ENV](server/.env.example)

The client reads `NEXT_PUBLIC_API_URL` (the base URL of the API, for example `http://localhost:3000/api`). The name `API_URL`, used before the Next.js migration, is still accepted so existing `.env` files keep working. `NEXT_PUBLIC_*` variables are inlined into the browser bundle at build time, so never put secrets in them.

The client dev server runs on port 8080 to match `CLIENT_URL` in the server env (used for the OAuth and email links).


## Pulseboard analytics (optional)

The store can send anonymous activity to a Pulseboard Kafka analytics dashboard. It is **off unless both** `PULSEBOARD_URL` and `PULSEBOARD_ADMIN_TOKEN` are set in `server/.env` (see `server/.env.example`); the shop behaves exactly as before without them. The browser never talks to Pulseboard or Kafka and holds no credentials for them.

```
browser tracker ──POST /api/track──▶ store API ──POST /api/events (Bearer token)──▶ Pulseboard ──▶ Kafka website-events ──▶ consumers ──▶ MongoDB ──▶ dashboard
                                          ▲
              order saved (server-side) ──┘  order_created
```

| Event | Emitted by | When |
|---|---|---|
| `page_view` | browser | storefront route changes (`/`, `/shop…`, `/product/:slug`, `/login`, `/register`, `/order/success`, …) |
| `product_click` | browser | a product card in the shop grid is clicked |
| `add_to_cart` / `remove_from_cart` | browser | the real "Add To Bag" / remove actions (the cart lives in the browser until checkout, so the server cannot see these) |
| `order_created` | **server** | right after the order is saved in `POST /api/order/add`, before the confirmation email |

**Privacy.** Events carry a random per-tab session id, a pathname (never a query string), and a product slug (or id). They never carry the login token (no cookies or `Authorization` header are sent), emails, names or payment data. Routes with secrets or record ids (`/reset-password/:token`, `/merchant-signup/:token`, `/auth/*`, `/dashboard/*`, `/order/:id`) are not tracked, and order pages are collapsed to `/order/success`. Tracking is skipped when the browser sends Do Not Track or Global Privacy Control. Server-side events use the browser's session id when the order request carries it; otherwise an HMAC of the user id, never the raw id.

**Reliability (best effort, not guaranteed delivery).** Analytics can never block or fail a shopping request: `/api/track` answers `202` as soon as events are queued, and order emission never throws or waits. Events wait in a bounded in-memory queue (1000) and are sent in batches of up to 10 with exponential backoff, always with the same `eventId`; Pulseboard's consumers discard duplicates. Order events use an id derived from the order id, so they cannot be counted twice. What can still be **lost**: events still queued when the process crashes, events dropped after 8 failed attempts (about a minute and a half of continuous failure, longer when requests time out), and events dropped while the queue is full. A persistent outbox (for example a MongoDB collection drained by a worker) would remove the crash window if you need stronger guarantees. Pulseboard's shared ingestion limit (20 events/s, 300/min) also bounds how much traffic one dashboard accepts.

**Tests.** `cd server && npm test` (Node 18+ for the built-in test runner) covers validation, privacy, dedupe, retries, backoff, queue bounds and the `/api/track` route against a fake Pulseboard.

## Vercel Deployment

Both frontend and backend are deployed on Vercel from the same repository. When deploying on Vercel, make sure to specifiy the root directory as `client` and `server` when importing the repository. The client is a standard Next.js project (Vercel detects it automatically; set `NEXT_PUBLIC_API_URL` in the project settings). See [server vercel.json](server/vercel.json) for the API.

## Start development

```
npm run dev
```

## Client scripts

Run these inside `client/`:

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server on http://localhost:8080 |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (validation schemas, cart logic, analytics helpers) |
| `npm run format` | Prettier (with Tailwind class sorting) |

## Images

Product photos fall back to royalty-free stock photography when a product has no uploaded image, and the home page, category tiles and marketing pages use curated photos. All of them live in `client/public/images` and are credited in [client/docs/image-credits](client/docs/image-credits).

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [Next.js](https://nextjs.org/) and [React](https://react.dev/)

- [TypeScript](https://www.typescriptlang.org/)

- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)

- [Redux Toolkit](https://redux-toolkit.js.org/)

- [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)

- [Lucide](https://lucide.dev/)


### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json

    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }

```

