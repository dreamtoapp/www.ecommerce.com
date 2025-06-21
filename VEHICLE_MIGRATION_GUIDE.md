# Vehicle Type Migration Guide

## Overview
Added vehicle type support to the driver CRUD system. This includes new vehicle fields in the User model and enhanced driver management functionality.

## Database Schema Changes

### 1. New VehicleType Enum
```prisma
enum VehicleType {
  MOTORCYCLE  // دراجة نارية
  CAR         // سيارة
  VAN         // فان
  TRUCK       // شاحنة صغيرة
  BICYCLE     // دراجة هوائية
}
```

### 2. New User Model Fields
Added the following fields to the User model for drivers:

```prisma
// Driver-specific fields
vehicleType         VehicleType? // Type of vehicle for drivers
vehiclePlateNumber  String?      // Vehicle plate number
vehicleColor        String?      // Vehicle color
vehicleModel        String?      // Vehicle model (e.g., "Honda CBR", "Toyota Camry")
driverLicenseNumber String?      // Driver's license number
isActive            Boolean      @default(true) // For driver availability management
maxOrders           Int?         @default(3) // Maximum orders driver can handle simultaneously
experience          Int?         // Years of driving experience
```

## Migration Steps

### 1. Run Prisma Migration
```bash
npx prisma db push
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Restart Development Server
```bash
npm run dev
```

## New Features Added

### 1. Enhanced Driver Form
- Vehicle type selection (dropdown)
- Vehicle plate number input
- Vehicle color input
- Vehicle model input
- Driver license number input
- Years of experience input
- Maximum concurrent orders setting

### 2. Updated Driver Display
- Shows real vehicle information from database
- Vehicle type in Arabic
- Plate number display
- Color and model information

### 3. Form Validation
- Vehicle type enum validation
- Optional fields with proper error handling
- Number validation for experience and maxOrders

## File Changes Made

### Schema
- `prisma/schema.prisma` - Added VehicleType enum and User model fields

### Form & Validation
- `app/dashboard/management-users/shared/helper/userZodAndInputs.ts` - Added vehicle fields to schema and form
- `app/dashboard/management-users/shared/components/UserUpsert.tsx` - Added select field support

### Actions
- `app/dashboard/management-users/shared/actions/upsertUser.ts` - Added vehicle fields to create/update
- `app/dashboard/management-orders/assign-driver/[orderId]/actions/get-drivers.ts` - Uses real vehicle data

### Pages
- `app/dashboard/management-users/drivers/page.tsx` - Added vehicle fields to default values

## Testing

1. **Add New Driver**: Test form with all vehicle fields
2. **Update Existing Driver**: Test updating vehicle information
3. **Driver Assignment**: Verify vehicle info shows in driver cards
4. **Form Validation**: Test required/optional field validation

## Notes

- All vehicle fields are optional except vehicleType for drivers
- maxOrders defaults to 3 if not specified
- experience defaults to 1 if not specified
- Vehicle type displays in Arabic in the UI
- Existing drivers will have null vehicle fields until updated

## Rollback Plan

If issues occur, you can rollback by:
1. Remove the new fields from User model in schema.prisma
2. Run `npx prisma db push`
3. Revert the code changes 