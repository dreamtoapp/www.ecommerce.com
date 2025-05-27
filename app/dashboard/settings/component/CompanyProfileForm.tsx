'use client';

import { useState } from 'react';

import {
  LocateFixed,
  MapPin,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useAccurateGeolocation from '@/hooks/use-geo';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { saveCompany } from '../actions/saveCompnay';
import {
  CompanyFormData,
  CompanySchema,
  getCompanyFields,
} from '../helper/companyZodAndInputs';

export default function CompanyProfileForm({ company }: { company?: CompanyFormData | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: company ?? {},
  });

  const [coordsApproved, setCoordsApproved] = useState(false);
  const { latitude, longitude, accuracy, googleMapsLink, loading } = useAccurateGeolocation();

  const handleApproveCoords = () => {
    if (latitude && longitude) {
      reset({
        ...getValues(),
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
      setCoordsApproved(true);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      await saveCompany(data);
      toast.success('تم حفظ بيانات الشركة بنجاح ✅');
    } catch (error) {
      console.error('❌ Failed to save company:', error);
      toast.error('حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.');
    }
  };

  const AutoCoordsBox = () => (
    <div className="my-4 p-4 border rounded-xl bg-muted text-sm text-muted-foreground space-y-2 rtl">
      <div className="flex items-center gap-2">
        <LocateFixed className="w-4 h-4" />
        <span className="font-medium animate-pulse">الإحداثيات التلقائية:</span>
        {loading ? (
          <Skeleton className="h-8 w-[70%] rounded" />
        ) : latitude && longitude ? (
          <>
            <span className="font-mono">
              {latitude.toFixed(7)}, {longitude.toFixed(7)}
            </span>
            {accuracy && <span>({accuracy.toFixed(0)} متر)</span>}
          </>
        ) : (
          <span>غير متاحة حالياً</span>
        )}
      </div>

      {!loading && googleMapsLink && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 underline"
        >
          <MapPin className="w-4 h-4" /> عرض على خرائط Google
        </a>
      )}

      {!loading && !coordsApproved && latitude && longitude && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApproveCoords}
          className="mt-2"
        >
          استخدام هذه الإحداثيات
        </Button>
      )}
    </div>
  );

  const sections = getCompanyFields(register, errors);

  // Inject AutoCoordsBox into the "الوصف والموقع" section
  const locationSection = sections.find((s) => s.section === 'الوصف والموقع');
  if (locationSection) {
    locationSection.customContent = <AutoCoordsBox />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rtl">
      {sections.map(({ section, fields, hint, customContent }) => (
        <Card key={section} className="border rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold">{section}</h3>
            {hint && (
              <p className="text-sm text-muted-foreground mt-1">
                تأكد من إدخال الإحداثيات أو رابط الموقع بدقة.
              </p>
            )}
            {customContent && <div className="mt-4">{customContent}</div>}
          </div>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map(({ name, type, placeholder, register, error, className }) => (
              <div key={name} className={cn('space-y-1', className)}>
                <Label htmlFor={name}>{placeholder}</Label>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  {...register}
                  className={cn('text-right', error && 'border-destructive')}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Separator />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ البيانات'}
        </Button>
      </div>
    </form>
  );
}
