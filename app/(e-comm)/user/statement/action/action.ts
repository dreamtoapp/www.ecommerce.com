import db from '../../../../../lib/prisma';

export async function getUserStatement(userId: string) {
  if (!userId) {
    console.error('getUserStatement: userId is required');
    return null;
  }

  try {
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
                    imageUrl: true
                  }
                }
              }
            }
          }
        },
      },
    });

    if (!user) {
      console.error(`getUserStatement: User not found with id ${userId}`);
      return null;
    }

    // Calculate order amounts if not already calculated
    const ordersWithCalculatedAmounts = user.customerOrders.map(order => {
      const calculatedAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...order,
        amount: order.amount || calculatedAmount
      };
    });

    return {
      ...user,
      customerOrders: ordersWithCalculatedAmounts
    };

  } catch (error) {
    console.error('getUserStatement: Database error:', error);
    throw new Error('حدث خطأ أثناء جلب بيانات الحساب');
  }
}
