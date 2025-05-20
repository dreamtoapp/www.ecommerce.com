'use client';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { debounce } from '@/utils/debounce';

import { fetchFilteredProducts } from '../actions/fetchFilteredProducts';
import PaginationControls from './PaginationControls';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';

export default function ProductsControlClient() {
  type Filters = {
    name: string;
    supplierId: string | null;
    status: string;
    type: string;
    stock: string;
  };

  const initialFilters = useMemo((): Filters => ({
    name: '',
    supplierId: null,
    status: 'all',
    type: 'all',
    stock: 'all',
  }), []);

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(urlPage) && urlPage !== page) {
      setPage(urlPage);
    }
  }, [searchParams, page]);

  const fetchAndSetProducts = useCallback(
    async (
      overrideFilters?: Partial<Filters>,
      overridePage?: number,
      overridePageSize?: number,
    ) => {
      setLoading(true);
      const mergedFilters = {
        ...filters,
        ...(overrideFilters || {}),
        page: overridePage ?? page,
        pageSize: overridePageSize ?? pageSize,
      };
      const { products, total } = await fetchFilteredProducts(mergedFilters);
      setFilteredProducts(products);
      setTotal(total);
      setLoading(false);
    },
    [filters, page, pageSize],
  );

  const handleFilterChange = useCallback(
    async (changed: Partial<Filters>) => {
      setFilters((prev) => ({ ...prev, ...changed }));
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.replace(`?${params.toString()}`, { scroll: false });
      await fetchAndSetProducts(changed, 1);
    },
    [fetchAndSetProducts, router, searchParams],
  );

  const debouncedNameFilterChange = useMemo(
    () => debounce((value: string) => handleFilterChange({ name: value }), 300),
    [handleFilterChange],
  );

  const handleResetFilters = useCallback(async () => {
    setFilters(initialFilters);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });
    await fetchAndSetProducts(initialFilters, 1);
  }, [fetchAndSetProducts, router, searchParams, initialFilters]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
      await fetchAndSetProducts(undefined, newPage);
    },
    [fetchAndSetProducts, router, searchParams],
  );

  useEffect(() => {
    fetchAndSetProducts();
  }, [filters, page, pageSize, fetchAndSetProducts]);

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='mb-1 text-2xl font-bold text-primary'>إدارة المنتجات</h1>
          <p className='text-sm text-muted-foreground'>
            عرض جميع المنتجات، التصفية، والبحث، مع إمكانية إضافة منتج جديد.
          </p>
        </div>
        <Button asChild className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <Link href={filters.supplierId ? `/dashboard/products/new?supplierId=${filters.supplierId}` : "/dashboard/products/new"}>
            إضافة منتج جديد
          </Link>
        </Button>
      </div>

      <div className='mb-8 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end'>
        <ProductFilters
          value={filters.name}
          onChange={debouncedNameFilterChange}
          status={filters.status}
          onStatusChange={(status: string) => handleFilterChange({ status })}
          type={filters.type}
          onTypeChange={(type: string) => handleFilterChange({ type })}
          stock={filters.stock}
          onStockChange={(stock: string) => handleFilterChange({ stock })}
          onReset={handleResetFilters}
        />
      </div>

      <ProductTable
        page={page}
        pageSize={pageSize}
        products={filteredProducts !== null ? filteredProducts : []}
        total={total}
        loading={loading}
        onDeleted={() => fetchAndSetProducts()}
      />
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
}