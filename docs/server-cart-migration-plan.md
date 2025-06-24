# Server-Side Cart Migration: Action Plan

This document outlines the phased, step-by-step process for migrating the e-commerce cart from a client-side Zustand state to a robust server-side, database-driven system.

**Guiding Principles:**
1.  **Safety First:** No existing, working code will be modified or deleted without explicit confirmation at each major step.
2.  **Parallel Implementation:** New server-side functionality will be built alongside the existing client-side system, allowing for testing and validation before a final switch.
3.  **Clarity & Transparency:** Every file to be created or edited is documented here.

## Cart Touchpoints & File Checklist (Deep Code Audit)

**This section lists all files and components that interact with the cart and will need to be updated, replaced, or reviewed during the migration.**

### 1. Zustand Store & Provider
- store/cartStore.ts
- providers/cart-provider.tsx
- hooks/useCart.ts

### 2. Cart Usage in Components & Pages
- components/ecomm/Header/CartIcon.tsx
- components/ecomm/Header/CartPreview.tsx
- components/ecomm/Header/UserMenu.tsx
- components/ecomm/Header/MobileHeader.tsx
- components/ecomm/Header/Header.tsx
- components/ecomm/Header/HeaderClient.tsx
- app/(e-comm)/cart/page.tsx
- app/(e-comm)/cart/component/CartSummary.tsx
- app/(e-comm)/cart/component/CartItem.tsx
- components/cart/AddToCartButton.tsx
- components/cart/StoreAddToCartButton.tsx
- components/product/ProductCard.tsx
- components/product/EnhancedProductCard.tsx
- app/(e-comm)/homepage/component/product/ProductList.tsx
- app/(e-comm)/homepage/component/product/ProductListWithScroll.tsx
- app/(e-comm)/homepage/component/product/ProductCard.tsx
- app/(e-comm)/product/[slug]/ProductQuantity.tsx
- app/(e-comm)/categories/components/EnhancedProductCardAdapter.tsx
- app/(e-comm)/categories/components/ProductCardAdapter.tsx
- app/(e-comm)/checkout/page.tsx
- app/(e-comm)/checkout/components/MiniCartSummary.tsx
- app/(e-comm)/happyorder/page.tsx
- app/(e-comm)/user/purchase-history/ (cart clearing after order)
- app/(e-comm)/user/statement/ (order summary, may reference cart)
- app/(e-comm)/user/wishlist/ (wishlist-to-cart)
- components/wishlist/WishlistButton.tsx (if supports "add to cart")

### 3. Cart Actions & Helpers
- app/(e-comm)/cart/action/cart.ts
- app/(e-comm)/cart/action/cartActions.ts
- app/(e-comm)/cart/helpers/ (all cart-related helpers)

### 4. Cart Function/Handler Usages
- All usages of addToCart, removeFromCart, updateCart, updateCartItemQuantity in the above files

### 5. New Server-Side Cart Implementation
- app/(e-comm)/cart/actions/cartServerActions.ts (new)
- app/(e-comm)/cart/helpers/cartCookie.ts (new)

**This checklist will be used to ensure no cart-related logic is missed during the migration. Each file/component will be reviewed and updated as needed in the appropriate migration phase.**

---

## **Phase 1: Backend Foundation (No Frontend Changes)**

*Goal: Build the database schema and server logic. The live site remains untouched.*

### **Step 1.1: Enhance Database Schema**
*   **File to be Edited:** `prisma/schema.prisma`
*   **Action:** Add new `Cart` and `CartItem` models.
*   **Details:**
    *   A `Cart` will be created to hold cart items. It will have an optional relation to a `User` to support both guest and authenticated user carts.
    *   A `CartItem` will be created to store the `productId`, quantity, and a relation to a `Cart`.
    *   No existing models will be altered.

### **Step 1.2: Create Core Cart Server Actions**
*   **File to be Created:** `app/(e-comm)/cart/actions/cartServerActions.ts`
*   **Action:** Create a new file for all server-side cart logic.
*   **Functions to be Implemented:**
    *   `getCart()`: Fetches the current user's or guest's cart from the database.
    *   `createCart()`: Creates a new cart in the database.
    *   `addItem(productId: string, quantity: number)`: Adds an item to the cart or updates its quantity.
    *   `updateItemQuantity(itemId: string, quantity: number)`: Updates the quantity of a specific item in the cart.
    *   `removeItem(itemId: string)`: Removes an item from the cart.
    *   `mergeGuestCartOnLogin(guestCartId: string, userId: string)`: Merges items from a guest cart into a user's cart upon login.
