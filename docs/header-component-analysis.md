# Header Component Analysis & Cleanup Plan

_Last updated: {{DATE}}_

---

## 1. Directory Snapshot

| File | Lines | Purpose / Notes | **Status** |
|------|:----:|-----------------|-----------|
| `Header.tsx` | ~70 | Desktop header used in `app/(e-comm)/layout.tsx` | **KEEP** |
| `MobileHeader.tsx` | ~140 | Mobile header used in `layout.tsx` | **KEEP** |
| `MobileBottomNav.tsx` | ~459 | Mobile bottom navigation (site-wide) | **KEEP** |
| `UserMenuTrigger.tsx` | ~407 | Sheet-based user drawer (desktop & mobile) | **KEEP** |
| `SearchBar.tsx` | ~137 | Reusable product search bar | **KEEP** |
| `Logo.tsx` | ~23 | Company logo component | **KEEP** |
| `EnhancedHeader.tsx` | ~230 | Prototype header with mega-menu | Safe to delete |
| `HeaderClient.tsx` | ~163 | Legacy client-only header | Safe to delete |
| `MegaMenu.tsx` | ~340 | Only used by `EnhancedHeader` | Safe to delete |
| `MobileMenu.tsx` | ~128 | Unreferenced mobile menu | Safe to delete |
| `MobileSearchBar.tsx` | ~217 | Prototype search UI | Safe to delete |
| `MobileSearchDrawer.tsx` | ~217 | Prototype search drawer | Safe to delete |
| `CartIcon.tsx` | 4 | Thin wrapper around `CartIconClient` | Safe to delete |
| `CartIconClient.tsx` | ~109 | Only used by wrapper | Safe to delete |
| `CartPreview.tsx` | ~104 | Only used by `CartIconClient` | Safe to delete |
| `BackButton.tsx` (local) | ~31 | Duplicate of global `BackButton` | Safe to delete |
| `UserMenu.tsx` | ~143 | Old split version of user menu | Safe to delete |
| `UserMenuStats.tsx` | ~207 | Unused stats view | Safe to delete |
| `UserMenuSheetContent.tsx` | ~290 | Unused drawer layout | Safe to delete |
| `UserMenuAdminSection.tsx` | ~110 | Unused admin shortcuts | Safe to delete |
| `UserMenuCartActions.tsx` | ~21 | Unused cart shortcuts | Safe to delete |
| `UserMenuNotifications.tsx` | ~19 | Unused bell icon | Safe to delete |
| `NavLinks.tsx` | ~68 | Commented-out import in `Header.tsx` | Safe to delete |
| `CategoryNav.tsx` | ~57 | Only referenced in commented code | Safe to delete |
| `ThemeToggle.tsx` | ~23 | Duplicate toggle component | Safe to delete |
| `LanguageToggle.tsx` | 0 | Empty placeholder | Safe to delete |
| `UserMenu copy.txt` | ~605 | Old snapshot | Safe to delete |

> **Key:**  
> **KEEP** – actively imported, necessary for current layout  
> Safe to delete – no active imports; removal will not break compile

---

## 2. Problems Observed

1. **Dead Code Weight** – 21 orphaned files (~2 500 LOC) inflate build & cognitive cost.
2. **Duplicate Components** – `BackButton`, `ThemeToggle`, etc., already exist globally.
3. **Accidental Deletion Risk** – recent build error showed that losing `Header.tsx` causes a 500; we must guard critical imports.

---

## 3. Cleanup & Refactor Roadmap

### Phase 1 – House-Keeping (1 day)
1. Create a new branch `feat/header-cleanup`.
2. Delete all files marked _Safe to delete_ above.
3. Run `pnpm lint` & `pnpm type-check`; ensure zero unresolved imports.
4. Commit: **chore: remove unused header components**.

### Phase 2 – Consolidate Shared Logic (1-2 days)
1. Move common atoms (`Logo`, `SearchBar`, basic buttons) into `components/ecomm/Header/common/`.
2. Extract repeated JSX from `Header.tsx` & `MobileHeader.tsx` into small presentational parts (`HeaderActions.tsx`, `HeaderLogo.tsx`).
3. Decide between:
   - **Single Responsive Header** (preferred): merge desktop & mobile views with Tailwind breakpoints.
   - Keep two files but share  >80 % code via extracted parts.

### Phase 3 – Folder Re-organisation (0.5 day)
1. Move `MobileBottomNav.tsx` to `components/navigation/` (site-wide component).
2. Move `UserMenuTrigger.tsx` to `components/user/UserMenuDrawer.tsx` to keep header folder slim.

### Phase 4 – Typing & Naming Polish (0.5 day)
1. Replace `any` in `Header.tsx` with existing `UserWithRole` interface.
2. Rename:
   - `UserMenuTrigger` → `UserMenuDrawer` (clearer intent)
   - `SearchBar` → `ProductSearchBar` (domain-specific)

### Phase 5 – Design-System Alignment (1 day)
1. Ensure mandatory class names (`icon-enhanced`, `card-hover-effect`, feature colors) are applied.
2. Add card-style dropdowns to search suggestions & user menu in compliance with project rules.
3. Remove local `BackButton`; use global one with required variants.

### Phase 6 – Guard Rails & Tests (as time allows)
1. Add Jest/Vitest test or Storybook stories for:
   - Header rendering (desktop & mobile)
   - User menu drawer
   - Mobile bottom nav
2. Configure ESLint `no-restricted-imports` to forbid imports from **internal** header files that are not part of the public API.

---

## 4. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Accidentally removing still-needed code | 500 errors in production | Perform Phase 1 on dedicated branch & run full test/build before merging |
| Large PR hard to review | Review fatigue | Split into functional commits (delete → refactor → move) |
| Designer hand-off mismatch | UI glitches | Include design snapshots & follow “Enhanced Card System” checklist |

---

## 5. Next Steps

- [ ] Approve this roadmap.  
- [ ] Create `feat/header-cleanup` branch & apply Phase 1.  
- [ ] Schedule pair-review session after Phase 2.

---

_Questions or suggestions? Feel free to add comments directly in this document._