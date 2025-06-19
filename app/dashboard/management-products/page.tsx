
import { fetchFilteredProducts } from './actions/fetchFilteredProducts';
import PaginationControls from './components/PaginationControls';
import ProductCard from './components/ProductCard';
import ProductFilterForm from './components/ProductFilterForm';
import Link from '@/components/link';



type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

export default async function ProductsControlPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  // Parse filters and pagination from searchParams
  const name = getStringParam(searchParams.name);
  const supplierId = getStringParam(searchParams.supplierId);
  const status = getStringParam(searchParams.status) || 'all';
  const type = getStringParam(searchParams.type) || 'all';
  const stock = getStringParam(searchParams.stock) || 'all';
  const page = parseInt(getStringParam(searchParams.page) || '1', 10);
  const pageSize = parseInt(getStringParam(searchParams.pageSize) || '12', 10);

  const filters = {
    name,
    supplierId: supplierId || null,
    status,
    type,
    stock,
    page,
    pageSize,
  };

  const { products, total } = await fetchFilteredProducts(filters);

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='mb-1 text-2xl font-bold text-primary'>إدارة المنتجات</h1>
          <p className='text-sm text-muted-foreground'>
            عرض جميع المنتجات، التصفية، والبحث، مع إمكانية إضافة منتج جديد.
          </p>
        </div>
        <Link
          href={"/dashboard/management-products/new"}
          className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded'
        >
          إضافة منتج جديد
        </Link>
      </div>

      {/* Filters as external component */}
      <ProductFilterForm
        name={name}
        status={status}
        type={type}
        stock={stock}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
