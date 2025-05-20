import { Box } from 'lucide-react'; // Import directly

// Removed Icon import: import { Icon } from '@/components/icons';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { iconVariants } from '@/lib/utils'; // Import CVA variants

interface ProductHeaderProps {
  name: string;

  children?: React.ReactNode; // For action buttons
}

// Displays the product name with an icon and optional actions
const ProductHeader: React.FC<ProductHeaderProps> = ({ name }) => (
  <CardHeader className='flex flex-col gap-3 rounded-t-lg border-b bg-gradient-to-r from-muted/60 via-white/80 to-muted/40 p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-6'>
    <div className='flex items-center gap-4'>
      <span className='relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10'>
        <Box className={iconVariants({ size: 'md', className: 'text-primary' })} /> {/* Use direct import + CVA (adjust size if needed) */}


      </span>
      <div className='flex flex-col gap-0.5'>
        <CardTitle className='line-clamp-1 text-2xl font-extrabold tracking-tight text-foreground drop-shadow-sm md:text-3xl'>
          {name}
        </CardTitle>
        <CardDescription className='text-sm font-medium text-muted-foreground md:text-base'>

        </CardDescription>
      </div>
    </div>
  </CardHeader>
);

export default ProductHeader;
