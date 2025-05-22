'use server';

import { signIn } from '../../../../../auth';
import db from '../../../../../lib/prisma';

export const userLogin = async (
  _state: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string } | null> => {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  // Validate input data
  if (!phone || !password) {
    return { success: false, message: 'جميع الحقةل مطلوبة' };
  }

  // Check if the user already exists
  if (!phone) return null;
  const existingUser = await db.user.findUnique({ where: { phone } });
  if (!existingUser) {
    return { success: false, message: 'المعلومات  غير صحيحية' };
  }

  if (existingUser.password !== password) {
    return { success: false, message: '... المعلومات  غير صحيحية' };
  }

  await signIn('credentials', {
    phone,
    password,
    // redirect: false,
    redirectTo: '/',
  });

  return { success: true, message: 'تم التسجيل بنجاح' };
};