*   **Note:** This file will be entirely new and will not affect any existing cart logic.

### **Step 1.3: Create Guest Cart Cookie Helper**
*   **File to be Created:** `app/(e-comm)/cart/helpers/cartCookie.ts`
*   **Action:** Create a new helper file to manage the guest cart identifier stored in browser cookies.
*   **Functions to be Implemented:**
    *   `getCartIdFromCookie()`: Safely reads the cart ID from the `next/headers` cookies.
    *   `setCartIdCookie(cartId: string)`: Sets the cart ID in a secure, http-only cookie.
*   **Note:** This is a new, self-contained utility.

---

## **Phase 2: Gradual Frontend Integration (Parallel Implementation)**

*Goal: Build new, server-powered UI components and migrate the main cart page to use the new system.*

### **Step 2.1: Create a New "Add to Cart" Button**
*   **File Created:** `components/cart/ServerAddToCartButton.tsx`
*   **Status:** ✅ Done
*   **Details:**
    *   Client component, calls `addItem` server action, uses `useTransition` for loading state, follows design system.

### **Step 2.2: Create a New Server-Powered Cart View**
*   **File Created:** `app/(e-comm)/cart/components/ServerCartView.tsx`
*   **Status:** ✅ Done
*   **Details:**
    *   Server component, fetches cart data using `getCart`, displays items, quantities, and totals, uses design system.

### **Step 2.3: Update Main Cart Page to Use ServerCartView**
*   **File Updated:** `app/(e-comm)/cart/page.tsx`
*   **Status:** ✅ Done
*   **Details:**
    *   Zustand/cartStore logic removed. Now renders `<ServerCartView />` and `<BackButton />` only.
    *   This is now the live, testable server-side cart page.

### **Step 2.4: Create Guest Cart Cookie Helper**
*   **File Created:** `app/(e-comm)/cart/helpers/cartCookie.ts`
*   **Status:** ✅ Done
*   **Details:**
    *   Async helpers for reading, setting, and clearing the guest cart cookie using `await cookies()`.

---

## **Phase 3: Switchover & Cleanup (Final Integration)**

*Goal: Update all cart-related components/pages to use the new server-side cart logic and remove all Zustand/client cart code.*

### **Step 3.1: Update All Cart-Related Components/Pages**
*   **Files to Update:** See Cart Touchpoints & File Checklist above
*   **Action:**
    *   Refactor all cart-related components (header, product cards, checkout, etc.) to use the new server actions and helpers.
    *   Remove all Zustand/cartStore usage from these files.
    *   Use `ServerAddToCartButton` and server actions for all cart mutations.
    *   Use `getCart` for all cart data fetching.

### **Step 3.2: Remove Zustand/Client Cart Code**
*   **Files to Delete:**
    *   `store/cartStore.ts`
    *   `providers/cart-provider.tsx`
    *   `hooks/useCart.ts`
*   **Action:**
    *   Remove all imports and usage of these files from the codebase.
    *   Remove any remaining Zustand logic from components/pages.

### **Step 3.3: Final Testing & Validation**
*   **Checklist:**
    - [ ] Add to cart works for both guests and logged-in users
    - [ ] Cart persists across sessions/devices for logged-in users
    - [ ] Cart merges correctly on login
    - [ ] Update quantity and remove item actions work
    - [ ] Cart icon/header updates correctly
    - [ ] Checkout uses server-side cart data
    - [ ] No Zustand/client cart code remains
    - [ ] All UI/UX matches design system and is RTL-compatible
    - [ ] All loading states and errors are handled gracefully

---

## **Testing Instructions**

1. **Test as a guest:**
    - Add, update, and remove items from the cart
    - Refresh and verify cart persists
    - Log in and verify cart merges with user cart
2. **Test as a logged-in user:**
    - Add, update, and remove items
    - Log out and back in, verify cart persists
    - Test on multiple devices/browsers
3. **Test all cart touchpoints:**
    - Product cards, header, checkout, wishlist, etc.
    - Ensure all use the new server-side logic
4. **Test error and loading states:**
    - Simulate network/database errors
    - Ensure user-friendly messages and smooth transitions

---

**Once all steps are complete and the checklist passes, the migration is finished and the new server-side cart is live!**

This plan ensures a safe, reversible, and transparent migration. We will proceed with **Phase 1, Step 1.1** once you approve this plan. 