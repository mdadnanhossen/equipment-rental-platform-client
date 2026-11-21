# Rentora — Project Audit Report

**Date:** 2026-11-21
**Frontend:** `E:\Projects\equipment-rental-platform-client` (Next.js 16.4.6, React 19, App Router, TS, Tailwind 4)
**Backend:** `E:\Projects\equipment-rental-platform-server` (Express 5, MongoDB driver, plain ESM JS)

Every requirement below was verified by reading the actual implementation (not filenames).
Statuses: **COMPLETE / PARTIAL / MISSING / NEEDS TESTING**.

---

## 0. Executive summary

| Area | Status |
|---|---|
| Home Page (sections, real data, footer) | COMPLETE (animation note §2) |
| Equipment Details (core info, price calc) | PARTIAL — no quantity/terms/favorites, booking form not a modal, missing booking fields |
| All Equipment (public, filters, sorts) | PARTIAL — missing location search, rentalType/availability filters, pagination UI, 3-col grid |
| Customer Dashboard (rentals table, favorites, profile) | PARTIAL — rentals are cards not a table; favorites stub; no profile route |
| Owner Dashboard (add/edit/rentals/profile/analytics) | PARTIAL — no quantity/rental terms fields, no profile, no analytics |
| Admin Dashboard (users/rentals/analytics, equipment update+delete) | PARTIAL — users has no role change; rentals page is a stub; no analytics; equipment has no update/delete |
| Stripe (checkout, webhook, idempotency, history ×3) | COMPLETE — but 2 payment pages hardcode `localhost:5000` |
| Loading / Error / Not-Found / env docs | MISSING / PARTIAL |
| Phase 3 optional (theme, cron, email) | Not implemented (optional, deferred) |

**Highest-risk defects found (pre-existing):**

