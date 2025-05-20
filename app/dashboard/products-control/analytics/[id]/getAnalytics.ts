
'use server';
import db from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getProductAnalytics(
  productId: string,
  dateFrom?: string,
  dateTo?: string
) {
  const productInfo = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      price: true,
      costPrice: true,
      outOfStock: true,
      supplierId: true,
      published: true,
      type: true,
      createdAt: true,
      slug: true,
      details: true,
      size: true,
      updatedAt: true,
      productCode: true,
      gtin: true,
      brand: true,
      material: true,
      color: true,
      dimensions: true,
      weight: true,
      features: true,
      requiresShipping: true,
      stockQuantity: true,
      manageInventory: true,
      compareAtPrice: true,
      tags: true,
      shippingDays: true,
      returnPeriodDays: true,
      hasQualityGuarantee: true,
      careInstructions: true,
      images: true,
      description: true,
      rating: true,
      reviewCount: true,
    },
  });
  if (!productInfo) return null;

  // Fetch supplier name if available
  const supplierName = productInfo.supplierId
    ? (
      await db.supplier.findUnique({
        where: { id: productInfo.supplierId },
        select: { name: true },
      })
    )?.name ?? null
    : null;

  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;

  const orderItemWhereBase: Prisma.OrderItemWhereInput = { productId };
  const orderWhereDateFilter: Prisma.OrderWhereInput = {};
  const reviewWhereDateFilter: Prisma.ReviewWhereInput = {};

  if (fromDate && toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    orderWhereDateFilter.createdAt = { gte: fromDate, lte: end };
    orderItemWhereBase.order = orderWhereDateFilter;
    reviewWhereDateFilter.createdAt = { gte: fromDate, lte: end };
  }

  const orderItems = await db.orderItem.findMany({
    where: orderItemWhereBase,
    include: { order: { select: { id: true, customerId: true, createdAt: true, customerName: true, status: true, orderNumber: true } } },
  });

  const totalRevenue = orderItems.reduce((sum, oi) => sum + oi.quantity * (oi.price || 0), 0);
  const uniqueOrderIds = new Set(orderItems.map(oi => oi.orderId));
  const totalUniqueOrders = uniqueOrderIds.size;
  const uniqueCustomerIds = new Set(orderItems.map(oi => oi.order?.customerId).filter(Boolean));
  const totalUniqueCustomers = uniqueCustomerIds.size;

  const revenueByMonth: Record<string, number> = {};
  orderItems.forEach(({ order, quantity, price }) => {
    if (order?.createdAt) {
      const key = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      revenueByMonth[key] = (revenueByMonth[key] || 0) + quantity * (price || 0);
    }
  });
  const salesByMonth = Object.entries(revenueByMonth)
    .map(([month, sales]) => ({ month, sales }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const orderHistory = orderItems.map(oi => ({
    id: oi.id,
    quantity: oi.quantity,
    price: oi.price,
    orderId: oi.orderId,
    order: oi.order
      ? {
        createdAt: oi.order.createdAt,
        customerName: oi.order.customerName,
        status: oi.order.status,
        orderNumber: oi.order.orderNumber,
      }
      : null,
  }));

  const reviewsRaw = await db.review.findMany({
    where: { productId, ...reviewWhereDateFilter },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const totalReviews = reviewsRaw.length;
  const avgRating = totalReviews
    ? reviewsRaw.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const reviewsList = reviewsRaw.map(r => ({
    id: r.id,
    user: r.user?.name || 'مستخدم غير معروف',
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));

  // Determine activity dates
  const timestamps = [productInfo.createdAt.getTime()];
  orderItems.forEach(oi => oi.order?.createdAt && timestamps.push(oi.order.createdAt.getTime()));
  if (reviewsRaw[0]) timestamps.push(new Date(reviewsRaw[0].createdAt).getTime());

  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps, Date.now()));

  // Prepare final product structure
  const finalProduct = {
    ...productInfo,
    supplierName,
    size: productInfo.size ?? null,
    details: productInfo.details ?? null,
    imageUrl: productInfo.imageUrl ?? null,
    productCode: productInfo.productCode ?? null,
    gtin: productInfo.gtin ?? null,
    material: productInfo.material ?? null,
    brand: productInfo.brand ?? null,
    color: productInfo.color ?? null,
    dimensions: productInfo.dimensions ?? null,
    weight: productInfo.weight ?? null,
    shippingDays: productInfo.shippingDays ?? null,
    careInstructions: productInfo.careInstructions ?? null,
    returnPeriodDays: productInfo.returnPeriodDays,
  };

  const totalCOGS = productInfo.costPrice
    ? orderItems.reduce((sum, oi) => sum + oi.quantity, 0) * productInfo.costPrice
    : 0;
  const totalProfit = totalRevenue - totalCOGS;
  const avgProfitMargin = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    product: finalProduct,
    totalRevenue,
    totalOrders: totalUniqueOrders,
    totalCustomers: totalUniqueCustomers,
    salesByMonth,
    orderHistory,
    reviews: { list: reviewsList, average: parseFloat(avgRating.toFixed(1)), count: totalReviews },
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    averageProfitMargin: parseFloat(avgProfitMargin.toFixed(2)),
    activityStartDate: startDate.toISOString().split('T')[0],
    activityEndDate: endDate.toISOString().split('T')[0],
  };
}

