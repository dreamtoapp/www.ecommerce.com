## 🔥 المبادئ الأساسية
✅ **المتطلبات غير القابلة للتفاوض**
1.  تطوير يعتمد على TypeScript أولاً (الوضع الصارم)
2.  فرض نمط App Router
3.  هندسة المكونات الذرية
4.  عدم وجود تعديلات بيانات من جانب العميل
5.  فحوصات إمكانية الوصول التلقائية

## 🛠 دستور حزمة التقنيات
```yaml
core:
  framework: "Next.js 15.2.1 (App Router)"
  state: "Zustand + React Server Components"
  db: "Prisma 6.6 → MongoDB Atlas"
  auth: "NextAuth 5.0β (استراتيجية JWT)"

mandatory:
  - "جميع النماذج → إجراءات الخادم (Server Actions)"
  - "مسارات API → وقت تشغيل الحافة (Edge runtime)"
  - "التحقق من صحة البيانات → مخططات Zod"
  - "معالجة الأخطاء → نظام إشعارات موحد (Unified toast system)"

forbidden:
  - "❌ أي تأكيدات نوع TypeScript"
  - "❌ تمرير الخصائص (prop drilling) لأكثر من مستويين"
  - "❌ استدعاءات fetch() من جانب العميل"
  - "❌ أنماط CSS المضمنة"
```

## ⚡ قواعد إنشاء الكود
### مكونات الخادم (Server Components)
```typescript
// النمط: [feature]/page.tsx
export default async function Page() {
  const data = await prisma.entity.findMany({
    cache: { revalidate: 3600 }, // إعادة التحقق كل ساعة
    select: { /* حقول محددة */ }
  });

  return <ClientComponent data={data} />;
}
```

### مكونات العميل (Client Components)
```typescript
'use client'; // فقط عند الضرورة القصوى

export function InteractiveUI({ data }) {
  const [state] = useStore(); // نمط Zustand
  return (
    <ErrorBoundary fallback={<ErrorToast />}>
      <form action={serverAction}>
        {/* مكونات shadcn/ui */}
      </form>
    </ErrorBoundary>
  );
}
```

### بروتوكولات الأمان
```diff
+ الترويسات المطلوبة:
  Content-Security-Policy: default-src 'self'
  X-Frame-Options: DENY
  Permissions-Policy: interest-cohort=()

+ سلسلة التحقق من الصحة:
  إدخال المستخدم → مخطط Zod → أنواع Prisma → طبقة قاعدة البيانات
```

## 📈 قائمة مراجعة الأداء
```fix
✓ استيرادات ديناميكية للمكونات > 50 كيلوبايت
✓ صور AVIF عبر next/image
✓ تحديد مجموعات فرعية للخطوط في /public/fonts
✓ ترطيب كسول (Lazy hydration) لواجهة المستخدم غير الحرجة
✓ تقسيم الكود بناءً على المسار
```

## 🤖 توجيهات الذكاء الاصطناعي
```python
def respond(prompt):
    """يجب تضمينها في جميع الردود:"""
    - مخطط التحقق من صحة Zod مع الأنواع
    - تقسيم مكونات الخادم/العميل
    - أفضل ممارسات Prisma
    - تكامل جلسة NextAuth
    - فئات Tailwind للجوال أولاً
    - هيكل تصميم ذري
    - حدود الخطأ + ملاحظات الإشعارات (toast feedback)
```

## 🚨 سير العمل الحرج
```bash
# بعد تغييرات المخطط:
$ prisma generate && prisma migrate dev

# فحوصات ما قبل الالتزام (Pre-commit checks):
$ tsc --noEmit && eslint . --fix

# تحليل أداء الإنتاج:
$ next build --profile --debug
```

## 🚩 تذكيرات رئيسية
1.  جميع الصور → `next/image` مع خاصية `sizes`
2.  محتوى المستخدم → معالجة `sanitize-html`
3.  تصدير البيانات → تصدير CSV خفيف الوزن
4.  جداول البيانات → مكونات `shadcn/ui`
5.  الأيقونات → استيرادات `lucide-react`
6.  التواريخ → معالجة `date-fns` UTC

🔗 **روابط التوثيق**
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/guides/database/mongodb)
- [NextAuth Security](https://next-auth.js.org/security)

---

### 📝 ملاحظات محسنة
-   **التسلسل الهرمي البصري**: تم تحسينه بعلامات إيموجي وتباعد متسق.
-   **أسوار الكود (Code Fences)**: تم تحديثها للوضوح والسياق.
-   **المساحة السلبية**: تمت إضافتها لتحسين قابلية القراءة.
-   **قوائم الأولويات**: أعيد ترتيبها لتدفق منطقي.
-   **الأنماط الصارمة**: تم تعزيز قواعد السماح/الرفض.
-   **أمثلة الكود**: واعية بالسياق وقابلة للتنفيذ.
-   **المراجع**: مرتبطة بالوثائق الرسمية لرؤى أعمق.
