'use client';

import { useState } from 'react';

import {
  LocateFixed,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import FormError from '@/components/form-error';
import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton'; // ✅ import skeleton
import useAccurateGeolocation from '@/hooks/use-geo';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateUserProfile } from '../action/update-user-profile';
import {
  getDriverFields,
  UserFormData,
  UserSchema,
} from '../helper/userZodAndInputs';

export default function UserProfileForm({ userData }: { userData: UserFormData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData.name ?? '',
      phone: userData.phone ?? '',
      email: userData.email ?? '',
      address: userData.address ?? '',
      password: userData.password ?? '',
      latitude: userData.latitude?.toString(),
      longitude: userData.longitude?.toString(),
      id: userData.id ?? '',
      image: userData.image ?? '',
    },
  });

  const {
    latitude,
    longitude,
    accuracy,
    googleMapsLink,
    loading,
  } = useAccurateGeolocation(); // ✅ now includes loading state

  const [coordsApproved, setCoordsApproved] = useState(false);

  const handleApproveCoords = () => {
    if (latitude && longitude) {
      setValue('latitude', latitude.toString());
      setValue('longitude', longitude.toString());
      toast.success('تم تحديث الإحداثيات تلقائيًا');
      setCoordsApproved(true);
    }
  };

  const onSubmit = async (formData: UserFormData) => {
    try {
      const result = await updateUserProfile({ ...formData });

      if (result.ok) {
        toast.success(result.msg || 'تم تحديث المعلومات بنجاح');
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
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-md border bg-background">
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-foreground">الملف الشخصي</h2>
          <p className="text-muted-foreground">إدارة إعدادات الحساب وتحديث المعلومات</p>
          <p className="text-sm text-muted-foreground bg-muted px-3 py-1 inline-block rounded-md">
            المعرف: <span className="font-mono">{userData.phone}</span>
          </p>
        </div>
        <div className="relative h-28 w-36 overflow-hidden rounded-lg bg-muted/20">
          <AddImage
            url={userData.image}
            alt={`${userData.name}'s profile`}
            recordId={userData.id}
            table="user"
            tableField='image'
            folder={`E-comm/Users/ProfileImage/${userData.id}`}
            cloudinaryPreset={"E-comm"}

            onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")} // show notification on upload
          />
        </div>
      </div>

      {/* ✅ Enhanced Coordinates Box with Loading Skeleton */}
      <div className="my-6 p-4 border rounded-xl bg-muted text-sm text-muted-foreground space-y-2">
        <div className="flex items-center gap-2">
          <LocateFixed className="w-4 h-4" />
          <span className="font-medium animate-pulse">الإحداثيات التلقائية:</span>
          {loading ? (
            <Skeleton className="h-8 w-[70%] rounded" />
          ) : latitude && longitude ? (
            <>
              <span className="font-mono">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {getDriverFields(register, errors).map((section) => (
          <div key={section.section} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-foreground">{section.section}</h3>
              {section.hint && (
                <InfoTooltip content="يمكنك الحصول على خط العرض والطول من خلال مشاركة الموقع معك من خرائط Google أو أي تطبيق GPS آخر." />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.className}>
                  <div className="relative">
                    <Input
                      {...field.register}
                      type={field.type}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      maxLength={field.maxLength}
                      className="pl-10"
                    />
                    {field.name === 'name' && <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />}
                    {field.name === 'phone' && <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />}
                    {field.name === 'email' && <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />}
                    {field.name === 'password' && <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />}
                    {(field.name === 'latitude' || field.name === 'longitude') && (
                      <LocateFixed className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <FormError message={field.error} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-48">
            {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ المعلومات'}
          </Button>
        </div>
      </form>
    </div>
  );
}
