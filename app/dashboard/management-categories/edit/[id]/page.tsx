import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { getCategoryById } from '../action/get-category-by-id';
import EditCategoryForm from '../compnent/EditCategoryForm';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryResult = await getCategoryById(id);

  // Defensive: Only render form if valid category object is returned
  if (!categoryResult || 'error' in categoryResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500 font-semibold">لم يتم العثور على التصنيف أو حدث خطأ.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-start items-center mb-4">
        <BackButton />
        {/* <h1 className="text-3xl font-bold ml-4">Edit Category: <span className="font-normal">{categoryResult.name}</span></h1> */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCategoryForm initialData={categoryResult} />
        </CardContent>
      </Card>
    </div>
  );
}
