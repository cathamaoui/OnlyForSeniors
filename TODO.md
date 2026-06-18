# Only For Seniors — TODO

> Living roadmap. Last updated 2026-06-18.
> Priority legend: **P0** (blocker), **P1** (next sprint), **P2** (later), **P3** (nice-to-have).

---

## ✅ Recently shipped (Phase 1 — MVP)

These are done and live on `onlyforseniors.ca`. They are kept here so future contributors can see what was already built.

- [x] **Marketing / sales**
  - [x] Kijiji-style home with image-forward cards
  - [x] Browse + 20+ categories, 100+ sub-categories
  - [x] Search (live client-side)
  - [x] News feed (`/categories/news/`) of latest listings
  - [x] For Businesses marketing page (`/for-businesses/`)
  - [x] Pricing / how-it-works / help / accessibility / terms / privacy / contact
  - [x] About page

- [x] **Brand & design system**
  - [x] All-yellow removed (defang rules in `globals.css`)
  - [x] Senior-friendly typography scale (rem-anchored, 18px base, 1.6–1.7 line-height)
  - [x] High-contrast text colours (stone-700+ on white)
  - [x] No uppercase or italic body text
  - [x] A−/A/A+ font resizer with dropdown (lucide `Type` icon, persists in `localStorage`)

- [x] **Business signup + billing**
  - [x] 4-step flow: Account → Profile → Checkout → Confirmation
  - [x] Account step with password show/hide + validation
  - [x] Profile step with address, category, service area, description
  - [x] Checkout with card, billing, terms checkbox
  - [x] **Provincial tax (GST/HST/PST/QST) for all 13 provinces/territories** (`src/lib/canadaTax.ts`)
  - [x] Confirmation with full invoice (printable) + invoice number

- [x] **Business dashboard (`/list-business/dashboard/`)**
  - [x] Welcome strip with business name + email
  - [x] Business profile card (read-only summary, "Edit" link)
  - [x] Subscription card (active badge, next charge date, next charge amount)
  - [x] Listing management (Pending review / Live / Not approved status badges + delete)
  - [x] Sign out (clears localStorage)

- [x] **Create listing (`/list-business/dashboard/new-listing/`)**
  - [x] Type toggle: Service / Event / Product
  - [x] Title, tagline (with live counter), description (with live counter)
  - [x] Category + sub-category from `businesses.json`
  - [x] **Province-first, then city** with combobox of 20+ popular cities per province (`src/lib/canadaCities.ts`)
  - [x] Service area
  - [x] Phone (required) + Contact phone (optional secondary)
  - [x] Email, website, price range
  - [x] **Cost + Per** (per hour / per day / per service / estimate)
  - [x] **Languages spoken** — 30-chip multi-select + "Other" dropdown with 30+ extra languages (`src/lib/languages.ts`)
  - [x] Image URL (with placeholder fallback)
  - [x] Tags (comma-separated)
  - [x] **Preview modal** before "Submit for review"
  - [x] Refund + clarify checkboxes
  - [x] Stored in `localStorage` as `UserListing[]` with id namespace `u-NNN`

- [x] **Login (`/list-business/login/`)**
  - [x] Mock auth (matches against `localStorage` signup data)
  - [x] Forgot-password link to support email

- [x] **Add-ons (offered at checkout)**
  - [x] 6 à-la-carte add-ons: Top bump / Senior discount badge / Media pack / **Event** Spotlight / **Sale** Spotlight / **Workshop/Class** Spotlight (`src/lib/addons.ts`)
  - [x] Date-required add-ons prompt for a start date (Bump / Event / Sale / Class); reminder email date is calculated and shown inline
  - [x] Add-on selection persisted to `localStorage` (as `AddonPurchase[]` with `startDate` / `endDate`) and shown on the invoice
  - [x] Backward-compat shim (`normaliseAddonList`) reads old `string[]` data and synthesises a "starts today" window
  - [x] Dashboard "Time-limited add-ons" card lists every date-bounded purchase with Live / N days left / Expired status and a one-tap Renew button (rolls the end date forward by one period)
  - [x] Renew action writes back to `localStorage` so the new window is reflected on the next page load
  - [x] **Bold** auto-renew notice inside the checkout add-on card (uses `RefreshCw` icon) so the buyer is never surprised by recurring charges. Phrased differently per add-on: weekly / monthly / per-event (event / sale / class)

