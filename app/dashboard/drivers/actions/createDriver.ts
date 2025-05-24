"use server";
import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { driverSchema } from '../helper/zodAndInputs';

export async function createDriver(formData: FormData) {
  try {
    // Convert FormData to plain object
    const plainData: Record<string, any> = {};
    formData.forEach((value, key) => {
      plainData[key] = value;
    });

    // Validate with zod
    const parseResult = driverSchema.safeParse(plainData);
    if (!parseResult.success) {
      // Return all validation errors in a clear format for the UI
      return {
        ok: false,
        errors: parseResult.error.flatten().fieldErrors,
        msg: 'يرجى تصحيح الأخطاء في النموذج',
      };
    }
    const data = parseResult.data;

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
      return {
        ok: false,
        msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل',
        errors: { phone: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'], email: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'] },
      };
    }

    // Create a new driver (User with role: 'DRIVER')
    await db.user.create({
      data: {
        ...data,
        role: UserRole.DRIVER,
      },
    });

    return {
      ok: true,
      msg: 'تم إضافة السائق بنجاح',
    };
  } catch (error) {
    console.error('Error creating driver:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع أثناء إضافة السائق، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
