'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { ORDER_STATUS } from '@/constant/order-status';

const cancelOrderSchema = z.object({
  orderId: z.string().min(1, 'معرف الطلب مطلوب'),
  reason: z.string().min(1, 'سبب الإلغاء مطلوب').max(500, 'سبب الإلغاء طويل جداً'),
});

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

/**
 * Cancel order by customer with 1-hour time limit validation
 */
export async function cancelOrderByCustomer(_prevState: any, formData: FormData) {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'يجب تسجيل الدخول لإلغاء الطلب' };
    }

    // Extract and validate form data
    const orderId = formData.get('orderId') as string;
    const reason = formData.get('reason') as string;

    const validatedData = cancelOrderSchema.parse({ orderId, reason });

    // Get the order with validation
    const order = await db.order.findUnique({
      where: { 
        id: orderId,
        customerId: session.user.id, // Ensure customer owns this order
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        amount: true,
      }
    });

    if (!order) {
      return { success: false, message: 'الطلب غير موجود أو لا يمكن الوصول إليه' };
    }

    // Validate order status
    if (order.status !== ORDER_STATUS.PENDING) {
      return { 
        success: false, 
        message: 'يمكن إلغاء الطلب فقط عندما يكون في حالة الانتظار' 
      };
    }

    // Validate time limit (1 hour from creation)
    const orderCreatedAt = new Date(order.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - orderCreatedAt.getTime();
    const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

    if (timeDifference > oneHourInMs) {
      return { 
        success: false, 
        message: `انتهت مهلة الإلغاء. يمكن إلغاء الطلب خلال ساعة واحدة من إنشائه فقط.` 
      };
    }

    // Calculate remaining time for UI feedback
    const remainingTime = oneHourInMs - timeDifference;
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.CANCELED,
        resonOfcancel: `طلب العميل: ${validatedData.reason}`,
      },
    });

    // Revalidate relevant paths
    revalidatePath('/user/order-tracking');
    // revalidatePath('/user/purchase-history'); // Removed: purchase-history route deleted

    return { 
      success: true, 
      message: 'تم إلغاء الطلب بنجاح',
      remainingMinutes: remainingMinutes
    };

  } catch (error) {
    console.error('Error canceling order:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors.map(e => e.message).join(', ') 
      };
    }

    return { 
      success: false, 
      message: 'حدث خطأ أثناء إلغاء الطلب. حاول مرة أخرى.' 
    };
  }
}

/**
 * Check if order can be canceled (for UI validation)
 */
export async function canCancelOrder(orderId: string, userId: string) {
  try {
    const order = await db.order.findUnique({
      where: { 
        id: orderId,
        customerId: userId,
      },
      select: {
        status: true,
        createdAt: true,
      }
    });

    if (!order) {
      return { canCancel: false, reason: 'الطلب غير موجود' };
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      return { canCancel: false, reason: 'يمكن إلغاء الطلب فقط عندما يكون في حالة الانتظار' };
    }

    // Check time limit
    const orderCreatedAt = new Date(order.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - orderCreatedAt.getTime();
    const oneHourInMs = 60 * 60 * 1000;

    if (timeDifference > oneHourInMs) {
      return { canCancel: false, reason: 'انتهت مهلة الإلغاء (ساعة واحدة)' };
    }

    const remainingTime = oneHourInMs - timeDifference;
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

    return { 
      canCancel: true, 
      remainingMinutes,
      reason: `يمكن الإلغاء خلال ${remainingMinutes} دقيقة` 
    };

  } catch (error) {
    console.error('Error checking cancel eligibility:', error);
    return { canCancel: false, reason: 'خطأ في التحقق من إمكانية الإلغاء' };
  }
} 