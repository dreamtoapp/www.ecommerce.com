import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { redirect } from "next/navigation";
import CheckoutForm from "./components/CheckoutForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

// Force dynamic rendering for checkout page since it uses cookies/session
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }
  const total = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );
  return (
    <div className="max-w-4xl mx-auto py-8 flex flex-col gap-6">
      <Card className="shadow-lg border-l-4 border-feature-commerce">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-feature-commerce" />
            مراجعة الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.product?.name}</span>
              <span>
                {(item.product?.price || 0).toLocaleString()} × {item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-4">
            <span>الإجمالي</span>
            <span>{total.toLocaleString()} ر.س</span>
          </div>
        </CardContent>
      </Card>
      <CheckoutForm />
    </div>
  );
}
