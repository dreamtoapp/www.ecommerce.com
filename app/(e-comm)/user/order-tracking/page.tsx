import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { getUserAccountData, OrderData } from '../account/actions';
import { getStatusInfo, formatCurrency } from '../account/helpers';
import Image from 'next/image';
import { auth } from '@/auth';
import { Clock, Package, TrendingUp, CheckCircle } from 'lucide-react';
import CancelOrderButton from './components/CancelOrderButton';

const STATUS_STEPS = [
    { key: 'PENDING', label: 'قيد الانتظار', icon: Clock },
    { key: 'ASSIGNED', label: 'تم التعيين', icon: Package },
    { key: 'IN_TRANSIT', label: 'في الطريق', icon: TrendingUp },
    { key: 'DELIVERED', label: 'تم التوصيل', icon: CheckCircle },
];

function getStatusIndex(status: string) {
    return STATUS_STEPS.findIndex(s => s.key === status.toUpperCase());
}

export default async function OrderTrackingPage() {
    const session = await auth();
    if (!session?.user) {
        // Optionally redirect to login
        return <div className="py-12 text-center text-muted-foreground">الرجاء تسجيل الدخول لعرض تتبع الطلبات.</div>;
    }
    const userId = session.user?.id ?? '';
    const accountData = await getUserAccountData(userId);
    const orders = accountData?.orders || [];

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <BackButton variant="default" className="mb-6" />
            <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect card-border-glow mb-8">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        تتبع الطلبات
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">تابع حالة جميع طلباتك خطوة بخطوة.</p>
                </CardContent>
            </Card>
            {orders.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">لا توجد طلبات لعرضها حالياً.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: OrderData) => {
                        const statusIdx = getStatusIndex(order.status);
                        const statusInfo = getStatusInfo(order.status);
                        const firstItem = order.items[0];
                        const productName = firstItem?.productName || 'منتج';
                        const productImageUrl = firstItem?.productImageUrl || '/fallback/product-fallback.avif';
                        return (
                            <Card key={order.id} className="shadow-md border-l-4 border-l-feature-commerce card-hover-effect">
                                <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">طلب #{order.orderNumber}</span>
                                        <span className="text-xs text-muted-foreground">{(order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusInfo.color} bg-white/10 border ${statusInfo.borderColor}`}>{statusInfo.label}</span>
                                        <CancelOrderButton
                                            orderId={order.id}
                                            orderNumber={order.orderNumber}
                                            orderCreatedAt={order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)}
                                            orderStatus={order.status}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-feature-products bg-feature-products-soft shadow-md">
                                            <Image
                                                src={productImageUrl}
                                                alt={productName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">{productName}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{order.items.length > 1 ? `و${order.items.length - 1} منتج آخر` : ''}</div>
                                        </div>
                                        <div className="text-sm font-bold text-success whitespace-nowrap">{formatCurrency(order.amount)}</div>
                                    </div>
                                    {/* Status Stepper */}
                                    <div className="flex items-center justify-between gap-2 mt-2 mb-1">
                                        {STATUS_STEPS.map((step, idx) => {
                                            const isActive = idx === statusIdx;
                                            const isCompleted = idx < statusIdx;
                                            const isFuture = idx > statusIdx;
                                            const Icon = step.icon;
                                            return (
                                                <div key={step.key} className="flex-1 flex flex-col items-center">
                                                    <div className={`rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${isCompleted ? 'bg-feature-commerce text-white border-feature-commerce' : ''}
                            ${isActive ? 'bg-white text-feature-commerce border-feature-commerce shadow-lg scale-110' : ''}
                            ${isFuture ? 'bg-muted text-muted-foreground border-muted' : ''}
                            h-9 w-9 mb-1 icon-enhanced`}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <span className={`text-xs mt-1 ${isActive ? 'font-bold text-feature-commerce' : 'text-muted-foreground'}`}>{step.label}</span>
                                                    {idx < STATUS_STEPS.length - 1 && (
                                                        <div className={`w-full h-1 mt-1 ${isCompleted ? 'bg-feature-commerce' : 'bg-muted'}`}></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 