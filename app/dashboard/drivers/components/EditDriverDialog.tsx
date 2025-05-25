'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateDriver } from '../actions/updateDriver';
import {
  DriverFormData,
  driverSchema,
  getDriverFields,
} from '../helper/zodAndInputs';

interface EditDriverDialogProps {
  driver: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address?: string | null; // Allow null
    password?: string | null; // Allow null
    imageUrl?: string | null;
  };
  children: React.ReactNode;
}

export default function EditDriverDialog({ driver, children }: EditDriverDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
    defaultValues: {
      name: driver.name,
      email: driver.email,
      phone: driver.phone || '', // Default null phone to empty string for input
      address: driver.address || '', // Default null address to empty string for input
      password: driver.address || '',
    },
  });

  const onSubmit = async (formData: DriverFormData) => {
    try {
      const form = new FormData();
      form.append('id', driver.id); // Add the driver id to the form for backend update
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          form.append(key, formData[key as keyof DriverFormData] ?? '');
        }
      }


      const result = await updateDriver(form);
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

  return (
    <AppDialog
      trigger={children}
      title="تعديل بيانات السائق"
      description="يرجى إدخال بيانات السائق"

    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {getDriverFields(register, errors).map((input) => (
            <div key={input.name} className="mb-4">
              <Input
                {...input.register}
                type={input.type}
                placeholder={input.placeholder}
                disabled={isSubmitting}
                maxLength={input.maxLength}
              />
              <FormError message={input.error} />
            </div>
          ))}

        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ السائق'}
        </Button>
      </form>
    </AppDialog>
  );
}
