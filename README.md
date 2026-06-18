# Only For Seniors 📖

> Canada's friendly senior marketplace — a modern take on the classic Yellow Pages.

OnlyForSeniors.ca is a mobile-first web app + website for Canadian seniors (65+) to find trusted businesses and services, and for business owners to list themselves for **$10/month**.

## ✨ Highlights

- **Mobile-first + accessible** — large 48px+ touch targets, 18px base font, high contrast, screen-reader friendly, honors `prefers-reduced-motion`.
- **Interactive & modern** — Three.js floating hero, GSAP scroll reveals, smooth animations.
- **Retro Yellow Pages feel** — colour-coded category tabs, chunky black borders, paper texture.
- **Full marketplace** — 8 top-level categories, 30+ subcategories, business listings, search, reviews, messaging.
- **$10/month subscription** — Stripe-ready billing (with built-in demo mode if Stripe isn't configured).
- **Senior-first features** — big tap-to-call buttons, visible instructions near every control, accessible forms.

## 🎨 Design

| Element       | Choice |
|---------------|--------|
| Primary color | **Emerald Green** `#047857` |
| Secondary     | **Warm Cream** `#fdf8e8` (paper) |
| Accent        | **Burnt Orange** `#ea580c` (calls-to-action) |
| Display font  | **Bitter** — bold, high contrast serif |
| Body font     | **Atkinson Hyperlegible** — designed for low-vision readability |

## 🧱 Tech Stack

- **Next.js 15** (App Router, React 19)
- **TypeScript** strict mode
- **Tailwind CSS** with custom design tokens
- **Prisma** + **SQLite** (swap to Postgres for production)
- **GSAP** + ScrollTrigger for animations
- **Three.js** + React Three Fiber for 3D hero
- **Stripe** for $10/mo subscriptions (optional / falls back to demo mode)
- **bcryptjs** for password hashing, **Zod** for validation

## 📁 Project Structure

```
src/
  app/                  # Next.js App Router pages
    page.tsx            # Homepage (hero + categories)
    categories/         # Category index + [slug] page
    businesses/         # Business index + [slug] detail
    search/             # Search results
    list-business/      # Public signup flow
    business/login/     # Owner login
    dashboard/          # Owner dashboard (gated)
    api/                # API routes
      auth/             # login / logout
      businesses/       # CRUD
      inquiries/        # contact form submissions
      billing/          # checkout / cancel / resume
  components/
    animations/         # GSAP + Three.js components
    business/           # Inquiry form, signup form
    dashboard/          # Owner edit form, billing
    layout/             # Header, Footer
    ui/                 # Button, CategoryCard, BusinessCard
  lib/
    db.ts               # Prisma client
    auth.ts             # cookie-session helpers
    utils.ts            # cn(), slugify, etc.
prisma/
  schema.prisma         # 8 models (User, Business, Category, ...)
  seed.ts               # seeds the 8 categories
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# (edit .env - DATABASE_URL is the only required one for the demo)

# 3. Initialize the database
npm run db:push
npm run db:seed

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Optional: enable real Stripe billing

1. Sign up at [stripe.com](https://stripe.com)
2. Create a recurring **$10 CAD / monthly** product and copy the **Price ID**
3. Fill in your `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://onlyforseniors.ca
   ```
4. If `STRIPE_SECRET_KEY` is missing, the app uses a **demo mode** that
   activates the subscription immediately so you can still test the full flow.

## 🗂️ Categories (pre-seeded)

1. 🏠 **Daily In-Home Support & Personal Care**
2. 🛠️ **Home Maintenance & Safety Modifications**
3. 🩺 **Health & Wellness Management**
4. 🚗 **Mobility & Transportation**
5. 📝 **Legal, Financial & Government Benefits**
6. 🎨 **Community, Recreation & Caregiver Relief**
7. 🏢 **Alternative Housing & Residential Care**
8. 🛍️ **Products, Shopping & Delivery**

Add more in `prisma/seed.ts` — each takes a name, description, icon (emoji), and hex color.

## 🔌 API Endpoints

| Method | Route                       | Purpose |
|--------|------------------------------|---------|
| POST   | `/api/auth/login`            | Owner login |
| POST   | `/api/auth/logout`           | Owner logout |
| POST   | `/api/businesses`            | Sign up + create business |
| PATCH  | `/api/businesses/[id]`       | Update business |
| POST   | `/api/inquiries`             | Public contact form |
| POST   | `/api/billing/checkout`      | Start Stripe checkout |
| POST   | `/api/billing/cancel`        | Cancel at period end |
| POST   | `/api/billing/resume`        | Resume subscription |
| POST   | `/api/billing/simulate-activate` | Demo-mode activation |

## ♿ Accessibility (built in, not bolted on)

- 18px base font (configurable in `globals.css`)
- 48px+ touch targets (`.min-h-touch` utility)
- 4px focus rings (high contrast)
- Visible `.instruction` text under every button & form field
- `prefers-reduced-motion` respected everywhere
- Skip-to-content link
- Semantic HTML + ARIA
- Senior-helpful phone number as a huge tap-to-call button
- Helpful 404 page

## 📜 License

© 2026 Only For Seniors. All rights reserved.
