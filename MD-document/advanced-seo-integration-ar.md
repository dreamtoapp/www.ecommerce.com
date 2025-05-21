# تكامل وتحسينات متقدمة للـ SEO في لوحة التحكم

هذا الدليل يشرح بالتفصيل كيف يمكنك دمج أدوات التحليل والمراقبة (Google Analytics, Search Console, Core Web Vitals)، إضافة تنبيهات ذكية، دعم التعديل الجماعي، مراجعة canonical URLs، وتفعيل تتبع الكلمات المفتاحية في منصة Next.js الخاصة بك.

---

## 1. تكامل Google Analytics 4 (GA4)

### الهدف
- تتبع زيارات المستخدمين، مصادر الزيارات، سلوكهم، وتحويلاتهم.

### خطوات التكامل
1. **إنشاء Property في Google Analytics 4**
   - ادخل إلى [Google Analytics](https://analytics.google.com/) وأنشئ Property جديدًا.
   - احصل على Measurement ID (مثال: G-XXXXXXXXXX).

2. **إضافة كود التتبع في Next.js**
   - أضف متغير البيئة في `.env`:
     ```env
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```
   - أضف الكود التالي في `app/layout.tsx` داخل `<head>`:
     ```tsx
     {process.env.NEXT_PUBLIC_GA_ID && (
       <>
         <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
         <script
           dangerouslySetInnerHTML={{
             __html: `
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
             `,
           }}
         />
       </>
     )}
     ```
   - لتتبع تغيّر الصفحات:
     ```tsx
     import { usePathname } from 'next/navigation';
     import { useEffect } from 'react';
     useEffect(() => {
       window.gtag && window.gtag('event', 'page_view', { page_path: pathname });
     }, [pathname]);
     ```

3. **عرض التقارير في لوحة التحكم**
   - استخدم Google Analytics Data API في backend لجلب البيانات وعرضها في `/dashboard/seo/analytics`.
   - مثال استخدام مكتبة [@google-analytics/data](https://www.npmjs.com/package/@google-analytics/data):
     ```ts
     import { BetaAnalyticsDataClient } from '@google-analytics/data';
     const client = new BetaAnalyticsDataClient({ keyFilename: 'path/to/credentials.json' });
     export async function getReport() {
       const [response] = await client.runReport({
         property: 'properties/XXXXXXXXX',
         dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
         metrics: [{ name: 'sessions' }, { name: 'users' }],
         dimensions: [{ name: 'date' }],
       });
       return response;
     }
     ```

---

## 2. تكامل Google Search Console

### الهدف
- مراقبة الزحف، الفهرسة، الأخطاء، وتحسين ظهور الموقع في نتائج البحث.

### خطوات التكامل
1. **إضافة موقعك إلى Search Console**
   - ادخل إلى [Google Search Console](https://search.google.com/search-console/about) وأضف موقعك وفعّل التحقق.

2. **استخدام Search Console API**
   - فعّل Search Console API من Google Cloud Console.
   - أنشئ credentials (OAuth 2.0 Client ID أو Service Account).
   - استخدم مكتبة [googleapis](https://www.npmjs.com/package/googleapis):
     ```ts
     import { google } from 'googleapis';
     const searchconsole = google.searchconsole('v1');
     // OAuth2 setup...
     export async function getSearchAnalytics() {
       const res = await searchconsole.searchanalytics.query({
         siteUrl: 'https://yourdomain.com',
         requestBody: {
           startDate: '2024-01-01',
           endDate: '2025-05-21',
           dimensions: ['query'],
           rowLimit: 10,
         },
         auth: oauth2Client,
       });
       return res.data.rows;
     }
     ```
   - اعرض النتائج (أكثر الكلمات بحثًا، عدد النقرات، الأخطاء) في لوحة تحكم مخصصة.

---

## 3. مراقبة Core Web Vitals (LCP, CLS, INP)

### الهدف
- مراقبة أداء الموقع من حيث سرعة التحميل، التفاعل، وثبات التصميم.

### خطوات التكامل
1. **استخدام مكتبة web-vitals**
   - أضف المكتبة:
     ```pwsh
     pnpm add web-vitals
     ```
   - أنشئ ملف `lib/web-vitals.ts`:
     ```ts
     import { getCLS, getFID, getLCP, getINP } from 'web-vitals';
     export function reportWebVitals(onReport: (metric: any) => void) {
       getCLS(onReport);
       getFID(onReport);
       getLCP(onReport);
       getINP(onReport);
     }
     ```
   - في `app/layout.tsx`:
     ```tsx
     import { useEffect } from 'react';
     import { reportWebVitals } from '@/lib/web-vitals';
     useEffect(() => {
       reportWebVitals((metric) => {
         fetch('/api/web-vitals', {
           method: 'POST',
           body: JSON.stringify(metric),
         });
       });
     }, []);
     ```
   - أنشئ API route `/api/web-vitals` لتخزين أو تحليل النتائج.

2. **عرض النتائج في لوحة التحكم**
   - أنشئ صفحة `/dashboard/seo/performance` تعرض القيم الحالية (LCP, CLS, INP) مع رسومات بيانية.

---

## 4. تنبيهات ذكية عند نقص بيانات SEO

### الهدف
- تنبيه المسؤول عند وجود نقص في بيانات SEO لأي كيان (مثلاً: منتج بدون metaTitle).

### خطوات التنفيذ
1. **تحليل حالة بيانات SEO**
   - في backend، أنشئ دالة تفحص كل كيان وتحدد الناقص:
     ```ts
     export async function getSeoHealth() {
       const products = await db.product.findMany();
       const seoEntries = await db.globalSEO.findMany();
       // قارن المنتجات مع seoEntries وحدد الناقص
     }
     ```
2. **عرض التنبيهات في لوحة التحكم**
   - في `/dashboard/seo`، اعرض رسالة أو badge حمراء بجانب الكيانات الناقصة.
   - استخدم Toast أو Alert من shadcn UI أو Sonner.

---

## 5. دعم التعديل الجماعي (Bulk Edit)

### الهدف
- تمكين المسؤول من تعديل بيانات SEO لعدة كيانات دفعة واحدة.

### خطوات التنفيذ
1. **واجهة اختيار متعددة**
   - في جدول المنتجات/الأصناف، أضف Checkboxes لاختيار عدة عناصر.
2. **نموذج تعديل جماعي**
   - عند اختيار عدة عناصر، أظهر نموذج يسمح بتعديل حقل معين لجميع العناصر المختارة.
3. **API للتعديل الجماعي**
   - أنشئ endpoint مثل `/api/seo/bulk-update` يستقبل قائمة IDs والتعديلات المطلوبة.
   - نفذ التعديل في backend باستخدام Prisma:
     ```ts
     await db.globalSEO.updateMany({
       where: { id: { in: ids } },
       data: { metaDescription: newValue },
     });
     ```

---

## 6. مراجعة شاملة للـ canonical URLs

### الهدف
- التأكد من عدم وجود تكرار أو تضارب في canonical tags.

### خطوات التنفيذ
1. **تحليل جميع canonical URLs**
   - أنشئ دالة backend تفحص جميع صفحات المنتجات/الأصناف وتتحقق من تكرار أو تضارب canonical URLs.
2. **تنبيه عند وجود تضارب**
   - اعرض رسالة تحذير في لوحة التحكم عند وجود أكثر من صفحة بنفس canonical.
3. **توليد canonical تلقائيًا**
   - في `lib/seo-service/getMetadata.ts`، تأكد أن كل صفحة تولد canonical فريد بناءً على المسار واللغة.

---

## 7. تفعيل تتبع الكلمات المفتاحية والأداء العضوي (SEMrush, Ahrefs)

### الهدف
- مراقبة ترتيب الكلمات المفتاحية، أداء البحث العضوي، وتحليل المنافسين.

### خطوات التنفيذ
1. **التسجيل في SEMrush/Ahrefs**
   - أنشئ حسابًا في [SEMrush](https://www.semrush.com/) أو [Ahrefs](https://ahrefs.com/).
2. **استخدام API الخاص بالأداة**
   - فعّل API من لوحة تحكم SEMrush/Ahrefs.
   - استخدم مكتبة مثل [axios](https://www.npmjs.com/package/axios) لاستدعاء البيانات:
     ```ts
     import axios from 'axios';
     export async function getKeywordPositions() {
       const res = await axios.get('https://api.semrush.com/', {
         params: {
           type: 'domain_ranks',
           key: 'API_KEY',
           domain: 'yourdomain.com',
           database: 'us',
         },
       });
       return res.data;
     }
     ```
3. **عرض النتائج في لوحة التحكم**
   - أنشئ صفحة تعرض ترتيب الكلمات المفتاحية، حجم البحث، المنافسين، إلخ.

---

## الخلاصة

باتباع الخطوات أعلاه، يمكنك بناء لوحة تحكم SEO متقدمة وذكية تدعم جميع احتياجات السوق السعودي وتمنحك رؤية شاملة وتحكمًا كاملاً في أداء موقعك العضوي.
