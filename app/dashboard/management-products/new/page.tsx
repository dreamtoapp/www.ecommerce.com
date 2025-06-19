import { Plus } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { getProductFormData, type DataFetchResult } from './actions/getProductData';
import ProductUpsert from './components/ProductUpsert';
import ProductFormFallback from './components/ProductFormFallback';

// Utility functions moved inline to resolve import issues
function canCreateProduct(data: DataFetchResult): boolean {
  return data.success && data.categories.length > 0;
}

function getFormErrorMessage(data: DataFetchResult): string | null {
  if (data.success) return null;

  if (data.categories.length === 0 && data.suppliers.length === 0) {
    return 'لا يمكن إضافة منتج جديد. يرجى إضافة فئات وموردين أولاً.';
  }

  if (data.categories.length === 0) {
    return 'لا يمكن إضافة منتج بدون فئة. يرجى إضافة فئة واحدة على الأقل.';
  }

  return data.error;
}

/**
 * New Product Page Component
 * 
 * Uses route-level loading.tsx instead of Suspense for better UX
 * loading.tsx shows during navigation, this component handles data fetching
 */
export default async function NewProductPage() {
  // Fetch product form data using the proper data access layer
  const productData = await getProductFormData();

  // Handle error cases with proper fallback UI
  if (!canCreateProduct(productData)) {
    const errorMessage = getFormErrorMessage(productData);

    return (
      <div className="flex min-h-screen flex-col p-4 md:p-6 animate-in fade-in-50 duration-500">
        {/* Enhanced Header with BackButton */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton
              variant="minimal"
              fallbackUrl="/dashboard/management-products"
              className="card-hover-effect"
            />
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-feature-products icon-enhanced" />
              <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
            </div>
          </div>
        </header>

        <ProductFormFallback
          errorMessage={errorMessage || 'حدث خطأ غير متوقع'}
          hasCategories={productData.categories.length > 0}
          hasSuppliers={productData.suppliers.length > 0}
        />
      </div>
    );
  }

  // Successful case - render the product form
  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6 animate-in fade-in-50 duration-500">
      {/* Enhanced Header with Professional BackButton */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton
            variant="default"
            fallbackUrl="/dashboard/management-products"
            className="btn-professional"
          />
          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-feature-products icon-enhanced" />
            <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
          </div>
        </div>
      </header>

      {/* Enhanced Product Form Container */}
      <div className="flex-1 card-hover-effect">
        <ProductUpsert
          mode="new"
          defaultValues={{
            name: '',
            supplierId: '',
            categoryIds: []
          }}
          categories={productData.categories}
          suppliers={productData.suppliers}
        />
      </div>
    </div>
  );
}

/**
 * Metadata for the page
 */
export const metadata = {
  title: 'إضافة منتج جديد | لوحة التحكم',
  description: 'إضافة منتج جديد إلى متجر التجارة الإلكترونية',
};
