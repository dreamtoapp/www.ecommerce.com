import { getCart } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartItemControls from "./CartItemControls";

export default async function ServerCartView() {
    const cart = await getCart();
    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);

    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    سلة التسوق
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">سلتك فارغة</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-feature-commerce-soft rounded-lg border border-feature-commerce/20">
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{item.product?.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.product?.price?.toLocaleString()} ر.س × {item.quantity}
                                    </div>
                                    <div className="text-sm font-medium text-feature-commerce">
                                        المجموع: {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} ر.س
                                    </div>
                                </div>
                                <CartItemControls
                                    itemId={item.id}
                                    currentQuantity={item.quantity || 1}
                                    productName={item.product?.name || ''}
                                />
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t-2 border-feature-commerce/30 mt-4">
                            <span className="text-xl font-bold">الإجمالي</span>
                            <span className="text-2xl font-bold text-feature-commerce">{total.toLocaleString()} ر.س</span>
                        </div>
                        <Button className="w-full mt-4 btn-save text-lg py-3">
                            متابعة للدفع
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 