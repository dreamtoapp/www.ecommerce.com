import BackButton from '@/components/BackButton';

import { getPromotionsReportData } from './action/getPromotionsReportData';
import PromotionsReportClient from './component/PromotionsReportClient';

export const dynamic = 'force-dynamic';
interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}

export default async function PromotionsReportPage({ searchParams }: PageProps) {
  try {
    // Resolve searchParams promise
    const params = await searchParams;
    const { from, to } = params;

    // Fetch data with error handling
    const data = await getPromotionsReportData({ from, to });

    return (
      <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-3xl font-bold text-foreground'>تقرير العروض الترويجية</h1>
          <BackButton />
        </div>
        <PromotionsReportClient
          {...data}
          initialFrom={from}
          initialTo={to}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading promotions report:', error);

    return (
      <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-3xl font-bold text-foreground'>تقرير العروض الترويجية</h1>
          <BackButton />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل التقرير
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}