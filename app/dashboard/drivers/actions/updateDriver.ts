'use server';

import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { driverSchema } from '../helper/zodAndInputs';

type ValidationResult<T> = { success: true; data: T } | { success: false; errors: Record<string, string[]> };

function formDataToObject(formData: FormData): Record<string, any> {
  const data: Record<string, any> = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function validateDriverData(data: Record<string, any>): ValidationResult<typeof driverSchema._type> {
  const result = driverSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  return { success: true, data: result.data };
}

async function isEmailOrPhoneTaken(email: string, phone: string, excludeId: string) {
  return await db.user.findFirst({
    where: {
      OR: [
        { AND: [{ phone }, { NOT: { id: excludeId } }] },
        { AND: [{ email }, { NOT: { id: excludeId } }] },
      ],
    },
  });
}

export async function updateDriver(formData: FormData) {
  try {
    const driverId = formData.get('id') as string;
    if (!driverId) {
      return {
        ok: false,
        msg: 'معرّف السائق مطلوب',
        errors: { id: ['معرّف السائق مطلوب'] },
      };
    }

    const rawData = formDataToObject(formData);

    const validation = validateDriverData(rawData);
    if (!validation.success) {
      return {
        ok: false,
        msg: 'يرجى تصحيح الأخطاء في النموذج',
        errors: validation.errors,
      };
    }

    const { email, phone, ...rest } = validation.data;

    const existingUser = await isEmailOrPhoneTaken(email, phone, driverId);
    if (existingUser) {
      return {
        ok: false,
        msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل لمستخدم آخر',
        errors: {
          phone: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'],
          email: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'],
        },
      };
    }

    await db.user.update({
      where: { id: driverId },
      data: {
        ...rest,
        email,
        phone,
        role: UserRole.DRIVER,
      },
    });

    return { ok: true, msg: 'تم تحديث بيانات السائق بنجاح' };
  } catch (error) {
    console.error('Error updating driver:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع أثناء تحديث بيانات السائق، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
