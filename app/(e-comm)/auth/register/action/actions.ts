'use server';

import { signIn } from '../../../../../auth';
import db from '../../../../../lib/prisma';

export async function registerUser(_state: { success: boolean; message: string } | null, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const redirect = formData.get('redirect') as string || '/';
  
  // Validate input data
  if (!name || !phone || !password || !confirmPassword) {
    return { success: false, message: 'جميع الحقول مطلوبة' };
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    return { success: false, message: 'كلمات المرور غير متطابقة' };
  }

  // Check if the user already exists
  if (!phone) return null;
  const existingUser = await db.user.findUnique({
    where: { phone },
  });
  if (existingUser) {
    return { success: false, message: 'رقم الهاتف مسجل مسبقاً' };
  }

  // Hash the password (using plain password for now, consider bcrypt in production)
  const hashedPassword = password;

  try {
    // Create a new user in the database
    await db.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
      },
    });

    // Automatically sign in the user after successful registration
    await signIn('credentials', {
      phone,
      password,
      redirectTo: redirect,
    });

    return { success: true, message: 'تم إنشاء الحساب وتسجيل الدخول بنجاح' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب' };
  }
}
