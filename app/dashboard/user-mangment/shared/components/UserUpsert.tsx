'use client';

import {
  Edit,
  LocateFixed,
  MapPin,
  Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iconVariants } from '@/lib/utils';
import {
  extractCoordinatesFromUrl,
} from '@/utils/extract-latAndLog-fromWhatsAppLink';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';

import { upsertUser } from '../actions/upsertUser';
import {
  getDriverFields,
  UserFormData,
  UserSchema,
} from '../helper/userZodAndInputs';

interface userProps {
  role: UserRole;
  mode: 'new' | 'update'
  defaultValues: UserFormData;
  title?: string;
  description?: string;
}

export default function AddUser({ role, mode, defaultValues, title, description }: userProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange',
    defaultValues: {
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      address: defaultValues.address || '',
      password: defaultValues.password || '',
      sharedLocationLink: defaultValues.sharedLocationLink || '',
      latitude: defaultValues.latitude || '',
      longitude: defaultValues.longitude || '',
    },
  });

  const onSubmit = async (formData: UserFormData) => {
    try {
      const finalData = {
        ...formData,
        role: role,
      };

      const result = await upsertUser(finalData, role, mode);

      if (result.ok) {
        toast.success(result.msg || 'تم إضافة السائق بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  const handleExtractCoordinates = () => {
    const input = getValues('sharedLocationLink');
    const coords = extractCoordinatesFromUrl(input || '');

    if (coords) {
      setValue('latitude', coords.lat.toString());
      setValue('longitude', coords.lng.toString());
      toast.success('تم استخراج الإحداثيات بنجاح');
    } else {
      toast.error('تعذر استخراج الإحداثيات من الرابط');
    }
  };

  const handleOpenWhatsApp = () => {
    const input = getValues('sharedLocationLink');
    if (input) {
      window.open(input, '_blank');
    }
  };

  const isWhatsAppLinkValid = () => {
    const url = getValues('sharedLocationLink');
    return url?.startsWith('https://wa.me/') || url?.includes('google.com/maps');
  };

  return (
    <AppDialog
      trigger={<Button variant={mode === "new" ? 'default' : 'outline'} size='sm' className='flex items-center gap-2'>
        {mode === 'new' ? (
          <>
            <Plus className={iconVariants({ size: 'xs' })} /> <span>إضافة</span>
          </>
        ) : (
          <>
            <Edit className={iconVariants({ size: 'xs' })} /> <span>تعديل</span>
          </>
        )}

      </Button>}
      title={title}
      description={description}
      mode={mode}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {getDriverFields(register, errors).map((section) => (
          <div key={section.section} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {section.section}
              </h3>
              {section.hint && (
                <InfoTooltip content="يمكنك الحصول على خط العرض والطول من خلال مشاركة الموقع معك من خرائط Google أو أي تطبيق GPS آخر." />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                if (field.name === 'sharedLocationLink') {
                  return (
                    <div
                      key={field.name}
                      className="col-span-2 flex gap-2 items-start"
                    >
                      <div className="flex-1">
                        <Input
                          {...field.register}
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled={isSubmitting}
                        />
                        <FormError message={field.error} />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleExtractCoordinates}
                          disabled={isSubmitting || !isWhatsAppLinkValid()}
                        >
                          <LocateFixed />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleOpenWhatsApp}
                          disabled={!isWhatsAppLinkValid()}
                        >
                          <MapPin />
                        </Button>
                        <InfoTooltip content="  يمكنك نسخ رابط مشاركة الموقع من WhatsApp أو خرائط Google وسنقوم باستخراج الإحداثيات تلقائياً." />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={field.name} className={field.className}>
                    <Input
                      {...field.register}
                      type={field.type}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      maxLength={field.maxLength}
                    />
                    <FormError message={field.error} />
                  </div>
                );
              })}
            </div>

            {section.hint && (
              <p className="text-xs text-muted-foreground text-right max-w-md">

              </p>
            )}
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ '}
        </Button>
      </form>
    </AppDialog>
  );
}
