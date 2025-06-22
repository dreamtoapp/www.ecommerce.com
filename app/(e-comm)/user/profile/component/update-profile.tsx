'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  LocateFixed,
  CheckCircle,
  Shield,
  Camera,
  Award,
  Settings,
  LogOut
} from 'lucide-react';

import BackButton from '@/components/BackButton';
import AddImage from '@/components/AddImage';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useAccurateGeolocation from '@/hooks/use-geo';

import { updateUserProfile } from '../action/update-user-profile';
import { handleLogout } from '../action/logout';
import { UserFormData, UserSchema } from '../helper/userZodAndInputs';

// Profile Header Component (65 lines)
function ProfileHeader({ userData }: { userData: UserFormData }) {
  const completionPercentage = calculateProfileCompletion(userData);

  return (
    <div className="space-y-6">
      <BackButton variant="minimal" />

      <Card className="shadow-lg border-l-4 border-l-feature-users card-hover-effect">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-feature-users icon-enhanced" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-feature-users/10 border-4 border-feature-users/20">
                <AddImage
                  url={userData.image}
                  alt={`${userData.name}'s profile`}
                  recordId={userData.id}
                  table="user"
                  tableField='image'
                  onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-feature-users text-white rounded-full p-1">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-right space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{userData.name || 'مستخدم جديد'}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge className="bg-feature-users/10 text-feature-users border-feature-users/20">
                  <Shield className="h-3 w-3 ml-1" />
                  حساب محقق
                </Badge>
                <Badge className="bg-feature-products/10 text-feature-products border-feature-products/20">
                  <Award className="h-3 w-3 ml-1" />
                  عضو ذهبي
                </Badge>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted/30"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${completionPercentage}, 100`}
                    className="text-feature-users"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-feature-users">{completionPercentage}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">اكتمال الملف</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Personal Information Card Component (45 lines)
function PersonalInfoCard({ register, errors, isSubmitting }: {
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-feature-products icon-enhanced" />
          المعلومات الشخصية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
            <div className="relative">
              <Input
                {...register('name')}
                placeholder="أدخل اسمك الكامل"
                disabled={isSubmitting}
                className="pl-10 h-12 border-2 focus:border-feature-products transition-colors"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
            <div className="relative">
              <Input
                {...register('phone')}
                placeholder="05XXXXXXXX"
                disabled={isSubmitting}
                maxLength={10}
                className="pl-10 h-12 border-2 focus:border-feature-products transition-colors"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.phone?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
            <div className="relative">
              <Input
                {...register('email')}
                type="email"
                placeholder="example@email.com"
                disabled={isSubmitting}
                className="pl-10 h-12 border-2 focus:border-feature-products transition-colors"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FormError message={errors.email?.message} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Security Settings Card Component (35 lines)
function SecurityCard({ register, errors, isSubmitting }: {
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-feature-settings icon-enhanced" />
          إعدادات الأمان
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">كلمة المرور</label>
          <div className="relative">
            <Input
              {...register('password')}
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={isSubmitting}
              className="pl-10 h-12 border-2 focus:border-feature-settings transition-colors"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <FormError message={errors.password?.message} />
          <p className="text-xs text-muted-foreground">
            يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل
          </p>
        </div>

        <div className="bg-feature-settings/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-feature-products" />
            <span className="text-muted-foreground">تم تفعيل المصادقة الثنائية</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Location Management Card Component (55 lines)
function LocationCard({ register, errors, isSubmitting, setValue }: {
  register: any;
  errors: any;
  isSubmitting: boolean;
  setValue: any;
}) {
  const { latitude, longitude, accuracy, googleMapsLink, loading } = useAccurateGeolocation();
  const [coordsApproved, setCoordsApproved] = useState(false);

  const handleApproveCoords = () => {
    if (latitude && longitude) {
      setValue('latitude', latitude.toString());
      setValue('longitude', longitude.toString());
      toast.success('تم تحديث الإحداثيات تلقائياً');
      setCoordsApproved(true);
    }
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-feature-suppliers card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-feature-suppliers icon-enhanced" />
          إدارة الموقع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">العنوان</label>
          <div className="relative">
            <Input
              {...register('address')}
              placeholder="أدخل عنوانك التفصيلي"
              disabled={isSubmitting}
              className="pl-10 h-12 border-2 focus:border-feature-suppliers transition-colors"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <FormError message={errors.address?.message} />
        </div>

        <div className="bg-feature-suppliers/5 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <LocateFixed className="h-4 w-4 text-feature-suppliers" />
            <span className="font-medium text-foreground">الموقع التلقائي</span>
          </div>

          {loading ? (
            <Skeleton className="h-8 w-full rounded" />
          ) : latitude && longitude ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                الإحداثيات: <span className="font-mono">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                {accuracy && <span> (دقة: {accuracy.toFixed(0)} متر)</span>}
              </p>
              {googleMapsLink && (
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-feature-suppliers hover:underline text-sm block"
                >
                  عرض على خرائط Google ←
                </a>
              )}
              {!coordsApproved && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApproveCoords}
                  className="btn-professional"
                >
                  استخدام هذا الموقع
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لم يتم العثور على الموقع</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">خط العرض</label>
            <Input
              {...register('latitude')}
              placeholder="24.7136"
              disabled={isSubmitting}
              className="h-12 border-2 focus:border-feature-suppliers transition-colors"
            />
            <FormError message={errors.latitude?.message} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">خط الطول</label>
            <Input
              {...register('longitude')}
              placeholder="46.6753"
              disabled={isSubmitting}
              className="h-12 border-2 focus:border-feature-suppliers transition-colors"
            />
            <FormError message={errors.longitude?.message} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Preferences Card Component
function PreferencesCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language-preference') || 'ar';
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (language: string) => {
    if (language === 'en') {
      toast.info('اللغة الإنجليزية ستكون متاحة قريباً');
      return;
    }
    setSelectedLanguage(language);
    localStorage.setItem('language-preference', language);
    toast.success('تم حفظ تفضيل اللغة');
  };

  if (!mounted) {
    return (
      <Card className="shadow-lg border-l-4 border-l-feature-analytics">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-feature-analytics icon-enhanced" />
            التفضيلات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-[70px] rounded-lg" />
              <Skeleton className="h-[70px] rounded-lg" />
              <Skeleton className="h-[70px] rounded-lg" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[46px] rounded-lg" />
              <Skeleton className="h-[46px] rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-feature-analytics icon-enhanced" />
          التفضيلات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">المظهر</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'فاتح', icon: '☀️' },
              { value: 'dark', label: 'داكن', icon: '🌙' },
              { value: 'system', label: 'النظام', icon: '💻' }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${theme === item.value
                  ? 'border-feature-analytics bg-feature-analytics/10 ring-2 ring-feature-analytics/20'
                  : 'border-border hover:border-feature-analytics/50'
                  }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">اللغة</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'ar', label: 'العربية', flag: '🇸🇦', available: true },
              { value: 'en', label: 'English', flag: '🇺🇸', available: false }
            ].map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleLanguageChange(lang.value)}
                disabled={!lang.available}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedLanguage === lang.value
                  ? 'border-feature-analytics bg-feature-analytics/10 ring-2 ring-feature-analytics/20'
                  : lang.available
                    ? 'border-border hover:border-feature-analytics/50 hover:scale-105'
                    : 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {!lang.available && (
                    <span className="text-xs text-muted-foreground">(قريباً)</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-feature-analytics/5 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            💡 يتم حفظ تفضيلات المظهر واللغة تلقائياً في متصفحك.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Profile Actions Component
function ProfileActions({ isSubmitting, onReset }: {
  isSubmitting: boolean;
  onReset: () => void;
}) {
  return (
    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-feature-users hover:bg-feature-users/90 text-white font-medium btn-professional"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isSubmitting}
            className="sm:w-32 h-12 btn-cancel-outline"
          >
            إعادة تعيين
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          سيتم حفظ التغييرات تلقائياً وإعادة تحميل الصفحة
        </p>
      </CardContent>
    </Card>
  );
}

// Logout Card Component
function LogoutCard() {
  return (
    <Card className="shadow-lg border-l-4 border-l-destructive card-hover-effect">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <LogOut className="h-5 w-5 text-destructive icon-enhanced" />
          تسجيل الخروج
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleLogout}>
          <Button
            type="submit"
            className="w-full btn-delete"
          >
            تأكيد الخروج
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">
          سيتم إنهاء جلستك وتوجيهك لصفحة تسجيل الدخول.
        </p>
      </CardContent>
    </Card>
  );
}

// Helper function
function calculateProfileCompletion(userData: UserFormData): number {
  const fields = ['name', 'email', 'phone', 'address', 'image'];
  const completedFields = fields.filter(field => userData[field as keyof UserFormData]);
  return Math.round((completedFields.length / fields.length) * 100);
}

// Main Profile Component
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

  const handleReset = () => {
    reset();
    toast.info('تم إعادة تعيين النموذج');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-6">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ProfileHeader userData={userData} />

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PersonalInfoCard
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
              <SecurityCard
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="space-y-6">
              <LocationCard
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                setValue={setValue}
              />
              <PreferencesCard />
            </div>
          </div>

          <ProfileActions
            isSubmitting={isSubmitting}
            onReset={handleReset}
          />
        </form>

        <LogoutCard />
      </div>
    </div>
  );
}