1. **Weekly/Monthly listings produce `NaN` totals.** `equipment.routes.js` stores only the price field matching `rentalType` (`pricePerWeek`/`pricePerMonth`) and `$unset`s `pricePerDay`, while `rental.routes.js` and `payment.routes.js` compute `days × equipment.pricePerDay` → `NaN`, which Stripe then rejects. Frontend `AddEquipmentForm.tsx` feeds this by switching the input's `name` per rental type.
2. **No favorites backend at all** (`favorite` collection is warmed in `index.js` but no model/route exists).
3. **No analytics endpoints** for owner or admin; owner/admin dashboard pages are stubs (`owner/page.tsx`, `admin/page.tsx` render `owner` / `admin` text).
4. **Stub pages:** `customer/favorites` (`cu fa`), `admin/rentals` (`rental`).
5. **Broken navigation:** `src/lib/navigation.ts` `ROLE_NAV` points at 6 nonexistent paths (`/dashboard/rentals`, `/dashboard/favorites`, `/profile`, `/dashboard/equipment/new`, `/dashboard/equipment`, `/dashboard/equipment/rentals`, `/dashboard/users`); `PUBLIC_LINKS` points at `/how-it-works`, `/about`, `/contact` (404). Sidebar links to `/dashboard/{role}/profile` which does not exist.
6. **Hardcoded API origin** in `payment/success/success-client.tsx:37` and `payment/cancel/page.tsx:26` (`http://localhost:5000`) → breaks in production.
7. **No `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere.**
8. **`<Toaster/>` is never mounted** while `sign-in-form.tsx` / `sign-up-form.tsx` call `toast()` → toasts are invisible.
9. **Rental lifecycle dead-ends:** statuses `active` / `completed` are never written by any code path, so "completed rentals" can never occur.
10. **Backend has no 404 handler and no global error handler** (`index.js`), and the admin users endpoint is mounted at `/users` instead of `/api/users`.

---

## 1. Authentication & architecture (context for everything else)

| Item | Status | Evidence |
|---|---|---|
| Better Auth mounted on Next only | COMPLETE | `src/app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth)` |
| Backend session verification | COMPLETE | `middleware/auth.middleware.js` `verifyAuth` forwards cookies to `${BETTER_AUTH_URL}/api/auth/get-session` and sets `req.user` |
| Role guard | COMPLETE | `requireRole(...roles)` in same file; used by every protected router |
| Dashboard guard (reload-safe) | COMPLETE | `src/app/(dashboard)/layout.tsx` server-side `auth.api.getSession({headers})`, redirects to `/signin`, validates role |
| `config/auth.js` (backend) | DEAD CODE | uses `require` inside ESM; only lazily reached through a Proxy; real auth instance lives on Next. Harmless but confusing. |
| Role assignment at signup | MISSING | nobody assigns `owner`/`admin`; every new user is `customer`. No admin UI to change it (see §7) → **implemented in Phase 2** |
| Debug logging | SHOULD FIX | `auth.middleware.js` logs `AUTH USER` (id/email/role) on *every* request; `dashboard/layout.tsx` logs `Dashboard User` |

---

## 2. Home Page — **COMPLETE**

Files: `src/app/(root)/page.tsx`, `src/components/home/*` (11 components), `src/components/shared/Navbar.tsx` (reused, untouched).

| Requirement | Status | Notes |
|---|---|---|
| Navbar with dynamic navigation | COMPLETE | `DesktopNavigation` / `MobileNavigation` / `UserMenu` read `navForRole(session.role)` — but the underlying `ROLE_NAV` paths were wrong (fixed in Phase 2 §navigation) |
| Hero with image, title, description, 2 CTAs | COMPLETE | `hero.tsx` renders real approved listings from `GET /api/equipment?limit=3` |
| Featured = exactly 6 approved items | COMPLETE | `featured-equipment.tsx` calls `getAllEquipment({limit:6})`; backend `.limit()` applied (`equipment.routes.js` L244-253). DB currently holds 2 approved items, so 2 cards render — correct behaviour, no fabricated data |
| Categories (6 named) | COMPLETE | `categories.tsx` |
| Why Choose Us (4 points) | COMPLETE | `why-rentora.tsx` |
| ≥4 reviews | COMPLETE (demo) | `reviews.tsx` — 4 reviews clearly labelled *Sample content / Demo* because no review API exists (`review` collection warmed but unused) |
| ≥2 extra sections | COMPLETE | `how-it-works.tsx`, `owner-cta.tsx` |
| Footer | COMPLETE | `site-footer.tsx` — 4 columns, no contact/social because none exist in the project |
| Framer Motion animations | DEVIATION (documented) | **framer-motion is not installed** and the brief forbids unnecessary dependencies. Animations use IntersectionObserver + CSS transitions (`reveal.tsx`) with `motion-reduce:` and `<noscript>` fallbacks. Same visual result, zero new deps. |
| Responsive 320/768/1440, no overflow | COMPLETE | verified with headless Chrome: `scrollWidth == clientWidth` at all 3 widths; 0 console errors; 0 failed requests |

**Missing/incorrect:** nothing mandatory. Optional: reviews are demo content until a review API exists.

---

## 3. Equipment Details Page — **PARTIAL**

Files: `src/app/(root)/equipment/[id]/page.tsx`, `src/components/equipment/RentalRequestForm.tsx`, backend `routes/equipment.routes.js`, `routes/rental.routes.js`.

| Requirement | Status | Evidence / what is missing |
|---|---|---|
| Name, description, category, price, location, condition, images | COMPLETE | detail page L129-212 |
| Rental type displayed | MISSING | page never reads `equipment.rentalType` (backend returns it) |
| Quantity displayed | MISSING | field does not exist in model, route, or UI |
| Rental terms & conditions | MISSING | no `rentalTerms` field anywhere |
| Owner information | PARTIAL | only `ownerName` shown (no contact/profile link) |
| Add/remove favorites (MongoDB) | **MISSING** | no favorites route/model; no button on the page; `customer/favorites` is a `cu fa` stub |
| Booking modal: start/end date | PARTIAL | exists, but as an inline card, **not a modal** |
| Booking modal: required quantity | **MISSING** | — |
| Booking modal: contact number | **MISSING** | — |
| Booking modal: delivery address | **MISSING** | — |
| Booking modal: additional notes | **MISSING** | — |
| Duration + total calculation | COMPLETE | `RentalRequestForm.tsx` L29-40 (days × pricePerDay + deposit) |
| Availability validation | PARTIAL | checks `availability === "available"` only; no quantity/stock check; backend rejects non-approved/unavailable (L296-307) |
| Authentication behaviour | PARTIAL | backend `router.use(verifyAuth, requireRole("customer"))` → anonymous/owner gets 401/403 shown as raw message; no redirect to `/signin` |
| Rental terms accepted at booking | MISSING | — |

**Recommended implementation (Phase 2):** add `quantity` + `rentalTerms` to the equipment model/routes/forms; extend `POST /api/rentals` with `quantity`, `contactNumber`, `deliveryAddress`, `notes` and a quantity-aware overlap check; convert `RentalRequestForm` into a Dialog-based booking modal; add a favorites API + heart button.

---

## 4. All Equipment Page — **PARTIAL**

Files: `src/app/(root)/equipment/page.tsx`, `src/lib/api/equipment.ts`, backend `routes/equipment.routes.js` L141-275.

| Requirement | Status | Evidence / gap |
|---|---|---|
| Public route | COMPLETE | no auth on `GET /api/equipment` |
| 3-column desktop grid | PARTIAL | `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` → 4 columns at ≥1280px; spec says 3 |
| Card: image, name, category, price, location | COMPLETE | page L148-187 |
| Card: rental type | MISSING | not rendered (API already returns `rentalType`) |
| Card: availability | MISSING | not rendered |
| Card: "View Details" affordance | PARTIAL | whole card is a link, but no visible *View Details* label |
| Search by name **and location** | PARTIAL | backend `$or` covers title/description/category/brand/model — **no `location.city`/`location.address`** |
| Category filter | COMPLETE | exact-match regex, case-insensitive |
| Rental type filter | **MISSING** | no `rentalType` query param accepted or sent |
| Price range filter | COMPLETE | `minPrice`/`maxPrice` with validation (L186-225) |
| Availability filter | **MISSING** | — |
| 3 sorts (price asc/desc, newest) | COMPLETE | `sortOptions` L227-240 |
| Backend-side filtering/sorting | COMPLETE | all done in MongoDB query |
| Pagination | PARTIAL | backend returns `page`/`totalPages`; frontend always requests `page:1,limit:12` and renders no pager |

---

## 5. Customer Dashboard — **PARTIAL**

| Requirement | Status | Evidence / gap |
|---|---|---|
| **My Rentals** as a table with 7 columns | PARTIAL | `customer/rentals/page.tsx` renders **cards**, not a table. Present: equipment name, start, end, total, payment status, booking status. **Missing: Booking Date** (`createdAt` is returned but not displayed) |
| Pay now / cancel / edit actions | COMPLETE | Stripe checkout redirect, `PATCH /api/rentals/:id/cancel`, `PATCH /api/rentals/:id` |
| **Favorites** list, View Details, Remove, MongoDB persistence | **MISSING** | `customer/favorites/page.tsx` renders `cu fa`; no backend |
| **My Profile** (name, email, image, phone, address, edit/save) | **MISSING** | no `/dashboard/{role}/profile` route exists although the sidebar links to it; backend has no profile endpoint |

---

## 6. Owner Dashboard — **PARTIAL**

| Requirement | Status | Evidence / gap |
|---|---|---|
| **Add Equipment** — name, description, category, location, price, rental type, condition, brand, model, images, default `pending` | COMPLETE | `AddEquipmentForm.tsx`; backend sets `status:"pending"` (L107) |
| Add Equipment — **available quantity** | **MISSING** | no field |
| Add Equipment — **rental terms & conditions** | **MISSING** | no field |
| Add Equipment — single price field | PARTIAL | one input at a time, **but its `name` switches** between `pricePerDay`/`pricePerWeek`/`pricePerMonth` (`getPriceField()`) → weekly/monthly listings lose `pricePerDay` → `NaN` totals (defect §0.1) |
| Image upload (spec says imgbb) | DEVIATION (justified) | project already uses **Cloudinary** end-to-end (`config/cloudinary.js`, `middleware/upload.middleware.js`) and it works. Swapping providers would break working functionality; documented instead |
| **My Equipment** — name, category, price, quantity, status, update, delete, view details | PARTIAL | `owner/equipment/page.tsx` has Edit + Delete. **Missing: quantity column and View Details link** |
| **My Equipment Rentals** — customer info, equipment info, duration, quantity, amount, payment status, booking status, approve/reject | PARTIAL | `owner/rentals/page.tsx` has everything **except required quantity**; approve/reject endpoints exist (`owner-rental.routes.js`) |
| **My Profile** | **MISSING** | — |
| **Owner Analytics** (total listed, completed rentals, total earnings, monthly earnings, owner-scoped) | **MISSING** | no endpoint, `owner/page.tsx` renders the text `owner` |

---

## 7. Admin Dashboard — **PARTIAL**

| Requirement | Status | Evidence / gap |
|---|---|---|
| **All Users** — name, email, role, registration date | PARTIAL | `admin/users/page.tsx` shows name/email/role/"Registered"; **no registration date** (backend projection omits `createdAt`) |
| **All Users** — change role / manage users | **MISSING** | no role-change endpoint or UI; users can never become owner/admin |
| **All Equipment** — approve/reject | COMPLETE | `admin-equipment.routes.js` + UI buttons with rejection reason |
| **All Equipment** — update | **MISSING** | no `PATCH` in the admin router (owner-only `PATCH /api/equipment/:id` exists) and no UI |
| **All Equipment** — delete | **MISSING** | no admin `DELETE` (owner-only) and no UI |
| **All Equipment** — status filters | COMPLETE | pending/approved/rejected cards + client search; pagination not wired (backend supports it) |
| **All Rentals** — monitoring | **MISSING** | `admin/rentals/page.tsx` renders `rental`; no admin rentals endpoint |
| **Admin Analytics** (users, equipment, bookings, pending approvals, completed rentals, revenue, monthly bookings) | **MISSING** | no endpoint; `admin/page.tsx` renders `admin` |

---

## 8. Stripe Payment — **COMPLETE** (with one deployment defect)

Files: `routes/payment.routes.js`, `routes/stripe-webhook.routes.js`, `src/app/(root)/payment/*`, `dashboard/*/payment-history`.

| Requirement | Status | Evidence |
|---|---|---|
| Secure Stripe Checkout | COMPLETE | `POST /api/payments/create-checkout-session` (L295-583) |
| Approved + eligible rental validation | COMPLETE | status must be `approved`, `paymentStatus === "unpaid"`, equipment re-verified approved+available, dates validated (L327-385) |
| Customer ownership validation | COMPLETE | `customerId: req.user.id` in the lookup (L315-318) |
| Amount calculated server-side | COMPLETE | `rentalDays × rental.pricePerDay`, integer + Stripe amount checks (L387-428) |
| Success/cancel handling | COMPLETE | `success_url`/`cancel_url` from `CLIENT_URL`; `/payment/success` polls `session-status`; `/payment/cancel` allows retry |
| Webhook signature verification | COMPLETE | raw body mounted **before** `express.json()` (`index.js` L35-42) + `stripe.webhooks.constructEvent` |
| Webhook updates rental payment status | COMPLETE | `stripe-webhook.routes.js` L100-115 (`unpaid → paid`, `paidAt`) |
| Transaction saved to `payment` collection | COMPLETE | upsert keyed by `stripeSessionId` (unique index created at boot, `index.js` L126-129) |
| Duplicate webhook/event handling | COMPLETE | `$setOnInsert` on session id + `paymentStatus:"unpaid"` guard; checkout idempotency key `rentora_checkout_{rentalId}_{version}` |
| Payment history ×3 (customer/owner/admin) | COMPLETE | `GET /history`, `/owner/history`, `/admin/history` |
| Payment ↔ rental relationship | COMPLETE | `formatPaymentRecords` joins on `rentalId` |
| Correct API URLs in production | **PARTIAL** | `success-client.tsx:37` and `cancel/page.tsx:26` hardcode `http://localhost:5000` → **fixed in Phase 2** |

