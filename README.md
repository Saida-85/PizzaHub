# 🍕 PizzaHub: Pizza Ordering & Delivery Platform (Client)

PizzaHub is a role-based pizza ordering and delivery platform. Customers discover local pizza shops, browse menus and place orders. Restaurants (vendors) publish menu items and manage incoming orders, and can upgrade to a Premium plan through Stripe. Admins review menu items, manage users and monitor transactions.

This repository is the **Next.js client**. The Express API lives in the [server repository](https://github.com/Saida-85/pizzahub-server).

## 🔗 Links

|                   |                                             |
| ----------------- | ------------------------------------------- |
| Live website      | https://pizza-hub-swart-nine.vercel.app     |
| Live API          | https://pizzahub-server-p6cs.onrender.com   |
| Client repository | https://github.com/Saida-85/PizzaHub        |
| Server repository | https://github.com/Saida-85/pizzahub-server |

### Test access

|                  |                                                            |
| ---------------- | ---------------------------------------------------------- |
| Admin email      | `ADD_ADMIN_EMAIL_HERE`                                     |
| Admin password   | `ADD_ADMIN_PASSWORD_HERE`                                  |
| Stripe test card | `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP |

## ✨ Key Features

**Everyone**

- Home page with banner, featured items from the database, pizza categories, "Why Choose PizzaHub?" and "How PizzaHub Works" sections, with Framer Motion animations
- Public Browse Menu with search by name, filter by category and location, and sorting by price (low to high, high to low)
- Loading skeletons, empty states, custom 404 page and error pages, toast notifications

**Authentication**

- Email/password and Google sign-in with Better Auth
- Sign up as Customer or Vendor (password: 6+ characters, one uppercase, one lowercase); optional profile image
- Admin accounts can't be created from the sign-up form (admin role is assigned with a server script)
- Role-based redirects after login; dashboards are protected on the server for every role

**Customer**

- Item details with image gallery and order form (delivery date, address, instructions)
- My Orders with status tracking, order status timeline and cancel for pending orders
- Favorites (save and remove items)
- Overview with order stats and chart, profile settings

**Vendor**

- Overview stats and charts, add / edit / delete menu items with ImgBB image upload
- Customer orders: accept or reject pending orders
- Free plan (max 3 active items) and Premium plan (unlimited items, Premium badge, featured placement) paid with Stripe Checkout
- Profile settings

**Admin**

- Overview stats and charts
- Manage users: search, filter by role, block / unblock
- Manage menu items: approve, reject, change status, delete
- Read-only transactions list

## 🛠 Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling / UI:** Tailwind CSS 4, shadcn/ui, Radix UI (`radix-ui`), `class-variance-authority`, `lucide-react`, `tw-animate-css`
- **Animation:** `framer-motion`
- **Notifications:** `sonner`
- **Auth:** `better-auth`, `@better-auth/mongo-adapter`, `mongodb` (Google OAuth, JWT plugin)
- **Server (separate repo):** Express, MongoDB, Stripe, ImgBB

## 🔐 Environment Variables

Create a `.env` file in the project root (see `.env.example`). **Never commit `.env`.**

| Variable                      | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `MONGODB_URI`                 | MongoDB connection string (same database as the server) |
| `DB_NAME`                     | Database name (default `pizzahubdb`)                    |
| `BETTER_AUTH_SECRET`          | Long random secret used by Better Auth                  |
| `BETTER_AUTH_URL`             | Public URL of this client (server side)                 |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public URL of this client (browser side)                |
| `GOOGLE_CLIENT_ID`            | Google OAuth client ID                                  |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth client secret                              |
| `NEXT_PUBLIC_API_URL`         | URL of the Express API                                  |

## 📦 Installation & Run Locally

```bash
# 1. Clone
git clone https://github.com/Saida-85/PizzaHub.git
cd PizzaHub

# 2. Install packages
npm install

# 3. Add environment variables
cp .env.example .env
# then fill in the values

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000. Start the [server](https://github.com/Saida-85/pizzahub-server) as well (`npm run dev`, port 5000) so menu items, orders and payments work.

Google sign-in needs `http://localhost:3000/api/auth/callback/google` (and your live URL's `/api/auth/callback/google`) added as an authorized redirect URI in the Google Cloud console.

### Build for production

```bash
npm run build
npm start
```

## 🧩 Challenge Requirements: How They Were Built

### 1. Advanced search and sorting

The Browse Menu page keeps all filters in the URL, so results can be shared and survive a reload:

```
GET /api/menu-items?search=<text>&category=<category>&location=<text>&sort=<price_asc|price_desc>
```

Flow:

1. `MenuBrowser` (client) updates `search`, `category`, `location` and `sort` in the URL with a short debounce.
2. `app/menu/page.tsx` (server component) reads the URL params and calls the API with the same query string.
3. The API only returns items with status `approved`. `search` is a case-insensitive match on the item name (user text is escaped, so it is never treated as a regular expression), `category` must be one of the six allowed categories, `location` is a case-insensitive match, and `sort` sorts by price ascending or descending.

### 2. JWT / token verification

1. Better Auth's `jwt()` plugin issues a short-lived JWT for the signed-in user (`authClient.token()` in the browser, `auth.api.getToken()` in server components).
2. `lib/api.ts` sends it as `Authorization: Bearer <token>` to the Express API.
3. On the server, the `verifyJWT` middleware verifies the signature against this client's JWKS (`/api/auth/jwks`) and checks that the token is not expired, loads the user from MongoDB (the role is never read from the request body), and rejects blocked accounts.
4. `requireRole("vendor" | "customer" | "admin")` then checks the role from the database.
5. Missing, invalid or expired tokens get **401**; blocked accounts and wrong roles get **403**. Ownership of items and orders is checked again before every update or delete.

See the server README for the full middleware flow.

## 📁 Project Structure

```
src/
  app/
    page.tsx                 Home
    menu/                    Browse Menu and /menu/[id] details
    signin/ signup/          Authentication
    payment/success|cancel/  Stripe return pages
    dashboard/
      (customer)             overview, orders, favorites, profile
      vendor/                overview, items, add-item, orders, subscription, profile
      admin/                 overview, users, items, transactions
  components/                Reusable UI (cards, forms, charts, sidebar)
  lib/                       Auth, API helpers, adapters, styles
```

## 🚀 Deployment

- **Client:** Vercel. Add every variable from the table above in the project settings.
- **Server:** Render. See the server README.
- In Google Cloud console, add the live callback URL: `https://pizza-hub-swart-nine.vercel.app/api/auth/callback/google`.

## 📄 License

Built for the PizzaHub assessment project.
