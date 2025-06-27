# خطة التنفيذ النهائية لتحويل نظام السلة (DB-First)

> **الإصدار:** 1.0  
> **آخر تحديث:** 25 / 06 / 2025

---

## مقدمة
تهدف هذه الخطة إلى توحيد مصدر بيانات السلة في قاعدة البيانات، إزالة Zustand، وإطلاق مسار الدفع عند الاستلام (COD) مع الحفاظ على أفضل ممارسات الأداء والأمان.

---

## نظرة عامة على المراحل
| المرحلة | الهدف الرئيسي | زمن التنفيذ التقديري |
|---------|---------------|----------------------|
| 0 | إنشاء فرع عمل وتحضير البيئة | نصف يوم |
| 1 | تدقيق شامل للكود وقاعدة البيانات + عزل الملفات القديمة | نصف يوم |
| 2 | تحسين مخطط Prisma (إضافة فهارس) | ربع يوم |
| 3 | تقوية Server Actions (التحقق بـ Zod + revalidateTag) | نصف يوم |
| 4 | إزالة Zustand واستبداله بمنطق الخادم | يوم كامل |
| 5 | بناء مسار Checkout (COD) | يوم كامل |
| 6 | تحسين واجهة المستخدم (ألوان، Badges، Skeletons) | نصف يوم |
| 7 | اختبارات وحدة وتكامل | نصف يوم |
| 8 | النشر والمراقبة | ربع يوم |
| **الإجمالي** | **≈ 4 أيام عمل** |

---

## تفاصيل العمليات

### المرحلة 0 – التحضير
1. إنشاء فرع جديد:
   ```bash
   git checkout -b feat/cart-db-first
   ```
2. التأكد من أن Prisma migrations محدثة:
   ```bash
   npx prisma migrate deploy
   ```

### المرحلة 1 – التدقيق والعزل
1. استخدام الأمر التالي للبحث عن استعمال Zustand:
   ```bash
   rg "useCartStore(" --glob "*.tsx"
   ```
2. توثيق النتائج في `audit/cart-audit-report.md`.
3. إعادة تسمية الملفات القديمة من `.tsx` إلى `.txt`، وتسجيلها في `audit/legacy-files.md` باستخدام:
   ```bash
   git mv path/to/OldFile.tsx path/to/OldFile.txt
   ```
   - المسارات المعروفة حاليًا:
     * `components/ecomm/Header/to-Delete/*.tsx`
     * أي ملفات تحمل وسم `to-Delete` أو `legacy` داخل `components/` أو `app/`.
   - لمراجعة شاملة، يمكن تنفيذ الأمر التالي لسرد كل الملفات المرشّحة:
     ```bash
     rg --files-with-matches -g "*.tsx" -e "to-Delete|legacy" | tee audit/legacy-files.md
     ```
   - ثم تشغيل سكربت سريع لإعادة التسمية (تحفّظيًا):
     ```bash
     while IFS= read -r file; do
       git mv "$file" "${file%.tsx}.txt";
     done < audit/legacy-files.md
     ```

### المرحلة 2 – تحسين Prisma
1. إضافة الفهرس المركّب في `schema.prisma`:
   ```prisma
   @@index([cartId, productId])
   ```
2. تطبيق الهجرة:
   ```bash
   npx prisma migrate dev -n cart-index
   ```

### المرحلة 3 – تقوية Server Actions
1. إضافة Zod للتحقق من الكمية:
   ```ts
   import { z } from 'zod';
   const qty = z.number().int().min(1).max(99).parse(quantity);
   ```
2. استبدال `revalidatePath('/cart')` بـ:
   ```ts
   revalidateTag('cart');
   ```
3. في صفحة `/cart` استخدم جلب مع الوسم:
   ```ts
   const cart = await getCart({ next: { tags: ['cart'] } });
   ```

### المرحلة 4 – إزالة Zustand
1. حذف `store/cartStore.ts`:
   ```bash
   git rm store/cartStore.ts
   ```
2. تعديل `StoreAddToCartButton` ليستدعي `addItem` مباشرة أو إزالته إن لم يُستخدم.
3. استبدال جميع الاستدعاءات إلى `useCartStore`.

### المرحلة 5 – بناء Checkout (COD)
1. إنشاء هيكل المسار:
   ```bash
   mkdir -p app/checkout/{components,actions,helpers}
   touch app/checkout/{loading.tsx,page.tsx}
   ```
2. **Server Action** `createDraftOrder(cartId)`:
   - تنقل عناصر السلة إلى جدولي `Order` و`OrderItem`.
   - تعيّن الحالة `CONFIRMED` مباشرة لأن الدفع عند الاستلام.
3. **واجهة المستخدم**: صفحة واحدة تشمل نموذج عنوان الشحن وبطاقة ملخص الطلب.
4. إضافة زر `BackButton` وألوان `border-feature-commerce`.

### المرحلة 6 – تحسين الواجهة
1. استبدال `bg-green-600` في أزرار الإضافة بـ `btn-add` + `text-feature-commerce`.
2. إنشاء مكوّن `CartBadgeServer` لجلب عدد العناصر وعرضه في الهيدر.
3. إضافة `loading.tsx` بتأثير Skeleton لمساري `/cart` و`/checkout`.

### المرحلة 7 – الاختبارات
1. **Jest**:
   - اختبار `addItem` لضمان إنشاء السلة ودمج العناصر.
   - اختبار `createDraftOrder` لإنشاء الطلب وحسابه.
2. **Playwright**:
   - سيناريو: زائر يضيف عناصر، ينعش الصفحة، يُكمل Checkout COD، يرى الطلب في سجلّ المشتريات.

### المرحلة 8 – النشر والمراقبة
1. دمج الفرع بعد موافقة PR:
   ```bash
   git checkout main && git merge feat/cart-db-first
   ```
2. نشر على Staging ثم Production.
3. مراقبة:
   - زمن TTFB لصفحات `/cart` و`/checkout` (< 500ms).
   - أخطاء Prisma وسجلات الخادم.
4. الاحتفاظ بفرع Zustand لمدة أسبوع كخطة تراجع.

---

## تسليمات المرحلة
- مخطط Prisma محدَّث + Migration.
- Server Actions محمية بـ Zod.
- Checkout (COD) جاهز.
- واجهة مستخدم متوافقة مع نظام الألوان والبطاقات.
- اختبارات ناجحة.
- وثائق محدثة (`cart-current-state-analysis.md`, `cart-refactor-plan.md`).

---

> **موافقة:** يرجى مراجعة هذه الخطة واعتمادها قبل بدء التنفيذ. 