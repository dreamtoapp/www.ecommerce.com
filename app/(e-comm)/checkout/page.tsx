import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import CheckoutForm from "./components/CheckoutForm";
import MiniCartSummary from "./components/MiniCartSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowRight } from "lucide-react";
import BackButton from "@/components/BackButton";

// Force dynamic rendering for checkout page since it uses cookies/session
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <BackButton variant="minimal" />
            <div>
              <h1 className="text-2xl font-bold">إتمام الطلب</h1>
              <p className="text-muted-foreground">أكمل بياناتك لإتمام عملية الشراء</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>سلة التسوق</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-feature-commerce font-medium">إتمام الطلب</span>
            <ArrowRight className="h-3 w-3" />
            <span>تأكيد الطلب</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <MiniCartSummary />

              {/* Security & Trust Indicators */}
              <Card className="mt-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>🔒</span>
                      <span>SSL آمن - بياناتك محمية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>تأكيد الطلب عبر الرسائل النصية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚚</span>
                      <span>توصيل سريع وموثوق</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💳</span>
                      <span>دفع آمن - نقداً عند الاستلام</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Summary - Show on mobile only */}
        <div className="lg:hidden mt-8">
          <Card className="shadow-lg border-l-4 border-feature-commerce">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-feature-commerce" />
                ملخص سريع للطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate">{item.product?.name}</span>
                  <span className="font-medium">
                    {(item.product?.price || 0).toLocaleString()} × {item.quantity}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-3">
                <span>الإجمالي المؤقت</span>
                <span>
                  {cart.items.reduce(
                    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
                    0
                  ).toLocaleString()} ر.س
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * الإجمالي النهائي يشمل الضريبة ورسوم التوصيل
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
