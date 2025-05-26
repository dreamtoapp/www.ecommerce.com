"use server"

import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';

export async function syncOrderInWay() {
  try {
    console.log('🔄 Syncing OrderInWay table with orders where isTripStart=true...');
    const tripOrders = await db.order.findMany({ where: { isTripStart: true } });
    console.log(tripOrders.length, 'orders found with isTripStart=true');
    let addedCount = 0;
    for (const order of tripOrders) {
      if (!order.driverId) continue;
      const existing = await db.orderInWay.findUnique({ where: { driverId: order.driverId } });
      if (!existing) {
        await db.orderInWay.create({
          data: {
            orderId: order.id,
            driverId: order.driverId,
            orderNumber: order.orderNumber,
            latitude: order.latitude ? order.latitude : '',
            longitude: order.longitude ? order.longitude : '',
          },
        });
        addedCount++;
      }
    }
    console.log(`✅ Sync complete. Added ${addedCount} missing OrderInWay records.`);
    return { success: true, addedCount };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في مزامنة بيانات OrderInWay.' };
    return { success: false, error: err.message };
  }
}
