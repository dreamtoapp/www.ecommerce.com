'use client';

import {
  CheckCircle,
  Loader2,
  MapPin,
  Navigation,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

import Map from '@/components/GoogleMap';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAccurateGeolocation from '@/hooks/use-geo';
import { iconVariants } from '@/lib/utils';
import { Company } from '@/types/databaseTypes';

interface FormErrors {
  address?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: string | undefined;
}

interface LocationSectionProps {
  company: Company | null;
  errors: FormErrors;
  isGeolocationAvailable: boolean;
  currentLatitude: string;
  currentLongitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
}

const LocationSection = ({
  company,
  errors,
  isGeolocationAvailable,
  currentLatitude,
  currentLongitude,
  setLatitude,
  setLongitude,
}: LocationSectionProps) => {
  const {
    latitude: autoLat,
    longitude: autoLng,
    loading,
    errorMessage,
  } = useAccurateGeolocation();

  const isValidCoordinate = (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidCoordinate(e.target.value)) {
      setLatitude(e.target.value);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidCoordinate(e.target.value)) {
      setLongitude(e.target.value);
    }
  };

  const handleApproveCoordinates = () => {
    if (autoLat != null && autoLng != null) {
      setLatitude(autoLat.toFixed(7));
      setLongitude(autoLng.toFixed(7));
      toast.success('تم اعتماد الإحداثيات بنجاح');
    }
  };

  return (
    <Card className='relative'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2'>
          <MapPin className={iconVariants({ size: 'sm' })} />
          <span>الموقع الجغرافي</span>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Manual Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='flex items-center gap-2 text-muted-foreground'>
            <Navigation className={iconVariants({ size: 'xs' })} />
            العنوان التفصيلي
          </Label>
          <Input
            id='address'
            name='address'
            defaultValue={company?.address}
            aria-invalid={!!errors.address}
            placeholder='مثال: الرياض - حي الملقا - شارع الملك فهد'
            className='h-12'
          />
          {errors.address && (
            <p className='mt-1 flex items-center gap-1 text-xs text-red-500'>
              <Target className={iconVariants({ size: 'xs' })} />
              {errors.address}
            </p>
          )}
        </div>

        {/* Automatic Geolocation */}
        <div className='rounded-lg border bg-muted/50 p-4'>
          <p className='font-bold text-primary underline underline-offset-4'>اتوماتيك</p>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <span className='text-muted-foreground'>خط العرض</span>
                <span className='text-primary'>{autoLat?.toFixed(7) || '--'}</span>
              </Label>
            </div>
            <div>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <span className='text-muted-foreground'>خط الطول</span>
                <span className='text-primary'>{autoLng?.toFixed(7) || '--'}</span>
              </Label>
            </div>
            {errorMessage && (
              <div className='flex items-center gap-2 rounded-md bg-red-50 text-sm text-red-600'>
                <Target className={iconVariants({ size: 'xs' })} />
                {errorMessage}
              </div>
            )}
          </div>

          <div className='mt-4 flex w-full items-center justify-end gap-4'>
            <Button
              type='button'
              disabled={loading || !isGeolocationAvailable}
              className='h-12 gap-2'
              variant={errorMessage ? 'destructive' : 'default'}
            >
              {loading ? (
                <>
                  <Loader2 className={iconVariants({ size: 'xs', animation: 'spin' })} />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Target className={iconVariants({ size: 'xs' })} />
                  {errorMessage ? 'إعادة المحاولة' : 'تحديد الموقع'}
                </>
              )}
            </Button>

            <Button
              type='button'
              onClick={handleApproveCoordinates}
              disabled={autoLat == null || autoLng == null}
              className='h-12 gap-2 bg-green-600 text-white hover:bg-green-700'
            >
              <CheckCircle className={iconVariants({ size: 'xs' })} />
              اعتماد الإحداثيات
            </Button>
          </div>
        </div>

        {/* Manual Geolocation Entry */}
        <div className='rounded-lg border bg-muted/50 p-4'>
          <p className='font-bold text-primary underline underline-offset-8'>يدوي</p>
          <div className='grid grid-cols-1 items-end gap-4 bg-secondary p-2 md:grid-cols-4 rounded-md'>
            <div className='space-y-2'>
              <Label htmlFor='latitude'>إدخال خط العرض</Label>
              <Input
                id='latitude'
                name='latitude'
                value={currentLatitude}
                onChange={handleLatitudeChange}
                placeholder='مثال: 24.7136'
                pattern='-?\d*\.?\d*'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='longitude'>إدخال خط الطول</Label>
              <Input
                id='longitude'
                name='longitude'
                value={currentLongitude}
                onChange={handleLongitudeChange}
                placeholder='مثال: 46.6753'
                pattern='-?\d*\.?\d*'
              />
            </div>

            {isValidCoordinate(currentLatitude) && isValidCoordinate(currentLongitude) && (
              <Map
                latitude={currentLatitude}
                longitude={currentLongitude}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
