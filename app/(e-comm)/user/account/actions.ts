'use server';

import db from '@/lib/prisma';

// Comprehensive account data types
export type AccountData = {
  user: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    createdAt: Date;
  };
  orders: OrderData[];
  statistics: {
    totalOrders: number;
    totalSpent: number;
    totalSpentExcludingCanceled: number;
    averageOrderValue: number;
    statusBreakdown: Record<string, { count: number; total: number }>;
  };
};

export type OrderData = {
  id: string;
  orderNumber: string;
  status: string;
  amount: number;
  createdAt: Date;
  deliveredAt: Date | null;
  items: OrderItemData[];
};

export type OrderItemData = {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  price: number;
  quantity: number;
  hasRated: boolean;
};

/**
 * Get comprehensive account data for the user dashboard
 * This consolidates data from both statement and purchase history
 */
export async function getUserAccountData(userId: string): Promise<AccountData | null> {
  if (!userId) {
    console.error('getUserAccountData: userId is required');
    return null;
  }

  try {
    // Get user with all orders and items in one optimized query
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        customerOrders: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    imageUrl: true,
                    slug: true
                  }
                }
              }
            }
          }
        },
      },
    });

    if (!user) {
      console.error(`getUserAccountData: User not found with id ${userId}`);
      return null;
    }

    // Process orders and calculate statistics
    const orders: OrderData[] = user.customerOrders.map(order => {
      // Calculate order amount from items
      const calculatedAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        amount: order.amount || calculatedAmount,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || 'منتج غير متوفر',
          productImageUrl: item.product?.imageUrl || '/fallback/product-fallback.avif',
          price: item.price,
          quantity: item.quantity,
          hasRated: false, // TODO: Implement rating check
        }))
      };
    });

    // Calculate comprehensive statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalSpentExcludingCanceled = orders
      .filter(order => order.status !== 'CANCELED')
      .reduce((sum, order) => sum + order.amount, 0);
    
    const averageOrderValue = totalOrders > 0 ? totalSpentExcludingCanceled / totalOrders : 0;

    // Calculate status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status]) {
        acc[status] = { count: 0, total: 0 };
      }
      acc[status].count++;
      acc[status].total += order.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
      orders,
      statistics: {
        totalOrders,
        totalSpent,
        totalSpentExcludingCanceled,
        averageOrderValue,
        statusBreakdown,
      }
    };

  } catch (error) {
    console.error('getUserAccountData: Database error:', error);
    throw new Error('حدث خطأ أثناء جلب بيانات الحساب');
  }
}

 