**Known limitation (documented, not changed):** `STRIPE_CURRENCY` defaults to `bdt`; `CLIENT_URL`/`STRIPE_CURRENCY`/`PORT` are absent from `.env` (defaults apply).

---

## 9. Loading, Error & Deployment Reliability — **PARTIAL / MISSING**

| Requirement | Status | Evidence |
|---|---|---|
| Loading UI for data-fetching pages | MISSING | no `loading.tsx` anywhere; pages render plain "Loading ..." text |
| Error UI + retry | PARTIAL | inline error strings exist (featured section has retry); no route-level `error.tsx` |
| Not-found handling | MISSING | no `not-found.tsx`; unknown URLs fall through to Next's default |
| Private route reload | COMPLETE | server-side session check in `(dashboard)/layout.tsx` |
| Session persistence after reload | COMPLETE | Better Auth cookie + `useSession` |
| Production API URLs | PARTIAL | `NEXT_PUBLIC_API_URL` respected everywhere **except** the 2 payment pages above |
| No hardcoded secrets | COMPLETE | `.env` gitignored; no secret values in source (only `Boolean(...)` logging of webhook secret presence) |
| CORS | PARTIAL | single origin `CLIENT_URL || http://localhost:3000`, `credentials:true` — correct for one deployment, but `CLIENT_URL` is unset in `.env` (defaults to localhost:3000) |
| No incorrect route paths | **MISSING** | `navigation.ts` ROLE_NAV/PUBLIC_LINKS broken (§0.5); sidebar `/dashboard/{role}/profile` 404s |
| No broken API integration | PARTIAL | `admin/users` calls `/users` (works, but non-REST path); everything else matches |
| No runtime/TS errors | PARTIAL | `npx tsc --noEmit`: 2 errors in `admin/payments/page.tsx` (in-flight user edit: `PaymentStatusFilter` not imported) — pre-existing, unrelated to this audit's changes |
| Env vars documented in README | MISSING | client `README.md` is the create-next-app default; backend has **no README and no `.env.example`** |
| Backend 404 + global error handler | MISSING | `index.js` has neither |

