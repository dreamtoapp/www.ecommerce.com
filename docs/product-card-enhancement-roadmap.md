# Product Card UX Enhancement Roadmap  *(Master Document)*

> **Status Legend**  
> ✅ Completed & merged  • 🔄 In-progress  • ⏳ Planned/Backlog

Benchmark references: Amazon, Shopify, Apple Store, Zalando, IKEA

---
## 1. Information Hierarchy
- Image → Name → Price → Primary CTA
- Secondary info (rating, variants, delivery) as overlays or below main section.
- Lock card aspect-ratio to **4:5** to avoid layout shift.

## 2. Imagery & Media
- Serve high-resolution `webp/avif` via `<Image>` with blurred placeholder.
- Desktop hover ⇒ swap to secondary image / 360° GIF.
- Mobile ⇒ horizontal swipe gallery inside card.

## 3. Interactive States
- Hover: `scale(1.03)` + shadow + border glow.
- Focus: WCAG-compliant ring (`focus-visible:outline-ring`).
- Active: subtle press animation.

## 4. CTAs & Quick Actions
- **Primary:** `Add to Cart` (`btn-add`) – always visible on mobile, appears on hover desktop.
- **Secondary:** Wishlist ❤️, Compare ↔️, Quick-view 👁 overlay icons.
- Optimistic cart update → toast "تمت الإضافة ✓".

## 5. Price Presentation
- Current price bold (text-foreground).
- Discount: strike-through original + % badge (`border-feature-commerce`).
- Support tier / subscription pricing.

## 6. Trust & Urgency Signals
- Star rating ⭐ + count.
- Low stock badge "متبقي 3" (orange) when `stockQuantity ≤ 3`.
- Free delivery / delivery-date label when eligible.

## 7. Variant Awareness
- Color swatches inline; size selector in quick-view.
- Variant choice reflected in URL params.

## 8. Out-of-Stock Handling
- Darken image, overlay `غير متوفر` ribbon.
- Disable primary CTA, change text to "نفد المخزون".
- Restock-notification option.

## 9. Personalization Hooks
- Badges: "اشترى مسبقاً" / "Best for you".
- "وفرت 12 ر.س آخر مرة" price memory.

## 10. Performance & Accessibility
- Use `<Image>` `priority` on first fold, responsive `sizes`.
- Skeleton loader to eliminate CLS.
- ARIA labels on all icons; maintain ≥ 4.5:1 contrast.

## 11. Analytics & Experimentation
- `data-analytics="add-to-cart"` attributes.
- Track hover-to-add-cart conversion, image-swap engagement.

---

### Implementation Phases

| Phase | Status | Scope |
|-------|--------|-------|
| **1** | ✅ Completed (Sprint 2025-06-26) | Create new folder structure & split card into **Media**, **Badges**, **Actions** sub-components. Enforce enhanced card wrapper. |
| **2** | 🔄 In-progress | Implement Media layer (`Image` optimisation) & Badges (rating, sale, stock). |
| **3** | ⏳ Planned | Build Actions component: Add-to-Cart, qty controls, wishlist, quick-view. |
| **4** | ⏳ Planned | Stock logic: Out-of-Stock overlay, Low-Stock badge, CTA disable. |
| **5** | ⏳ Planned | Skeleton loader + responsive grid adjustments. |
| **6** | ⏳ Planned | Analytics hooks & A/B testing scaffolding. |

Each phase will be delivered as a separate PR for easier review. 