'use server';

import db from '../../../../../lib/prisma';

export async function registerUser(_state: { success: boolean; message: string } | null, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  // Validate input data
  if (!name || !phone || !password) {
    return { success: false, message: 'جميع الحقةل مطلوبة' };
  }

  // Check if the user already exists
  if (!phone) return null;
  const existingUser = await db.user.findUnique({
    where: { phone },
  });
  if (existingUser) {
    return { success: false, message: 'مسجل مسبقا' };
  }

  // Hash the password
  // const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword = password;

  // Create a new user in the database
  await db.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
    },
  });

  return { success: true, message: 'تم التسجيل بنجاح' };
}