---

## 10. Code health / duplicate implementations

| Issue | Location | Action |
|---|---|---|
| Duplicate `Equipment`/`EquipmentQuery`/`EquipmentResponse` types | `src/types/index.ts` vs `src/types/equipment.ts` | keep both for now (sidebar types live in `index.ts`); not runtime-breaking. Consolidation optional |
| Unused sample payment data | `src/components/dashboard/payments/sample-data.ts` | left in place (user-owned payment work) |
| `config/auth.js` dead code | backend | left in place (loaded harmlessly); documented |
| Debug `console.log` per request | `auth.middleware.js`, `(dashboard)/layout.tsx` | removed in Phase 2 |
| `sonner` toasts never visible | root `layout.tsx` | `<Toaster/>` mounted in Phase 2 |
| Race on simultaneous double-booking | `rental.routes.js` L316-329 | pre-existing; mitigated (not eliminated) by quantity-aware check added in Phase 2; no DB transaction available on Atlas free tier |

---

## 11. Phase 2 implementation plan (executed in this pass)

**Backend**
1. `models/equipment.model.js` — single required `pricePerDay`, optional `quantity` (int ≥1) and `rentalTerms`.
2. `routes/equipment.routes.js` — always persist `pricePerDay` (+ `quantity`, `rentalTerms`); drop `pricePerWeek/Month` writes and `$unset` them; add `location`, `rentalType`, `availability` filters; include location in search; keep price fallback for legacy docs.
3. `routes/rental.routes.js` — accept `quantity`, `contactNumber`, `deliveryAddress`, `notes`; quantity-aware overlap validation; price fallback.
4. **New** `routes/favorite.routes.js` (`GET/POST/DELETE /api/favorites`).
5. **New** `routes/profile.routes.js` (`GET/PATCH /api/profile` — name, phone, address, image; never role/email).
6. **New** `routes/user.routes.js` mounted at `/api/users` **and** legacy `/users` (`GET /`, `PATCH /:id/role` with self-change protection).
7. **New** `routes/admin.routes.js` (`GET /api/admin/analytics`, `GET /api/admin/rentals`, `PATCH /api/admin/rentals/:id/status`, plus admin `PATCH`/`DELETE` on `/api/admin/equipment`).
8. **New** `routes/owner.routes.js` (`GET /api/owner/analytics`, owner-scoped, paid payments only, deduplicated by payment `_id`).
9. `routes/owner-rental.routes.js` — add `PATCH /:id/start` (`approved→active`) and `PATCH /:id/complete` (`active→completed`) so the lifecycle can actually reach `completed`.
10. `index.js` — mount everything, JSON 404 + global error handler; remove per-request debug log.

