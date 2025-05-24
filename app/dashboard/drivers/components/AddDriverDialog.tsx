'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { createDriver } from '../actions/createDriver';
import {
  DriverFormData,
  driverSchema,
  getDriverFields,
} from '../helper/zodAndInputs';

export default function AddDriverDialog({ children }: { children: React.ReactNode }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
    },
  });

  const onSubmit = async (formData: DriverFormData) => {
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const result = await createDriver(form);
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
      title="إضافة سائق"
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
