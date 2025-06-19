# Form Handling Guide

## 🎯 Form Architecture Standards

This project uses **React Hook Form + Zod + Server Actions** for all form handling. This guide explains the complete pattern from validation to submission.

## 🏗️ Core Technologies

### Required Stack
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation and TypeScript integration
- **Next.js Server Actions** - Server-side form processing
- **Sonner** - Toast notifications for user feedback

## 📝 Form Creation Pattern

### 1. Define Zod Schema
Start with a Zod schema for validation and TypeScript types:

```typescript
// schemas/productSchema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string()
    .min(1, 'اسم المنتج مطلوب')
    .max(100, 'اسم المنتج طويل جداً'),
  description: z.string()
    .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
    .max(1000, 'الوصف طويل جداً')
    .optional(),
  price: z.number()
    .min(0.01, 'السعر يجب أن يكون أكبر من 0')
    .max(999999, 'السعر مرتفع جداً'),
  categoryId: z.string()
    .min(1, 'تصنيف المنتج مطلوب'),
  inStock: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export type CreateProductData = z.infer<typeof createProductSchema>;
```

### 2. Create Server Action
Build the server action with proper error handling:

```typescript
// app/dashboard/products/actions/createProduct.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createProductSchema } from '@/schemas/productSchema';

export async function createProduct(formData: FormData) {
  try {
    // Extract and parse form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      categoryId: formData.get('categoryId') as string,
      inStock: formData.get('inStock') === 'true',
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',') : [],
    };

    // Validate with Zod
    const validatedData = createProductSchema.parse(rawData);

    // Database operation
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug: generateSlug(validatedData.name),
      },
    });

    // Revalidate cache
    revalidatePath('/dashboard/products');
    
    return {
      success: true,
      message: 'تم إنشاء المنتج بنجاح',
      data: product,
    };
  } catch (error) {
    console.error('Error creating product:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'بيانات غير صحيحة',
        errors: error.errors.reduce((acc, err) => {
          acc[err.path[0] as string] = err.message;
          return acc;
        }, {} as Record<string, string>),
      };
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        message: 'منتج بهذا الاسم موجود بالفعل',
      };
    }

    // Generic error
    return {
      success: false,
      message: 'حدث خطأ أثناء إنشاء المنتج',
    };
  }
}
```

### 3. Build Form Component
Create the form component with React Hook Form:

```typescript
// app/dashboard/products/components/ProductForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createProductSchema, type CreateProductData } from '@/schemas/productSchema';
import { createProduct } from '../actions/createProduct';

interface ProductFormProps {
  initialData?: Partial<CreateProductData>;
  onSuccess?: () => void;
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateProductData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      inStock: true,
      tags: [],
    },
  });

  // Server Action integration
  const [state, formAction, isPending] = useActionState(createProduct, {
    success: false,
    message: '',
    errors: {},
  });

  // Handle server action response
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      reset(); // Clear form
      onSuccess?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, reset, onSuccess]);

  // Form submission handler
  const onSubmit = async (data: CreateProductData) => {
    const formData = new FormData();
    
    // Convert form data to FormData object
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="أدخل اسم المنتج"
          className={errors.name ? 'border-destructive' : ''}
        />
        {(errors.name || state.errors?.name) && (
          <p className="text-sm text-destructive">
            {errors.name?.message || state.errors?.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="وصف المنتج (اختياري)"
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        {(errors.description || state.errors?.description) && (
          <p className="text-sm text-destructive">
            {errors.description?.message || state.errors?.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">السعر (ر.س) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          placeholder="0.00"
          className={errors.price ? 'border-destructive' : ''}
        />
        {(errors.price || state.errors?.price) && (
          <p className="text-sm text-destructive">
            {errors.price?.message || state.errors?.price}
          </p>
        )}
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">التصنيف *</Label>
        <CategorySelect
          value={watch('categoryId')}
          onValueChange={(value) => setValue('categoryId', value)}
          error={errors.categoryId?.message || state.errors?.categoryId}
        />
      </div>

      {/* In Stock Checkbox */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Checkbox
          id="inStock"
          {...register('inStock')}
          defaultChecked={watch('inStock')}
        />
        <Label htmlFor="inStock">متوفر في المخزن</Label>
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Label htmlFor="tags">الكلمات المفتاحية</Label>
        <TagsInput
          value={watch('tags') || []}
          onChange={(tags) => setValue('tags', tags)}
          placeholder="أضف كلمات مفتاحية..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          إعادة تعيين
        </Button>
        <Button type="submit" disabled={isSubmitting || isPending}>
          {isSubmitting || isPending ? 'جاري الحفظ...' : 'إنشاء المنتج'}
        </Button>
      </div>
    </form>
  );
}
```

## 🎨 Custom Form Components

### Category Select Component
```typescript
// components/forms/CategorySelect.tsx
'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export default function CategorySelect({ value, onValueChange, error }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="space-y-1">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={isLoading ? 'جاري التحميل...' : 'اختر التصنيف'} />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

### Tags Input Component
```typescript
// components/forms/TagsInput.tsx
'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rtl:mr-1 rtl:ml-0"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔄 Form Patterns

### Edit Form Pattern
```typescript
// For editing existing data
export default function EditProductForm({ productId }: { productId: string }) {
  const [initialData, setInitialData] = useState<CreateProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        setInitialData({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          inStock: product.inStock,
          tags: product.tags,
        });
      } catch (error) {
        toast.error('فشل في تحميل بيانات المنتج');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <ProductFormSkeleton />;
  }

  return <ProductForm initialData={initialData} />;
}
```

### Multi-Step Form Pattern
```typescript
// For complex forms with multiple steps
export default function MultiStepProductForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateProductData>>({});

  const steps = [
    { title: 'المعلومات الأساسية', component: BasicInfoStep },
    { title: 'التفاصيل', component: DetailsStep },
    { title: 'المراجعة', component: ReviewStep },
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} steps={steps} />
      
      <div className="min-h-[400px]">
        {steps.map((step, index) => (
          <div key={index} className={currentStep === index ? 'block' : 'hidden'}>
            <step.component
              data={formData}
              onChange={setFormData}
              onNext={nextStep}
              onPrev={prevStep}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🧪 Form Testing

### Testing Form Components
```typescript
// __tests__/ProductForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductForm from '../ProductForm';

describe('ProductForm', () => {
  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<ProductForm />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /إنشاء المنتج/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('اسم المنتج مطلوب')).toBeInTheDocument();
      expect(screen.getByText('السعر يجب أن يكون أكبر من 0')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    
    render(<ProductForm onSuccess={mockOnSuccess} />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/اسم المنتج/), 'منتج تجريبي');
    await user.type(screen.getByLabelText(/السعر/), '99.99');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /إنشاء المنتج/ }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
```

## 🚫 Common Mistakes to Avoid

### ❌ Bad Practices
```typescript
// ❌ BAD - No validation
function BadForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // No validation, direct submission
    submitData(e.target.name.value);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// ❌ BAD - Mixed validation approaches
function ConfusedForm() {
  const [errors, setErrors] = useState({});
  // Using both manual validation AND React Hook Form
  const { register } = useForm();
  // This creates conflicts and complexity
}
```

### ✅ Good Practices
```typescript
// ✅ GOOD - Consistent validation with Zod + RHF
function GoodForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data) => {
    // Clean, validated data
    processForm(data);
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

This comprehensive form handling approach ensures consistent, validated, and user-friendly forms across the entire application. 