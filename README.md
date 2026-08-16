# Restaurant Digital Dining Experience

Customer-only QR ordering for the table. Guests scan, browse a branded menu, add to cart, pay, track the kitchen, and join house rewards.

This is not an admin, owner, or analytics product.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## QR entry

A printed table QR should open:

```
/restaurant/abc-lounge?table=6
/restaurant/cafe-xyz?table=4
```

The home page is a scan simulator for demos.

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

Restaurant branding (logo, colors, type, menu) comes from `mock-data/restaurants.ts`. The same app renders any slug.

Replace service implementations later:

| Service | Future API |
| --- | --- |
| `restaurantService` | `GET /restaurants`, `GET /restaurants/:slug` |
| `menuService` | `GET /restaurants/:slug/menu` |
| `orderService` | `POST /orders`, `GET /orders/:id` |
| `loyaltyService` | `GET/POST /restaurants/:slug/loyalty` |
| `recommendationService` | `POST /restaurants/:slug/recommendations` (SpaceXAI server-side) |

Do not call a model from the browser. Recommendation UI is mock-only today.
