/**
 * Calculate remaining time for order cancellation (1 hour limit)
 */
export function calculateRemainingTime(orderCreatedAt: Date): {
  canCancel: boolean;
  remainingMinutes: number | null;
  remainingSeconds: number | null;
  isExpired: boolean;
} {
  const currentTime = new Date();
  const orderCreated = new Date(orderCreatedAt);
  const timeDifference = currentTime.getTime() - orderCreated.getTime();
  const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

  if (timeDifference > oneHourInMs) {
    return {
      canCancel: false,
      remainingMinutes: null,
      remainingSeconds: null,
      isExpired: true,
    };
  }

  const remainingTime = oneHourInMs - timeDifference;
  const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
  const remainingSeconds = Math.ceil(remainingTime / 1000);

  return {
    canCancel: true,
    remainingMinutes,
    remainingSeconds,
    isExpired: false,
  };
}

/**
 * Format remaining time for display
 */
export function formatRemainingTime(remainingMinutes: number): string {
  if (remainingMinutes >= 60) {
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    return `${hours} ساعة ${minutes > 0 ? `و ${minutes} دقيقة` : ''}`;
  }
  return `${remainingMinutes} دقيقة`;
}

/**
 * Check if order is eligible for cancellation
 */
export function isOrderEligibleForCancellation(
  orderStatus: string,
  orderCreatedAt: Date
): boolean {
  if (orderStatus !== 'PENDING') {
    return false;
  }

  const { canCancel } = calculateRemainingTime(orderCreatedAt);
  return canCancel;
}

/**
 * Get time until expiration for display
 */
export function getTimeUntilExpiration(orderCreatedAt: Date): string {
  const { isExpired, remainingMinutes } = calculateRemainingTime(orderCreatedAt);
  
  if (isExpired) {
    return 'انتهت مهلة الإلغاء';
  }

  return formatRemainingTime(remainingMinutes || 0);
} 