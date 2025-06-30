/**
 * Get status display information for consistent UI
 * This is a utility function that doesn't need to be a server action
 */
export function getStatusInfo(status: string) {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return {
        icon: 'Clock',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        label: 'قيد الانتظار'
      };
    case 'ASSIGNED':
      return {
        icon: 'Package',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20',
        label: 'تم التعيين'
      };
    case 'IN_TRANSIT':
      return {
        icon: 'TrendingUp',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
        label: 'في الطريق'
      };
    case 'DELIVERED':
      return {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        label: 'تم التوصيل'
      };
    case 'CANCELED':
      return {
        icon: 'XCircle',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        label: 'ملغي'
      };
    default:
      return {
        icon: 'Package',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/20',
        borderColor: 'border-muted',
        label: status
      };
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get order status color for enhanced design system
 */
export function getOrderStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'text-feature-suppliers';
    case 'ASSIGNED':
      return 'text-feature-settings';
    case 'IN_TRANSIT':
      return 'text-feature-commerce';
    case 'DELIVERED':
      return 'text-feature-products';
    case 'CANCELED':
      return 'text-feature-analytics';
    default:
      return 'text-muted-foreground';
  }
} 