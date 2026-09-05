# Shagun — Digital Dining

Customer-only QR ordering for Shagun. Guests scan the table QR, browse the menu, add to cart, pay, track the kitchen, and join Shagun Rewards.

This is not an admin, owner, or analytics product.

## Run locally

You need **two terminals**: API first, then this app.

### 1. Backend (port 3001)

```bash
cd ~/2026/QR-Ordering-Interface-Backend
brew services start postgresql@16
npm run start:dev
```

### 2. Customer app (port 3000)

```bash
cd ~/2026/restaurant-digital-dining
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then [http://localhost:3000/demo](http://localhost:3000/demo) for table QR codes.

Phone se test: `~/2026/qr-codes/` mein PNG hain (same Wi‑Fi). Vercel URL aane ke baad unhe dubara generate karna.

Scan or tap a QR. That starts a dining session with the API and loads Shagun’s live menu.

If the API is down, the app still opens from mock data so cart / pay / loyalty keep working.

## QR entry

Open `/demo` to print signed table QRs for Shagun. A printed table QR should open a signed link like:

```
/restaurant/shagun?k=<signed-token>
```

Guests should not type a URL. If someone changes the token or restaurant name, the app shows an invalid QR page.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

## Architecture

```
app/            routes
components/     reusable dining UI
features/       screen-level client flows
services/       API-ready data access
types/          shared contracts
mock-data/      restaurant, menu, loyalty, recommendations
utils/          money, cart pricing, storage, theme
```

Restaurant branding and menu load from the Phase 1 API when a dining session cookie is present:

| Service | API |
| --- | --- |
| `restaurantService` | `GET /v1/restaurants/:slug` + `GET /v1/restaurants/:slug/menu` |
| `menuService` | same menu payload (via restaurant) |

Still mock (not wired yet):

| Service | Future API |
| --- | --- |
| `orderService` | `POST /orders`, `GET /orders/:id` |
| `loyaltyService` | `GET/POST /restaurants/:slug/loyalty` |
| `recommendationService` | `POST /restaurants/:slug/recommendations` |

Do not call a model from the browser. Recommendation UI is mock-only today.
