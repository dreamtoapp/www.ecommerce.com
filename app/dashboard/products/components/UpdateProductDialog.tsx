import {
  useEffect,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Product } from '@/types/databaseTypes';

import { getCategories } from '../actions/get-categories';
import UpdateProductForm from './UpdateProductForm';

;

interface UpdateProductDialogProps {
  product: Product;
}

export default function UpdateProductDialog({ product }: UpdateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { success, categories, error } = await getCategories();
      if (success && categories) {
        setCategories(categories.map(c => ({ id: c.id, name: c.name })));
      } else {
        console.error('Failed to fetch categories:', error);
        // Handle error appropriately, maybe set an error state
      }
    };

    fetchCategories();
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='bg-primary text-primary-foreground hover:bg-primary/90'
          onClick={() => setOpen(true)}
        >
          تعديل المنتج
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[90vw] max-w-[90vw] border-border bg-background text-foreground shadow-lg sm:w-[90vw] sm:max-w-[90vw] md:w-[90vw] md:max-w-2xl lg:w-[90vw] lg:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='mb-2 text-center text-xl font-extrabold tracking-tight text-primary'>
            تعديل المنتج
          </DialogTitle>
        </DialogHeader>
        <UpdateProductForm product={product} onSuccess={() => setOpen(false)} categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
