'use server';

import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';
import { orderInWayIncludeRelation } from '@/types/databaseTypes';

// Reusable error interface for server actions

export const fetchTrackInfo = async (orderid: string): Promise<any> => {
  try {
    const latAndlong = await db.orderInWay.findUnique({
      where: { orderId: orderid },
      include: orderInWayIncludeRelation
    });
    if (!latAndlong) {
      const error: ActionError = { message: 'تعذر العثور على بيانات التتبع لهذا الطلب. تأكد من أن الطلب قيد التتبع.', code: 'NOT_FOUND' };
      throw error;
    }
    return latAndlong;
  } catch (error) {
    const err: ActionError = typeof error === 'object' && error && 'message' in error
      ? { message: (error as ActionError).message, code: (error as ActionError).code }
      : { message: 'حدث خطأ غير متوقع أثناء جلب بيانات التتبع.' };
    throw err;
  }
};
