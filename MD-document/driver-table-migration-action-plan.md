# Action Plan: Migrate Driver Table to Role-Based User Table

## 1. Schema Migration

- [ ] **Remove the `Driver` model** from `prisma/schema.prisma`.
- [ ] **Add a `role` field to the `User` model** (if not present):
    ```prisma
    model User {
      // ...existing fields...
      role String @default("customer") // Enum recommended: admin, customer, driver, marketer
      // ...existing fields...
    }
    ```
- [ ] **(Recommended) Create a roles enum:**
    ```prisma
    enum UserRole {
      ADMIN
      CUSTOMER
      DRIVER
      MARKETER
    }
    ```
    And use: `role UserRole @default(CUSTOMER)`
- [ ] **Update all relations:**
    - In `Order`, change `driverId` to reference `User` (not `Driver`).
    - In `OrderInWay`, change `driverId` to reference `User`.
    - Remove all `@relation` to `Driver` and update to `User`.
    - **Check all models for references to `Driver`** and update them to reference `User`.
    - **Ensure referential integrity** and update or remove any orphaned records.
- [ ] **Migrate driver-specific fields** (image, phone, etc.) to `User` if not already present.

## 2. Data Migration Script

- [ ] Write a script to:
    - Copy all drivers from the `Driver` table to the `User` table with `role = 'driver'`.
    - **Keep a mapping of old `Driver` IDs to new `User` IDs** for reference and rollback.
    - **Handle unique constraints** (e.g., email, phone) and resolve duplicates before migration.
    - **Migrate driver passwords** and ensure compatibility with the `User` authentication system.
    - Migrate all references (`driverId`) in `Order`, `OrderInWay`, etc. to point to the new `User` record.
    - Remove the `Driver` table after migration.

## 3. Backend Code Refactor

- [ ] **Update all Prisma queries:**
    - Replace `db.driver` with `db.user` and filter by `role: 'driver'`.
    - Update all `include`/`select` for driver to use `User` fields.
    - Update all driver creation, update, and delete logic to use `User` with `role: 'driver'`.
- [ ] **Update authentication logic:**
    - Ensure driver login uses `User` with `role: 'driver'`.
    - Update session, JWT, and role checks throughout the codebase.
    - **Update session/token logic** to reference `User` and invalidate old `Driver` sessions.
- [ ] **Update all API routes and actions:**
    - All endpoints that create, update, fetch, or delete drivers must use the `User` table and `role`.
    - Update error handling and validation to reflect the new structure.
- [ ] **Refactor Driver CRUD Operations:**
    - Update all driver creation logic to create a `User` with `role: 'driver'`.
    - Update driver read/list queries to fetch users with `role: 'driver'`.
    - Update driver update logic to modify the corresponding `User` record (with `role: 'driver'`).
    - Update driver delete logic to remove or deactivate the `User` record (with `role: 'driver'`).
    - Ensure all validation, error handling, and business logic is updated to work with the unified `User` model.
- [ ] **Enforce strict role checks** in all backend logic and APIs.

## 4. Frontend Refactor

- [ ] **Update all driver-related components:**
    - Change all types/interfaces from `Driver` to `User` (with `role: 'driver'`).
    - Update props, state, and API calls in driver management, assignment, and reporting UIs.
    - Update driver selection, assignment, and display logic to use `User`.
- [ ] **Update driver authentication UI:**
    - Ensure login/register forms use the `User` table and set/check `role: 'driver'`.
- [ ] **Update admin/user/marketer logic:**
    - Where role-based logic is used, update to use the new enum/role field.
- [ ] **Refactor Driver CRUD UI:**
    - Update all forms, dialogs, and pages for creating, editing, viewing, and deleting drivers to use the `User` model with `role: 'driver'`.
    - Ensure all API calls and state management for driver CRUD use the new backend endpoints and data structures.
    - // NOTE: Use server actions for all driver CRUD operations, not API routes. Ensure all logic is secure, clean, and follows best practices for server actions. Add comments and documentation for maintainability.

## 5. Testing & Validation

- [ ] **Update and run automated tests** (unit, integration, e2e) for all affected areas.
- [ ] **Perform manual QA** for all driver and user flows, including edge cases.
- [ ] **Test rollback plan** on a staging environment.
- [ ] **Test all driver flows:**
    - Driver creation, update, delete, login, assignment to order, tracking, reporting, etc.
- [ ] **Test all user/admin/marketer flows:**
    - Ensure no regression for other roles.
- [ ] **Test all analytics, reporting, and dashboards** for correct driver data.
- [ ] **Test all API endpoints** for correct role-based access and data.

## 6. Deployment & Rollback

- [ ] **Back up the database** before migration.
- [ ] **Prepare a deployment plan** with a maintenance window if needed.
- [ ] **Notify all stakeholders** about the migration and any expected downtime.
- [ ] **Test and document the rollback plan**.

## 7. Documentation

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