**Frontend**
11. `navigation.ts` — correct `ROLE_NAV`, real `PUBLIC_LINKS`, `SETTINGS_HREF = null`.
12. Booking **modal** (Dialog) with start/end/quantity/contact/delivery/notes + duration/total/availability checks; details page shows rental type, quantity, terms, owner, favorites heart.
13. Favorites page (real API) + detail-page toggle.
14. `/equipment` — 3-col grid, location + rentalType + availability filters, rental type/availability/"View Details" on cards, pagination.
15. My Rentals → table with the 7 required columns (adds Booking Date).
16. Add/Edit equipment forms → `quantity` + `rentalTerms`, single `pricePerDay` input with rental type dropdown.
17. My Equipment → quantity + View Details; Owner rentals → quantity + start/complete actions.
18. Owner + Admin analytics dashboards (dynamic, role-scoped).
19. Admin rentals page (table + status management); admin users (registration date + role change, `/api/users`); admin equipment (update + delete).
20. Profile pages for all 3 roles (shared component).
21. `loading.tsx` / `error.tsx` / `not-found.tsx` (+ per-route loading), `<Toaster/>`, fix hardcoded payment URLs, READMEs documenting env var **names**.

**Deferred (Phase 3 optional, not started):** dark/light theme toggle, `node-cron` booking automation, email notifications. Pagination (mandatory-adjacent) is included in step 14.