- [x] **Header / nav**
  - [x] Businesses dropdown menu with: Sign in (top, highlighted) / Why list with us / Post a listing
  - [x] Footer with Sign in / Why list with us / Post a listing / Manage my listing

---

## 🚧 Phase 2 — Public Events Calendar  *(next sprint)*

The user is now offering the **Event Spotlight** add-on ($5 / event) at checkout. That promise requires a public calendar to point at.

- [ ] **P1 — Public Events Calendar page** (`/events/`)
  - [ ] Aggregate `UserListing` entries where `type === "event"`
  - [ ] Aggregate `UserListing` entries where the `event-spotlight` add-on is active (until per-event fields exist, surface as "Featured event")
  - [ ] Show: event name, business name, date, time, location, "Add to calendar" buttons (Google / iCal / Outlook)
  - [ ] Filter: by province, by city, by date range
  - [ ] Link from header nav (between Browse and Businesses) and from footer
  - [ ] SEO: `<title>Events for Canadian seniors — Only For Seniors</title>`, OG tags
  - [ ] Empty-state copy that encourages businesses to list an event

- [ ] **P1 — Event-specific fields in `UserListing`**
  - [ ] Add `startDate`, `endDate`, `startTime`, `endTime`, `venueName`, `venueAddress` to `UserListing`
  - [ ] Add `isRecurring`, `recurringPattern` (none / weekly / monthly)
  - [ ] Conditional form section in the new-listing form when `type === "event"`

- [ ] **P1 — "Event Spotlight" add-on logic**
  - [ ] When user buys any of the three event-type spotlights, auto-flag the listing for inclusion in a "Featured events" carousel at the top of the Events page
  - [ ] Refund logic: if the listing is rejected at review, refund the $5 (extend existing refund flow)
  - [ ] The "Event Spotlight" UI card in the dashboard now shows a **Re-list** button instead of a generic Renew, because the event already has a fixed date

- [ ] **P1 — Renewal reminder emails (depends on backend)**
  - [ ] Send a single email the day before the bump / event / class starts (uses the `endDate - 1` we already calculate)
  - [ ] Send a "Your X is expiring tomorrow" email the day before a weekly or monthly add-on ends
  - [ ] Body: "Hi {name}, your {add-on title} ends on {date}. Tap to renew in one click."
  - [ ] One-click renewal link → `/list-business/dashboard/?renew=<id>` which the dashboard already supports
  - [ ] Disable the email if the user has already renewed
  - [ ] Provider: Resend (or Postmark). NOT buildable until Phase 3 P1 (real backend) is in.

- [ ] **P2 — Events admin (back-office)**
  - [ ] `/list-business/dashboard/events/` — see all my events + spotlight status
  - [ ] Cancel / reschedule / re-list

---

## 📋 Phase 3 — Polish & scaling

- [ ] **P1 — Real backend**
  - [ ] Replace `localStorage` signup + listings with a real database (Supabase Postgres is already provisioned but unused)
  - [ ] Auth via NextAuth (email + password) or Supabase Auth
  - [ ] Stripe subscription for the $10/month + à-la-carte add-ons
  - [ ] Server-side session, so the "Sign in" works across devices

- [ ] **P1 — User-created listings show up in the public directory**
  - [ ] Merge `UserListing[]` with `businesses.json` in `getAllBusinesses()` so they appear on category pages
  - [ ] "Pending review" listings are hidden from public view; "Published" are shown
  - [ ] Reroute detail links to the existing `/businesses/[id]/` page

