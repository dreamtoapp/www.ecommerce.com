# Component Creation Guide

## 🏗️ Component Architecture Standards

This guide explains how to create components that follow our project's architectural patterns and best practices.

## 📁 File Organization

### Component Placement Rules
- **Global reusable components**: `components/ui/` (shadcn/ui based)
- **Feature-specific components**: `components/[feature]/` (e.g., `components/ecomm/`, `components/dashboard/`)
- **Route-specific components**: `app/[route]/components/` (only used in that route)

### File Naming Conventions
- **PascalCase for files**: `UserProfileCard.tsx`, `ProductImageGallery.tsx`
- **Match component name**: File name should match the default export
- **Descriptive names**: Avoid generic names like `Card.tsx` or `Button.tsx`

## 🎯 Component Types

### 1. Server Components (Default)
Use for components that don't need interactivity:

```typescript
// ✅ GOOD - Server Component
import { prisma } from '@/lib/prisma';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  categoryId?: string;
  limit?: number;
}

export default async function ProductGrid({ categoryId, limit = 12 }: ProductGridProps) {
  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId } : {},
    take: limit,
    include: { category: true },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Client Components (When Required)
Use `'use client'` only when you need:
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect)
- Third-party libraries requiring browser environment

```typescript
// ✅ GOOD - Client Component with clear need for interactivity
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addToCart } from '@/store/cartStore';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`تمت إضافة ${product.name} إلى السلة`);
    } catch (error) {
      toast.error('فشل في إضافة المنتج إلى السلة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
    </Button>
  );
}
```

## 🔧 Component Structure

### Standard Component Template
```typescript
// ✅ GOOD - Standard component structure
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Props interface with clear documentation
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  showAddToCart?: boolean;
  className?: string;
  onProductClick?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  showAddToCart = true,
  className,
  onProductClick 
}: ProductCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}>
      <div className="p-4 space-y-3">
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
        )}
        
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
          <p className="text-2xl font-bold text-primary">
            {product.price} ر.س
          </p>
        </div>

        {showAddToCart && (
          <AddToCartButton product={product} className="w-full" />
        )}
      </div>
    </div>
  );
}
```

## 🌍 Internationalization

### Using next-intl in Components
```typescript
// ✅ GOOD - Internationalized component
import { useTranslations } from 'next-intl';

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.price} {t('currency')}</p>
      <button>{t('addToCart')}</button>
    </div>
  );
}
```

### Server Component Internationalization
```typescript
// ✅ GOOD - Server component with translations
import { getTranslations } from 'next-intl/server';

export default async function ProductGrid() {
  const t = await getTranslations('products');

  return (
    <section>
      <h2>{t('featuredProducts')}</h2>
      {/* Product grid content */}
    </section>
  );
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices
```typescript
// ✅ GOOD - Responsive and accessible styling
export default function ProductGrid() {
  return (
    <div 
      className={cn(
        // Base styles
        "grid gap-4 p-4",
        // Responsive grid
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        // RTL support
        "ltr:text-left rtl:text-right"
      )}
    >
      {/* Content */}
    </div>
  );
}
```

### Using CSS Variables
```typescript
// ✅ GOOD - Using design system variables
<div className="bg-background text-foreground border-border">
  <h2 className="text-primary">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>
```

## 🔄 State Management

### Local State
```typescript
// ✅ GOOD - Local state management
'use client';

import { useState, useEffect } from 'react';

export default function ProductFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Effect for handling state changes
  useEffect(() => {
    // Apply filters
  }, [selectedCategory, priceRange]);

  return (
    <div className="space-y-4">
      {/* Filter UI */}
    </div>
  );
}
```

### Global State (Zustand)
```typescript
// ✅ GOOD - Using Zustand store
'use client';

import { useCartStore } from '@/store/cartStore';

export default function CartSummary() {
  const { items, total, clearCart } = useCartStore();

  return (
    <div className="space-y-4">
      <p>المجموع: {total} ر.س</p>
      <button onClick={clearCart}>مسح السلة</button>
    </div>
  );
}
```

## 📝 Forms Integration

### Using React Hook Form
```typescript
// ✅ GOOD - Form component with validation
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'اسم المنتج مطلوب'),
  price: z.number().min(0.01, 'السعر يجب أن يكون أكبر من 0'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('name')} placeholder="اسم المنتج" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      
      <div>
        <input {...register('price', { valueAsNumber: true })} type="number" placeholder="السعر" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <button type="submit">حفظ</button>
    </form>
  );
}
```

## ♿ Accessibility

### ARIA Labels and Semantic HTML
```typescript
// ✅ GOOD - Accessible component
export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      aria-labelledby="products-heading"
    >
      <h2 id="products-heading" className="sr-only">
        قائمة المنتجات
      </h2>
      
      {products.map(product => (
        <article key={product.id} className="product-card">
          <img 
            src={product.imageUrl} 
            alt={`صورة ${product.name}`}
            className="w-full h-48 object-cover"
          />
          <h3>{product.name}</h3>
          <button aria-label={`إضافة ${product.name} إلى السلة`}>
            إضافة إلى السلة
          </button>
        </article>
      ))}
    </section>
  );
}
```

## 🧪 Testing Components

### Component Testing
```typescript
// ✅ GOOD - Component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  imageUrl: '/test-image.jpg',
};

describe('ProductCard', () => {
  it('should display product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('99.99 ر.س')).toBeInTheDocument();
  });

  it('should handle add to cart click', async () => {
    const user = userEvent.setup();
    const mockAddToCart = jest.fn();
    
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockAddToCart}
      />
    );

    await user.click(screen.getByRole('button', { name: /إضافة إلى السلة/ }));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

## 📊 Performance Optimization

### Memoization
```typescript
// ✅ GOOD - Memoized component
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      {/* Component content */}
    </div>
  );
});

export default ProductCard;
```

### Image Optimization
```typescript
// ✅ GOOD - Optimized images
import Image from 'next/image';

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative aspect-square">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg"
      />
    </div>
  );
}
```

## 🚫 Common Mistakes to Avoid

### ❌ Bad Practices
```typescript
// ❌ BAD - Unnecessary 'use client'
'use client';
export default function StaticProductList({ products }) {
  return <div>{products.map(p => <div key={p.id}>{p.name}</div>)}</div>;
}

// ❌ BAD - No TypeScript
export default function ProductCard({ product }) {
  return <div>{product.name}</div>;
}

// ❌ BAD - Inline styles instead of Tailwind
export default function ProductCard() {
  return <div style={{ padding: '16px', color: 'blue' }}>Content</div>;
}
```

### ✅ Good Practices
```typescript
// ✅ GOOD - Server component (no 'use client' needed)
export default function StaticProductList({ products }: { products: Product[] }) {
  return (
    <div className="space-y-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded">
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

This guide ensures consistent, high-quality component creation across the entire project. 