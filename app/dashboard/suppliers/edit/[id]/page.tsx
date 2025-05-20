import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import db from '@/lib/prisma';
import { iconVariants } from '@/lib/utils';

import EditSupplierForm from './edit-supplier-form';

interface EditSupplierPageProps {
  params: Promise<{ id: string }>;
}

async function getSupplierById(id: string) {
  try {
    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        // Add necessary relations
      },
    });

    if (!supplier) {
      notFound();
    }
    return supplier;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch supplier');
  }
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  try {
    // Resolve params promise
    const { id } = await params;

    // Fetch supplier data
    const supplier = await getSupplierById(id);

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            تعديل المورد: {supplier.name}
          </h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/suppliers" className="flex items-center gap-2">
              <ArrowRight className={iconVariants({ size: 'sm' })} />
              <span>العودة إلى قائمة الموردين</span>
            </Link>
          </Button>
        </div>
        <EditSupplierForm supplier={supplier} />
      </div>
    );
  } catch (error) {
    console.error('Error loading supplier:', error);

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            خطأ في تحميل البيانات
          </h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/suppliers" className="flex items-center gap-2">
              <ArrowRight className={iconVariants({ size: 'sm' })} />
              <span>العودة إلى قائمة الموردين</span>
            </Link>
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل بيانات المورد
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}