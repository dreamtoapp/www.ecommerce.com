'use server';

import { z } from 'zod';

import db from '@/lib/prisma';

import { CompanySchema } from '../helper/companyZodAndInputs';

export async function saveCompany(rawData: unknown) {
  try {
    // ✅ 1. التحقق من صحة البيانات باستخدام Zod
    const formData = CompanySchema.parse(rawData);

    // 🔍 2. البحث عن شركة موجودة مسبقًا (نمط singleton)
    const existingCompany = await db.company.findFirst();

    // ♻️ 3. التحديث أو الإنشاء حسب وجود الشركة
    const company = await db.company.upsert({
      where: { id: existingCompany?.id ?? '000000000000000000000000' },
      update: formData,
      create: formData,
    });

    // ✅ 4. إرجاع الشركة بعد الحفظ
    return { success: true, company };

  } catch (error) {
    console.error('❌ Failed to save company:', error);

    // ❌ 5. إرجاع خطأ بطريقة واضحة
    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? 'بيانات غير صالحة. يرجى مراجعة الحقول.'
          : 'حدث خطأ أثناء حفظ بيانات الشركة.',
      details: error instanceof z.ZodError ? error.flatten() : null,
    };
  }
}
