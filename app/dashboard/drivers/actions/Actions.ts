// app/dashboard/drivers/actions.ts
'use server';

// All driver CRUD operations now use the User model with role: 'DRIVER'.
// All references to db.driver have been removed. See migration plan for details.

import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Create a new driver (User with role: 'DRIVER')
export async function createDriver(formData: FormData) {
  try {
    const data = {
      phone: formData.get('phone') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string | null,
      password: formData.get('password') as string,
      address: formData.get('address') as string | null,
      latitude: formData.get('latitude') as string,
      longitude: formData.get('longitude') as string,
    };

    // Check if phone or email already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          { email: data.email },
        ],
      },
    });

    if (existingUser) {
      return { msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل' };
    }

    // Create a new driver (User with role: 'DRIVER')
    await db.user.create({
      data: {
        ...data,
        role: UserRole.DRIVER,
      },
    });

    return { msg: 'تم إضافة السائق بنجاح' };
  } catch (error) {
    console.error('Error creating driver:', error);
    throw new Error('Failed to create driver');
  }
}

// Fetch all drivers (users with role: 'DRIVER')
export async function getDrivers() {
  try {
    const drivers = await db.user.findMany({ where: { role: UserRole.DRIVER } });
    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw new Error('Failed to fetch drivers.');
  }
}

// Update an existing driver (User with role: 'DRIVER')
export async function updateDriver(formData: FormData) {
  try {
    const driverId = formData.get('id') as string;
    if (!driverId) {
      throw new Error('Driver ID is required');
    }

    const data = {
      phone: formData.get('phone') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string | null,
      address: formData.get('address') as string | null,
      latitude: formData.get('latitude') as string,
      longitude: formData.get('longitude') as string,
    };

    // Check if phone or email already exists for another user
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone: data.phone, NOT: { id: driverId } },
          { email: data.email, NOT: { id: driverId } },
        ],
      },
    });

    if (existingUser) {
      return { msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل لمستخدم آخر' };
    }

    await db.user.update({
      where: { id: driverId },
      data: {
        ...data,
        role: UserRole.DRIVER,
      },
    });

    return { msg: 'تم تحديث بيانات السائق بنجاح' };
  } catch (error) {
    console.error('Error updating driver:', error);
    throw new Error('Failed to update driver');
  }
}

// Delete a driver (User with role: 'DRIVER')
export async function deleteDriver(driverId: string) {
  try {
    await db.user.delete({
      where: { id: driverId },
    });
    return { msg: 'تم حذف السائق بنجاح' };
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw new Error('Failed to delete driver');
  }
}
