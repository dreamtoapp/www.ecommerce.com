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

## 🎨 UI Components & Forms Rules

### 🃏 Card Design System

#### 🎨 Standard Card Structure
**ALL cards MUST follow this consistent pattern:**

```tsx
<Card className="shadow-lg border-l-4 border-l-[COLOR]">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-xl">
      <Icon className="h-5 w-5 text-[COLOR]" />
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### 📋 **STANDARDIZED HEADER LAYOUT PATTERN**

**ALL dashboard pages MUST use this clean header layout:**

```tsx
{/* Clean Header Card */}
<div className="bg-muted/30 rounded-lg shadow-sm border-0 p-6">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    {/* Left side - Title with BackButton */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <BackButton variant="default" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            Page Title
          </h1>
          <p className="text-sm text-muted-foreground">
            Page description
          </p>
        </div>
      </div>
      
      {/* Status Badge (if applicable) */}
      <Badge className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-[COLOR]-50 text-[COLOR]-800 border border-[COLOR]-200">
        <Icon className="w-4 h-4" />
        Status Text
      </Badge>
    </div>

    {/* Right side - Action Buttons (if applicable) */}
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Action buttons here */}
    </div>
  </div>
</div>
```

#### 🎯 **Header Layout Rules:**

1. **BackButton Position**: ALWAYS beside the title, never on separate line
2. **Container**: Use `bg-muted/30 rounded-lg shadow-sm border-0 p-6`
3. **Responsive**: Stacks vertically on mobile, horizontal on desktop
4. **Spacing**: Use `gap-3` between BackButton and title content
5. **Title Structure**: 
   - Main title: `text-2xl font-bold text-foreground`
   - Subtitle: `text-sm text-muted-foreground`
6. **Status Badges**: Use appropriate color scheme matching page context
7. **Action Buttons**: Right-aligned, responsive stacking

#### 🌈 **Status Badge Colors by Page Type:**

- **Pending Orders**: `bg-amber-50 text-amber-800 border-amber-200`
- **Delivered Orders**: `bg-green-50 text-green-800 border-green-200`
- **Cancelled Orders**: `bg-red-50 text-red-800 border-red-200`
- **In Transit Orders**: `bg-blue-50 text-blue-800 border-blue-200`
- **Products**: `bg-emerald-50 text-emerald-800 border-emerald-200`
- **Users**: `bg-indigo-50 text-indigo-800 border-indigo-200`
- **Analytics**: `bg-purple-50 text-purple-800 border-purple-200`

#### ✅ **Implementation Checklist:**
- [ ] BackButton positioned beside title (not separate line)
- [ ] Clean container with `bg-muted/30` background
- [ ] Responsive layout (mobile stack, desktop horizontal)
- [ ] Proper spacing with `gap-3` and `gap-4`
- [ ] Status badge with appropriate colors
- [ ] Action buttons right-aligned
- [ ] Consistent typography hierarchy
- [ ] RTL support maintained

### 🌈 Color System for Cards

#### Primary Colors (Main Features)
- **Blue (`blue-500`)** - User management, profiles, authentication
- **Green (`green-500`)** - Products, categories, success states
- **Purple (`purple-500`)** - Analytics, reports, dashboards
- **Orange (`orange-500`)** - Settings, configuration, system
- **Red (`red-500`)** - Alerts, errors, critical actions
- **Indigo (`indigo-500`)** - Orders, transactions, commerce
- **Teal (`teal-500`)** - Communications, notifications, messages

#### Secondary Colors (Supporting Features)
- **Pink (`pink-500`)** - Promotions, marketing, special offers
- **Yellow (`yellow-500`)** - Warnings, pending states
- **Cyan (`cyan-500`)** - Data import/export, integrations
- **Slate (`slate-500`)** - General information, documentation

### 🎯 Card Examples by Feature

#### User Management
```tsx
<Card className="shadow-lg border-l-4 border-l-blue-500">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-xl">
      <Users className="h-5 w-5 text-blue-500" />
      إدارة المستخدمين
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* User management content */}
  </CardContent>
</Card>
```

#### Product Management
```tsx
<Card className="shadow-lg border-l-4 border-l-green-500">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-xl">
      <Package className="h-5 w-5 text-green-500" />
      إدارة المنتجات
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Product management content */}
  </CardContent>
</Card>
```

### 📐 Spacing & Layout Standards

- **ALWAYS use `gap` for flex layouts** instead of `space-x` or `space-x-reverse`
- Use `gap-3` (12px) for radio buttons and checkboxes with their labels
- Use `gap-2` (8px) for small components and icons
- Use `gap-4` (16px) for medium spacing between components
- Use `gap-6` (24px) for larger section spacing
- **Avoid `space-x-reverse`** - it causes RTL layout issues
- Use CSS Grid `gap` for grid layouts instead of margins

### ✅ Correct Examples:
```tsx
// Radio buttons with labels
<div className="flex items-center gap-3">
  <RadioGroupItem value="option1" id="option1" />
  <Label htmlFor="option1">Option Text</Label>
</div>

// Checkbox with label
<div className="flex items-center gap-3">
  <Checkbox id="checkbox1" />
  <Label htmlFor="checkbox1">Checkbox Text</Label>
</div>

// Icon with text
<div className="flex items-center gap-2">
  <Icon className="h-4 w-4" />
  <span>Text</span>
</div>
```

### ❌ Avoid:
```tsx
// Don't use space-x-reverse (RTL issues)
<div className="flex items-center space-x-2 space-x-reverse">
  <Checkbox />
  <Label>Text</Label>
</div>
```

## 📝 Form Handling

- Use `react-hook-form` with `zod` for validation
- Prefer server components + server actions for forms
- Implement proper form validation and error handling
- Use accessible form patterns and ARIA labels

## 🔧 Component Architecture

- Create reusable components in `components/ui/`
- Route-specific components in their respective folders
- Use composition over inheritance
- Keep components focused and single-purpose

## 🎯 Form Validation

- Use Zod schemas for type-safe validation
- Implement client-side and server-side validation
- Provide clear error messages
- Handle form submission states properly

## ♿ Accessibility

- Follow WCAG guidelines
- Use semantic HTML elements
- Implement proper keyboard navigation
- Ensure sufficient color contrast
- Add proper ARIA labels and roles

This guide ensures consistent, high-quality component creation across the entire project. 