# Northcloud — Frontend (Next.js + TypeScript)

Responsive frontend for the Northcloud cloud-hosting platform: public website, login pages, customer panel and admin panel. Built from the Figma file `northcloud-website` and the two project briefs.

**Frontend only.** All data is demo data from a typed mock adapter (`lib/api/mock`). Nothing is sent to a server. The NestJS backend plugs in later behind the same API layer.

---

## Demo logins

| Panel | Email | Password |
|---|---|---|
| Admin panel | `northcloud99@gmail.com` | `north111` |
| Customer panel | `democustomer2@gmail.com` | `customer111` |

The login page has **"Demo accounts · click to fill"** buttons for both accounts.

> These logins are checked in the browser **for the demo only**. Real authentication, sessions and permissions must come from the NestJS API.

---

## Run it

Requirements: **Node.js 20.9 or newer**.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

### On a Chromebook
1. Settings → Advanced → Developers → turn on **Linux development environment**.
2. In the Linux terminal install Node 20+ (e.g. with `nvm`: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`, then `nvm install 22`).
3. Copy the zip into "Linux files", unzip, then `npm install` and `npm run dev`.
4. Open `http://localhost:3000` in Chrome.

### Share a live link with the client
Push the folder to GitHub, then import the repo on **vercel.com** (free plan). Vercel detects Next.js automatically and gives you a public URL.

---

## Pages (routes)

**Public website**
- `/` — Homepage: hero, stats, features, terminal section, pricing, FAQ, "Why Northstar", CTA, footer
- `/docs` — Documentation (searchable, expandable guides with copy buttons)
- `/contact` — Contact / support form
- `/legal` — Privacy & Terms (placeholder text)
- `/login`, `/register`, `/forgot-password`

**Customer panel** (`/dashboard`)
- Overview · My Services · Deploy New Server (`/servers/new`) · Server details (`/servers/[id]`)
- SSH Keys · Firewall · Billing & Payments · Activity Log · Support Center · Account Settings

**Admin panel** (`/admin`)
- Overview · Customers · Servers & Infrastructure · Plans & Pricing · Billing · Support Tickets · Security & Logs · Settings

---

## Requested extras — where to find them

| Feature | Where |
|---|---|
| Site search | Navbar search + `Ctrl/⌘ K` or `/` on the website; top-bar search in both panels (servers, invoices, tickets, customers…) |
| Back to top button | All pages, appears after scrolling |
| Mobile menu | Website hamburger menu; slide-out sidebar in both panels |
| Loading animations | Skeletons on every data section, page loader, button spinners, scroll-reveal, hero float, terminal typing |
| Hover states | Buttons, cards, table rows, links, nav items, charts (tooltips) |
| Scroll progress bar | Thin blue bar at the top of every page |
| Copy button | Terminal command, docs code, IP addresses, SSH fingerprints, server IDs |
| Print style sheet | `app/globals.css` (`@media print`): hides navigation and buttons; invoices have a Print button |
| Sticky headers | Website navbar, panel top bars, deploy summary, settings side menus |
| Skip to content | First Tab press on any page |
| Password visibility toggle | Login, sign-up, change-password |
| Form success / error states | Login, sign-up, contact, SSH key, firewall rule, support ticket, settings, billing |
| Confirmation modals | Restart/stop/delete server, deploy order, delete key, remove rule, sign out, suspend customer, refunds, reset settings, account closure |
| Last updated date | Footer, FAQ, docs; "Last updated" + refresh on dashboards |
| Expandable FAQ | Homepage FAQ (accordion) |
| Floating contact button | Bottom-right on the website |

**Demo tips**
- Contact form: put the word **fail** in the message to see the error state.
- Server actions (restart, stop, start, delete, deploy) show **pending** first and only show success after the simulated provider confirms, as the brief requires.
- Demo changes are saved in the browser. To reset, clear site data or remove the `northcloud-demo-db-v1` key from localStorage.

---

## Project structure

```
app/                 routes (App Router): (marketing), (auth), dashboard, admin
components/ui/       buttons, fields, modals, toasts, tables, badges, skeletons…
components/layout/   logos, search palette, scroll progress, back-to-top, reveal
components/panel/    shared panel shell (sidebar, top bar), page header
components/charts/   lightweight SVG charts
features/            page components: marketing, auth, customer, admin
lib/api/             typed API contract + mock adapter (demo data) + fetch helper
lib/auth/            demo session + role guard
hooks/               useApi (loading/error/refresh), useCatalog, …
types/               view models (Server, Invoice, Plan, …)
```

## Connecting the NestJS API
1. Agree endpoint paths with the API owner (none are invented here).
2. Write `lib/api/http-adapter.ts` that implements `NorthcloudApi` (`lib/api/contract.ts`) using `httpRequest()`.
3. Point `api` in `lib/api/index.ts` to it and set the values in `.env.local` (see `.env.example`).
4. Remove `generateStaticParams` in `app/dashboard/servers/[id]/page.tsx` so the page renders on demand.

Pages never import demo data directly, so they don't need changes.

---

## Decisions made (please confirm with the client)
- **Brand:** the designs say "Northstar Cloud"; the brief says "Northcloud". The UI keeps the design text.
- **Two customer dashboards** ("customer Panel" and "Over view") were merged into one Overview page. It uses the customer Panel layout and adds the "Your Servers" table from Over view.
- **One plan catalog** (Starter $5, Professional $20, Business $48, Enterprise $99 draft) is used everywhere. The Figma screens had three different sets. Website prices start from this catalog.
- **One customer layout:** the customer screens used two different sidebars and top bars, so the customer panel uses one shared layout.
- **Figma bugs fixed:** misaligned table columns, the terminal text overlap, the FAQ showing all answers, the oversized text and missing toggles in admin Settings, and the footer links.
- **HomeScreen01** (crypto-wallet screen) is not included.
- **Added screens not in Figma:** sign-in form, forgot password, docs, contact, legal, and admin Support Tickets. They reuse the same components.
- **Still missing from the designs** (needed by the requirements): third-party provider management, orders and a real checkout.
