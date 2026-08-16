# Shagun — Digital Dining

Customer-only QR ordering for Shagun. Guests scan the table QR, browse the menu, add to cart, pay, track the kitchen, and join Shagun Rewards.

This is not an admin, owner, or analytics product.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