- [ ] **P1 — Admin moderation queue**
  - [ ] `/admin/listings/` — review pending listings, approve / reject with reason
  - [ ] Email the business owner on approval or rejection (with the refund promise)
  - [ ] Bulk-import static `businesses.json` into the new DB

- [ ] **P1 — Reviews & ratings**
  - [ ] Seniors leave a 1–5 star review + short text on a business page
  - [ ] Average + count shown on the card
  - [ ] Owner can reply to a review (one reply per review)

- [ ] **P2 — Search improvements**
  - [ ] Real search (Supabase full-text or Algolia) so listings can be filtered by city / language / price / rating
  - [ ] Synonym expansion (e.g. "physio" matches "physiotherapy")

- [ ] **P2 — Senior-friendly onboarding**
  - [ ] A first-time-visit overlay that explains the directory in 1 sentence + 1 button
  - [ ] Larger-font mode persisted across visits (already in via FontResizer)

- [ ] **P2 — Email notifications**
  - [ ] Welcome email after signup
  - [ ] Listing-approved / listing-rejected emails
  - [ ] Monthly "Your subscription is renewing" reminder
  - [ ] "You got a new review" emails to business owners

- [ ] **P2 — Accessibility audit (WCAG 2.2 AA)**
  - [ ] Run axe-core or Pa11y on every page
  - [ ] Keyboard-navigate the entire site end-to-end
  - [ ] Test with NVDA / VoiceOver
  - [ ] Add skip-to-content links to all inner pages (only the layout has one today)

- [ ] **P3 — Internationalisation (French-first)**
  - [ ] `next-intl` or similar; add `/fr/` routes for Quebec-first users
  - [ ] All copy translated, including dashboard labels

- [ ] **P3 — Image uploads**
  - [ ] Real photo upload instead of URL paste
  - [ ] S3 / Supabase Storage bucket
  - [ ] Client-side image cropping for the 4:3 card aspect ratio

- [ ] **P3 — Analytics**
  - [ ] Simple page-view + CTA-click tracking (Plausible or self-hosted Umami)
  - [ ] Per-listing view counts visible in the business dashboard

---

## 🐛 Known small issues / cleanup

- [ ] Some component files were damaged by an earlier bulk `replace` and are now on a single line (e.g. `BusinessCard.tsx`, `Footer.tsx`). They still build and work, but a `prettier --write src/` pass would clean them up. Track in a follow-up.
- [ ] The Header `Businesses` dropdown only renders the panel on click (not on hover). This is a deliberate accessibility choice but some users may not discover the items — consider a hover-open variant on desktop only.
- [ ] `getRecentBusinesses(24, 8)` always returns the most-recent N listings regardless of whether they were added in the last 24 hours, because the static data has no `dateAdded` field for most entries. Switch to true timestamp filtering once the DB is wired up.

---

## 🤝 How to use this list

- **Before starting work**, check the relevant section. If the item is checked, it's already done.
- **When picking something up**, edit the line to add your initial and a target date, e.g. `- [ ] **P1** — Events calendar [jdoe, wk-of-06-22]`.
- **When shipping**, change `[ ]` to `[x]` and link the PR.
- **New ideas** go in the "Future ideas" section at the bottom — don't pollute the prioritised lists.

---

## 💡 Future ideas (not yet prioritised)

- Waitlist for in-person events (limited seats, RSVP)
- Gift cards for senior services (similar to Airbnb gift cards)
- Family-account linking (an adult child manages an elder parent's saved listings)
- SMS-based business replies (Twilio integration)
- Voice-search via the browser's Web Speech API
- Print-friendly "directory book" for libraries and seniors' centres
- Affiliate / referral program for existing businesses

---

_Last touched by Copilot, 2026-06-18. Review monthly._
