'use client'; // Mark as a Client Component
import {
  Pencil,
  Trash2,
} from 'lucide-react'; // Import directly

import AddImage from '@/components/AddImage';
// Removed Icon import: import { Icon } from '@/components/icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import DeleteDriverAlert from './DeleteDriverAlert';
import EditDriverDialog from './EditDriverDialog';

type DriverCardProps = {
  driver: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    image?: string | null;
  };
};

export default function DriverCard({ driver }: DriverCardProps) {
  const safeDriver = {
    ...driver,
    name: driver.name || 'No Name',
    email: driver.email || '',
    password: undefined,
    imageUrl: driver.image || undefined,
  };
  return (
    <Card className='overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
      {/* Card Header */}
      <CardHeader className='border-b border-border bg-muted/50 p-4'>
        <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
          {safeDriver.name}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className='space-y-4 p-4'>
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
          <AddImage
            url={safeDriver.imageUrl}
            alt={`${safeDriver.name}'s profile`}
            recordId={safeDriver.id}
            table="user"
            cloudinaryPreset={"amwag_driver"}
            onUploadComplete={(url) => console.log('Uploaded to:', url)}
          />
        </div>


        {/* Details */}
        <div className='space-y-2'>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Email:</strong> {safeDriver.email || 'No Email'}
          </p>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Phone:</strong> {safeDriver.phone || 'No Phone'}
          </p>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className='flex justify-between border-t border-border bg-muted/50 p-4'>
        {/* Edit Driver Dialog */}
        <EditDriverDialog driver={safeDriver}>
          <button className='flex items-center gap-1 text-primary hover:underline'>
            <Pencil className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
          </button>
        </EditDriverDialog>

        {/* Delete Driver Alert */}
        <DeleteDriverAlert driverId={safeDriver.id}>
          <button className='flex items-center gap-1 text-destructive hover:underline'>
            <Trash2 className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
          </button>
        </DeleteDriverAlert>
      </CardFooter>
    </Card>
  );
}
