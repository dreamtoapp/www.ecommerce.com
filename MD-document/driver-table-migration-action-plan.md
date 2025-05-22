# Action Plan: Migrating Driver Table to Use User Table with Roles (admin, customer, driver, marketer)

## 1. **Schema Migration**
- [ ] **Remove the `Driver` model** from `prisma/schema.prisma`.
- [ ] **Add `role` field to `User` model** (if not present):
    ```prisma
    model User {
      ...
      role String @default("customer") // Enum recommended: admin, customer, driver, marketer
      ...
    }
    ```
- [ ] **Update all relations**:
    - In `Order`, change `driverId` to reference `User` (not `Driver`).
    - In `OrderInWay`, change `driverId` to reference `User`.
    - Remove all `@relation` to `Driver` and update to `User`.
- [ ] **Migrate driver-specific fields** (image, phone, etc.) to `User` if not already present.
- [ ] **Create enum for roles** (optional, recommended):
    ```prisma
    enum UserRole {
      ADMIN
      CUSTOMER
      DRIVER
      MARKETER
    }
    ```
    And use: `role UserRole @default(CUSTOMER)`

## 2. **Data Migration Script**
- [ ] Write a script to:
    - Copy all drivers from `Driver` table to `User` table with `role = 'driver'`.
    - Migrate all references (`driverId`) in `Order`, `OrderInWay`, etc. to point to the new `User` record.
    - Remove the `Driver` table after migration.

## 3. **Backend Code Refactor**
- [ ] **Update all Prisma queries**:
    - Replace `db.driver` with `db.user` and filter by `role: 'driver'`.
    - Update all `include`/`select` for driver to use `user` fields.
    - Update all driver creation, update, and delete logic to use `User` with `role: 'driver'`.
- [ ] **Update authentication logic**:
    - Ensure driver login uses `User` with `role: 'driver'`.
    - Update session, JWT, and role checks throughout the codebase.
- [ ] **Update all API routes and actions**:
    - All endpoints that create, update, fetch, or delete drivers must use the `User` table and `role`.
    - Update error handling and validation to reflect new structure.

## 4. **Frontend Refactor**
- [ ] **Update all driver-related components**:
    - Change all types/interfaces from `Driver` to `User` (with `role: 'driver'`).
    - Update props, state, and API calls in driver management, assignment, and reporting UIs.
    - Update driver selection, assignment, and display logic to use `User`.
- [ ] **Update driver authentication UI**:
    - Ensure login/register forms use the `User` table and set/check `role: 'driver'`.
- [ ] **Update admin/user/marketer logic**:
    - Where role-based logic is used, update to use the new enum/role field.

## 5. **Testing & Validation**
- [ ] **Test all driver flows**:
    - Driver creation, update, delete, login, assignment to order, tracking, reporting, etc.
- [ ] **Test all user/admin/marketer flows**:
    - Ensure no regression for other roles.
- [ ] **Test all analytics, reporting, and dashboards** for correct driver data.
- [ ] **Test all API endpoints** for correct role-based access and data.

## 6. **Documentation**
- [ ] Update all relevant documentation and code comments to reflect the new structure.
- [ ] Add migration notes and rollback plan if needed.

---

## Affected Files & Areas (Examples)
- `prisma/schema.prisma`
- All files in `app/dashboard/drivers/`, `app/driver/`, `app/dashboard/orders-management/`, `app/dashboard/reports/drivers/`, etc.
- All driver-related actions, API routes, and components
- All types/interfaces in `types/databaseTypes.ts` and related files
- All authentication/session logic
- All analytics and reporting code referencing drivers

---

## Notes
- This migration will unify all users (admin, customer, driver, marketer) in a single table, simplifying role management and permissions.
- All driver logic will use the `User` table with `role: 'driver'`.
- All code referencing the old `Driver` model must be updated.
- Test thoroughly before deploying to production.
