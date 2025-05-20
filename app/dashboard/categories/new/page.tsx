import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// import { getCategories } from '../actions/get-categories';
import NewCategoryForm from './componen/NewCategoryForm';

export const metadata = {
  title: "Add New Category | Admin Dashboard",
  description: "Create a new product category.",
};

export default async function NewCategoryPage() {
  // const categoriesResult = await getCategories();


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-3xl font-bold ml-4">إضافة تصنيف جديد</h1>
        <BackButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التصنيف</CardTitle>
        </CardHeader>
        <CardContent>
          <NewCategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
