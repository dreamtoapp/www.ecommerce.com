# Order Delivery Lifecycle & Tracking System (PRD Reference)

> **Reference:** Product Requirements Document (PRD)

---

## 📝 Overview

This document defines the business logic and lifecycle for order delivery and driver tracking. It is the authoritative reference for all future enhancements to the tracking system, based on the latest PRD and codebase analysis.

---

## 🚦 The Role of the ASSIGNED Status

**ASSIGNED** is a dedicated order status that means:
- The order has been assigned to a driver and is physically in their car/van.
- The driver has NOT yet started the delivery trip to the client.
- No tracking is active for this order.
- `isTripStart = false`.

**Business Value:**
- Lets you see which orders are currently with a driver but not yet being delivered.
- Enables accurate reporting on orders "waiting in van" and how long they stay there.
- Ensures tracking only starts when the driver actually begins the delivery (moves to IN_TRANSIT).
- Improves user experience for both drivers and admins.

---

## 📖 Status Definitions

| Status     | isTripStart | Tracking | Description                                                      |
|------------|-------------|----------|------------------------------------------------------------------|
| PENDING    | false       | OFF      | Order created, not yet assigned to a driver                      |
| ASSIGNED   | false       | OFF      | Order assigned to driver, in vehicle, trip not started           |
| IN_TRANSIT | true        | ON       | Driver started trip for this order, delivery in progress         |
| DELIVERED  | false       | OFF      | Order delivered, trip ended                                      |
| CANCELED   | false       | OFF      | Order canceled, trip ended                                       |

**Key Rule:**
- **ASSIGNED** means the order is with the driver, but the delivery trip to the client has NOT started. No tracking is active. `isTripStart = false`.
- **IN_TRANSIT** means the driver has explicitly started the trip for this order. Tracking is active. `isTripStart = true`.
- Only one order per driver can be `IN_TRANSIT` at a time.

---

## 🔄 Status Flow & Transitions

```
PENDING (order created)
   |
   |--[Admin assigns to driver]-->
ASSIGNED (order in vehicle, trip not started)
   |
   |--[Driver presses Start Trip for Order X]-->
IN_TRANSIT (driver en route to client, tracking ON)
   |
   |--[Delivered]----------------------------->
DELIVERED (trip ended, tracking OFF)
   |--[Canceled]------------------------------>
CANCELED (trip ended, tracking OFF)
   |
   |--[Repeat for next order]
```

---

## 🚚 Example Scenario: Multi-Order Assignment

- Driver Ahmed (VAN) is assigned 10 orders by admin.
- Orders are moved from store to Ahmed's van.
- All 10 orders: `status = ASSIGNED`, `isTripStart = false`, tracking OFF.
- Ahmed is ready to deliver to client Khalid:
    - Ahmed presses "Start Trip" for Khalid's order.
    - Khalid's order: `status = IN_TRANSIT`, `isTripStart = true`, tracking ON.
    - All other orders remain `ASSIGNED`, `isTripStart = false`, tracking OFF.
- After delivery or cancellation:
    - Khalid's order: `status = DELIVERED` or `CANCELED`, `isTripStart = false`, tracking OFF.
    - Ahmed can now start the trip for the next order.

---

## 🏁 isTripStart Flag Logic

- `isTripStart = true` **only** when the driver has pressed "Start Trip" for a specific order.
- Only one order per driver can have `isTripStart = true` at a time.
- When delivery is completed or canceled, `isTripStart` is set to `false`.
- Map tracking is enabled only when `isTripStart = true`.

---

## 🛠️ Backend Enforcement Checklist

- [ ] When driver starts trip for an order:
    - Set `isTripStart = true` for that order
    - Set `status = IN_TRANSIT`
    - Ensure no other order for the same driver has `isTripStart = true`
    - Start map tracking
- [ ] When order is delivered or canceled:
    - Set `isTripStart = false`
    - Set `status = DELIVERED` or `CANCELED`
    - Stop map tracking
- [ ] Prevent multiple orders per driver with `isTripStart = true` simultaneously
- [ ] Log all trip start/stop events for auditability

---

## 🧹 Migration/Correction Steps

- Set `isTripStart = true` only for orders with `status = IN_TRANSIT` (and only one per driver)
- Set `isTripStart = false` for all other orders
- Audit for any data inconsistencies and correct as needed

---

## 🚀 Recommendations for Future Enhancements

- Support for multi-stop (batch) deliveries with clear tracking per stop
- Real-time ETA and route optimization
- Enhanced driver location history and analytics
- Push notifications for clients when driver is en route
- Improved error handling and fallback for GPS/tracking failures
- UI/UX improvements for driver dashboard and client tracking views

---

> **This PRD section is the single source of truth for the order lifecycle and tracking logic. Keep it updated as the system evolves.** 