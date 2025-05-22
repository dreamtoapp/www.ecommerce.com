// Update or create promotion SEO for a given locale
"use server";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

import { schema } from '../helper/zod';
import { ActionError } from '@/types/commonType';

function formatPromotionSeoError(error: unknown): ActionError {
  if (error instanceof Error) {
    return { message: error.message };
  }
  if (typeof error === 'object' && error && 'message' in error) {
    return { message: String((error as { message: string }).message) };
  }
  return { message: 'حدث خطأ غير متوقع أثناء تحديث بيانات السيو.' };
}

export async function updatePromotionSeo(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { promotionId, locale, ...seoFields } = parsed.data;
  try {
    await db.globalSEO.upsert({
      where: {
        entityId_entityType_locale: {
          entityId: promotionId,
          entityType: EntityType.PROMOTION,
          locale,
        },
      },
      update: seoFields,
      create: {
        entityId: promotionId,
        entityType: EntityType.PROMOTION,
        locale,
        ...seoFields,
      },
    });
    await Promise.all([
      revalidatePath('/dashboard/seo/promotion'),
      revalidatePath(`/dashboard/seo/promotion/${promotionId}`),
    ]);
    return { success: true };
  } catch (error) {
    const err: ActionError = formatPromotionSeoError(error);
    return { success: false, error: `فشل تحديث بيانات السيو للعروض: ${err.message}` };
  }
}
