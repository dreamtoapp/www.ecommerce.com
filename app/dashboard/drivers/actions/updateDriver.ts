"use server";
import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

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
