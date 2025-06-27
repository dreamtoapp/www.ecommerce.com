# Cart & Checkout Refactor – Final Implementation Plan

> **Scope:** Transition to DB-First cart, add skeleton checkout (cash-on-delivery only), maintain Cache-First strategy (ISR + Server Actions, **no SWR**), clean legacy files, and prepare groundwork for future payment gateway.
>
> **Version:** 1.0  |  **Last updated:** 2025-06-25

---

## 0. Project Principles
1. **Single Source of Truth:** Database cart table; only `cartId` cookie stored client-side.
2. **Cache-First Rendering:** Pages use ISR (`revalidate` period) + Server Actions. No `useSWR` / client fetching.
3. **Gradual Enhancement:** Keep UX snappy via RSC fallback + optimistic UI (router.refresh()).
4. **Security & Rules Compliance:** Strict TypeScript, feature colors, BackButton, gap-based spacing.
5. **Future-Proof:** Schema placeholders for online payment integration (to be added later).

---

## 1. High-Level Roadmap
| Phase | Goal | Owner | ETA |
|-------|------|-------|-----|
| 0 | Branch + Baseline Audit | Dev | 0.5d |
| 1 | Code & DB Audit + Legacy Isolation | Dev | 0.5d |
| 2 | Prisma Index + Validation (cartId, productId) | Dev | 0.25d |
| 3 | Server Actions Hardening (Zod + revalidateTag) | Dev | 0.5d |
| 4 | Remove Zustand + Refactor Buttons | Dev | 1d |
| 5 | Checkout (Cash-On-Delivery) MVP | Dev | 1d |
| 6 | UI Polish (colors, CartBadge, loading.tsx) | Dev/Design | 0.5d |
| 7 | Tests (Jest + Playwright) | QA | 0.5d |
| 8 | Deploy & Monitor | DevOps | 0.25d |
| **Total** | **≈ 4 days** | | |

---

## 2. Detailed Tasks by Phase

### Phase 0 – Setup
```bash
git checkout -b feat/cart-db-first
```

### Phase 1 – Audit & Legacy Isolation
- **Search keys:** `useCartStore(`, `StoreAddToCartButton`, `bg-green-600`.
- Export findings to `audit/cart-audit-report.md`.
- Rename unused `.tsx` legacy files to `.txt`, record list in `audit/legacy-files.md`.

### Phase 2 – Prisma Enhancements
1. Add composite index to `CartItem`:
```prisma
@@index([cartId, productId])
```
2. Run migration: `npx prisma migrate dev -n cart-index`.

### Phase 3 – Server Action Hardening
- Import `zod` in `cartServerActions.ts`:
```ts
const qty = z.number().int().min(1).max(99).parse(quantity);
```
- Replace `revalidatePath('/cart')` → `revalidateTag('cart')` + tag-based fetch in `/cart` page.

### Phase 4 – Remove Zustand
1. Delete `store/cartStore.ts`.
2. Update `StoreAddToCartButton` to call `addItem` directly (or remove component if unused).
3. Replace all imports of `useCartStore`.

### Phase 5 – Checkout (Cash-On-Delivery)
- **Route:** `app/checkout/`
- **Server Action:** `createDraftOrder(cartId)`
  - Moves cart items → `Order` & `OrderItem` tables.
  - Marks order status `PENDING_PAYMENT` (even COD for consistency).
- **UI:** single-page server component with address form (client) + order summary card.
- **No payment gateway yet**; on submit sets status `CONFIRMED`.

### Phase 6 – UI Polish
- Convert `AddToCartButton` / `ServerAddToCartButton` to use `btn-add` + feature colors.
- Create `components/cart/CartBadge.tsx` (client) & `CartBadgeServer` (server).
- Add `loading.tsx` skeleton for `/cart` & `/checkout` routes.

### Phase 7 – Testing
- **Jest:** unit tests for `addItem`, `createDraftOrder`.
- **Playwright:** scenario — guest adds items → reload → items persist → completes COD checkout → order appears in Purchase History.

### Phase 8 – Deploy & Monitor
- Merge PR, run `next build` on staging.
- Monitor `/cart` & `/checkout` response times (TTFB < 500 ms).
- Review error logs & record KPI baseline.

---

## 3. Database Schema (Future-Ready)
```prisma
model Order {
  id            String      @id @default(cuid())
  userId        String?
  status        OrderStatus @default(PENDING_PAYMENT)
  total         Decimal     @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  items         OrderItem[]
  // For future payment gateway integration
  // paymentIntentId String?  @map("payment_intent_id")
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  price     Decimal
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])
}

enum OrderStatus {
  PENDING_PAYMENT
  CONFIRMED           // Cash-on-Delivery pre-approved
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELED
}
```

---

## 4. Risk Mitigation
- **Roll-back:** keep Zustand branch alive for 1 week; feature-flag new cart on production.
- **SEO / ISR:** ensure `/product/[slug]` still pre-renders; cart & checkout are dynamic so no SEO impact.
- **Offline Edge-cases:** documented for later Service Worker queue.

---

## 5. Deliverables
- Updated Prisma schema + migration.
- Refactored cart actions, buttons, header badge.
- Checkout route (COD) with address form & confirmation page.
- Audit & legacy reports.
- Automated tests passing.
- Updated docs: `cart-current-state-analysis.md` (state) + **this plan**.

---

_Approved by:_ ________  |  _Date:_ ____/____/2025 