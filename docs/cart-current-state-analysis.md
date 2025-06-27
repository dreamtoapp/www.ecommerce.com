# Cart System – Current State Analysis

_Last updated: 2025-06-25_

## 1. Data Flow Overview

### A. Guest (Unauthenticated)
1. **Add to Cart** → `StoreAddToCartButton` (Zustand + `localStorage`).
2. **/cart Page** → Server component `ServerCartView` calls `getCart()` which relies on a `localCartId` **cookie** (DB-backed). If no cookie exists, the server returns `null`.

> **Conflict** – Two separate storage mechanisms for guests (Zustand + DB). No automatic sync between them can cause items to "disappear" after a hard refresh.

### B. Authenticated User
1. **Add to Cart** → `AddToCartButton` / `ServerAddToCartButton` (Server Action `addItem` → Prisma).
2. **/cart Page** → `getCart()` merges any guest cart (cookie) into the user cart inside a transaction, then clears the cookie.

## 2. Relevant File Tree
```
app/(e-comm)/cart/
  ├─ actions/cartServerActions.ts  ← addItem / getCart / …
  ├─ components/
  │   ├─ ServerCartView.tsx       ← Server Component (page render)
  │   └─ CartItemControls.tsx     ← Client Component (update/remove)
  ├─ helpers/                     ← (empty)
  ├─ page.tsx
components/cart/
  ├─ AddToCartButton.tsx          ← Client  → Server Action
  ├─ ServerAddToCartButton.tsx    ← Client  → Server Action
  └─ StoreAddToCartButton.tsx     ← Client  → Zustand store
store/cartStore.ts                ← Zustand w/ persistence
app/api/cart/route.ts             ← REST wrapper around `getCart()`
```

## 3. Compliance Check vs. Project Rules
✅  Server Components + Actions correctly used in `/cart`.
✅  Card UI of `ServerCartView` follows enhanced card design.

⚠️  Issues / Deviations
1. `AddToCartButton` & `StoreAddToCartButton` use hard-coded classes (`bg-green-600`) → violates colour-system rules.
2. Missing `loading.tsx` in `app/(e-comm)/cart/` route.
3. No Skeleton/placeholder while fetching cart.
4. Dual data-source (Zustand vs DB) for guests.
5. Slow first response (~15 s) due to initial compile + multiple Prisma queries.
6. No cart badge in header; no live updates after add.
7. Lack of Zod validation inside server actions.
8. No automated tests.
9. Heavy use of `revalidatePath('/cart')` – could switch to tag-based revalidation.

## 4. Strengths
• Automatic guest-cart merge on login via transaction.
• Server Action architecture keeps client bundle light.
• Prisma transaction ensures data consistency.

## 5. Actionable Recommendations
1. **Unify Guest Storage**
   - Option A : keep Zustand & sync to DB on login.
   - Option B : drop Zustand; only use `cart` table + `localCartId` (preferred ‑ simpler).
2. Add `app/(e-comm)/cart/loading.tsx` with shadcn skeleton.
3. Replace hard-coded greens with `btn-add` / `text|bg-feature-commerce` classes.
4. Implement `CartBadge` in header using `getCartCount()` and `router.refresh()`.
5. Optimise Prisma select → fetch only `id`, `name`, `price` for products.
6. Add Zod validation for quantity in server actions.
7. Write Jest/Playwright tests covering add/update/remove & merge behaviour.
8. Add custom Error Boundary around cart actions.
9. Emit analytics events (`add_to_cart`, `remove_from_cart`).

---
This document will serve as a living reference during the cart system refactor. Update as improvements are delivered. 