# خطة ترحيل نظام العناوين
## Address System Migration Plan

### 🎯 الهدف
حل تعارض البيانات بين User model و AddressBook من خلال دمج البيانات الأساسية كعنوان افتراضي.

---

## 📊 تحليل البيانات الحالية

### User Model Fields:
```typescript
address?: string        // عنوان نصي
latitude?: string      // خط العرض
longitude?: string     // خط الطول
sharedLocationLink?: string // رابط الموقع المشارك
```

### Address Model Fields:
```typescript
label: string          // تسمية العنوان
district: string       // المنطقة
street: string         // الشارع
buildingNumber: string // رقم المبنى
floor?: string         // الدور
apartmentNumber?: string // رقم الشقة
landmark?: string      // علامة مميزة
latitude?: string      // خط العرض
longitude?: string     // خط الطول
isDefault: boolean     // هل افتراضي
```

---

## 🔄 استراتيجية الدمج

### المرحلة 1: إنشاء وظائف المساعدة
1. **createDefaultAddressFromUser()** - إنشاء عنوان افتراضي من بيانات User
2. **syncUserWithDefaultAddress()** - مزامنة البيانات
3. **migrateExistingUsers()** - ترحيل المستخدمين الحاليين

### المرحلة 2: تعديل منطق الأعمال
1. تعديل **getAddresses()** لإنشاء عنوان افتراضي عند الحاجة
2. تحديث **AddressBook** للتعامل مع العنوان المدمج
3. تعديل **UserInfoCard** لعرض حالة العنوان الموحدة

### المرحلة 3: الاختبار والنشر
1. اختبار شامل للسيناريوهات المختلفة
2. نشر تدريجي مع مراقبة
3. تنظيف البيانات المكررة

---

## 📝 خطة التنفيذ التفصيلية

### الخطوة 1: إنشاء Address Helper Functions

```typescript
// lib/address-helpers.ts
export async function createDefaultAddressFromUser(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // تحقق من وجود عنوان افتراضي مسبقاً
  const existingDefault = await db.address.findFirst({
    where: { userId, isDefault: true }
  });
  
  if (existingDefault) return existingDefault;

  // إنشاء عنوان افتراضي من بيانات User
  return await db.address.create({
    data: {
      userId,
      label: 'العنوان الرئيسي',
      district: user.address || 'غير محدد',
      street: 'غير محدد',
      buildingNumber: 'غير محدد',
      latitude: user.latitude,
      longitude: user.longitude,
      isDefault: true,
      landmark: user.sharedLocationLink ? 'موقع مشارك' : undefined
    }
  });
}

export async function syncUserWithDefaultAddress(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  const defaultAddress = await db.address.findFirst({
    where: { userId, isDefault: true }
  });

  if (!user || !defaultAddress) return;

  // مزامنة الإحداثيات
  if (user.latitude !== defaultAddress.latitude || 
      user.longitude !== defaultAddress.longitude) {
    await db.address.update({
      where: { id: defaultAddress.id },
      data: {
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  }
}
```

### الخطوة 2: تعديل getAddresses Action

```typescript
// app/(e-comm)/checkout/actions/getAddresses.ts
import db from "@/lib/prisma";
import { createDefaultAddressFromUser } from "@/lib/address-helpers";

export async function getAddresses(userId: string) {
  let addresses = await db.address.findMany({ 
    where: { userId },
    orderBy: { isDefault: 'desc' }
  });

  // إذا لم توجد عناوين، أنشئ عنوان افتراضي من بيانات User
  if (addresses.length === 0) {
    const user = await db.user.findUnique({ where: { id: userId } });
    
    // إنشاء عنوان افتراضي فقط إذا كان لدى المستخدم بيانات موقع
    if (user?.latitude && user?.longitude) {
      const defaultAddress = await createDefaultAddressFromUser(userId);
      addresses = [defaultAddress];
    }
  }

  return addresses;
}
```

### الخطوة 3: تحديث AddressBook Component

```typescript
// تعديل AddressBook.tsx
export default function AddressBook({ addresses }: AddressBookProps) {
    const safeAddresses = addresses || [];
    const defaultAddress = safeAddresses.find(addr => addr.isDefault) || safeAddresses[0];

    if (!safeAddresses || safeAddresses.length === 0) {
        return (
            <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        عنوان التوصيل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">لم يتم إضافة عنوان بعد</p>
                        <p className="text-sm text-orange-600 mb-4">
                            يجب إكمال بيانات الملف الشخصي أولاً أو إضافة عنوان يدوياً
                        </p>
                        <div className="space-y-2">
                            <Button asChild className="w-full btn-edit">
                                <Link href="/user/profile?redirect=/checkout">
                                    إكمال الملف الشخصي
                                </Link>
                            </Button>
                            <AddressListDialog addresses={[]} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // باقي الكود...
}
```

---

## 🧪 سيناريوهات الاختبار

### سيناريو 1: مستخدم جديد
1. التسجيل بدون إكمال الملف الشخصي
2. الذهاب لصفحة الدفع
3. **المتوقع:** رسالة تطلب إكمال الملف الشخصي

### سيناريو 2: مستخدم أكمل الملف الشخصي
1. إكمال الموقع في الملف الشخصي
2. الذهاب لصفحة الدفع
3. **المتوقع:** إنشاء عنوان افتراضي تلقائياً

### سيناريو 3: مستخدم لديه عناوين
1. مستخدم لديه عناوين محفوظة
2. الذهاب لصفحة الدفع
3. **المتوقع:** عرض العناوين الموجودة بدون تداخل

### سيناريو 4: مزامنة البيانات
1. تحديث الموقع في الملف الشخصي
2. **المتوقع:** تحديث العنوان الافتراضي تلقائياً

---

## ⚠️ المخاطر والتخفيف

### المخاطر المحتملة:
1. **ازدواجية العناوين:** مستخدم لديه موقع في User وعنوان مشابه
2. **فقدان البيانات:** خطأ في migration
3. **تعارض الحالات:** حالات edge cases غير متوقعة

### استراتيجيات التخفيف:
1. **النسخ الاحتياطي:** backup كامل قبل التطبيق
2. **التطبيق التدريجي:** اختبار على users محددين أولاً
3. **Rollback Plan:** خطة للتراجع في حالة المشاكل
4. **مراقبة مكثفة:** لوقات مفصلة لأول أسبوع

---

## 📈 قياس النجاح

### مؤشرات الأداء:
- **معدل إكمال الطلبات:** زيادة متوقعة 15-20%
- **معدل الارتداد من صفحة الدفع:** انخفاض متوقع 25%
- **شكاوى العملاء:** انخفاض في الشكاوى المتعلقة بالعناوين
- **وقت إكمال الطلب:** انخفاض في الوقت المطلوب

### مراحل التقييم:
1. **أسبوع 1:** مراقبة التقنية والاستقرار
2. **أسبوع 2:** قياس تحسن UX
3. **شهر 1:** تقييم شامل للنتائج

---

## 🔄 خطة المتابعة

### بعد التطبيق:
1. مراقبة الأخطاء والتحسين
2. جمع feedback من العملاء
3. تحسينات إضافية حسب الحاجة
4. تنظيف البيانات المكررة تدريجياً

### التحسينات المستقبلية:
1. **إضافة validation متقدم** للعناوين
2. **تحسين UX للمزامنة** بين الملف الشخصي والعناوين
3. **إضافة نظام اقتراحات** للعناوين المشابهة

---

*تاريخ الإنشاء: ديسمبر 2024*
*المسؤول: فريق التطوير*
*الحالة: قيد المراجعة* 