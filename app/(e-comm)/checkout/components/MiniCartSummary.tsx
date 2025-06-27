"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  Receipt,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../../../../lib/formatCurrency';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  } | null;
}

interface CartData {
  items: CartItem[];
}

export default function MiniCartSummary() {
  const [showItems, setShowItems] = useState(false);
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cart');

        // Check if response is ok
        if (!response.ok) {
          console.error('Cart API response not ok:', response.status, response.statusText);
          setCart({ items: [] });
          return;
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Cart API response is not JSON:', contentType);
          setCart({ items: [] });
          return;
        }

        // Get response text first to check if it's empty
        const responseText = await response.text();
        if (!responseText || responseText.trim() === '') {
          console.error('Cart API response is empty');
          setCart({ items: [] });
          return;
        }

        // Parse JSON safely
        try {
          const data = JSON.parse(responseText);
          setCart(data || { items: [] });
        } catch (jsonError) {
          console.error('Failed to parse cart JSON:', jsonError, 'Response text:', responseText);
          setCart({ items: [] });
        }

      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart({ items: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-l-4 border-feature-commerce">
        <CardHeader className="pb-4">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = subtotal >= 200 ? 0 : 25; // Free delivery over 200 SAR
  const taxRate = 0.15;
  const taxAmount = (subtotal + deliveryFee) * taxRate;
  const total = subtotal + deliveryFee + taxAmount;
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const savings = subtotal >= 200 ? 25 : 0; // Show savings if free delivery

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-l-4 border-feature-commerce sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-feature-commerce" />
            ملخص الطلب
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-feature-commerce-soft text-feature-commerce">
              {totalItems} منتج
            </Badge>
            {savings > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                توصيل مجاني!
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pricing Breakdown */}
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>الإجمالي الفرعي</span>
              </div>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            {/* Delivery Fee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>رسوم التوصيل</span>
                {deliveryFee === 0 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    مجاني
                  </Badge>
                )}
              </div>
              <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                {deliveryFee === 0 ? (
                  <span className="flex items-center gap-1">
                    <span className="line-through text-muted-foreground text-xs">25.00</span>
                    <span className="text-green-600">مجاني</span>
                  </span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>

            {/* Free Delivery Progress */}
            {deliveryFee > 0 && (
              <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                أضف {formatCurrency(200 - subtotal)} للحصول على توصيل مجاني
                <div className="w-full bg-muted h-1 rounded mt-1">
                  <div
                    className="bg-feature-commerce h-1 rounded transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Tax */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Percent className="h-4 w-4" />
                <span>ضريبة القيمة المضافة (15%)</span>
              </div>
              <span className="font-medium">{formatCurrency(taxAmount)}</span>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-feature-commerce" />
                <span>الإجمالي النهائي</span>
              </div>
              <span className="text-feature-commerce">{formatCurrency(total)}</span>
            </div>
          </div>

          <Separator />

          {/* Cart Items Toggle */}
          <Button
            variant="outline"
            className="w-full justify-between h-10"
            onClick={() => setShowItems(!showItems)}
          >
            <span>{showItems ? 'إخفاء المنتجات' : 'عرض المنتجات'}</span>
            {showItems ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Cart Items List */}
          {showItems && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pt-2"
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-feature-commerce-soft rounded flex items-center justify-center">
                      <Package className="h-4 w-4 text-feature-commerce" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product?.name || 'منتج غير معروف'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.product?.price || 0)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span>🔒</span>
              <span className="font-medium">معاملة آمنة</span>
            </div>
            <span>جميع بياناتك محمية ومشفرة</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
