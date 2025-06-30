# 📋 خطة اختبار رحلة التفعيل عبر WhatsApp

## 🎯 **الهدف**
اختبار الرحلة الكاملة من صفحة checkout إلى تفعيل الحساب عبر WhatsApp والعودة إلى checkout مع تحديث الحالة.

---

## 🔄 **الرحلة الكاملة - خطوة بخطوة**

### **الخطوة 1: نقطة البداية - Checkout Page**
```
URL: /checkout
الحالة: user.isOtp = false
```

**ما يجب اختباره:**
- [ ] عرض رابط "غير مفعل - انقر للتفعيل" في UserInfoCard
- [ ] الرابط يوجه إلى `/auth/verify?redirect=/checkout`
- [ ] عرض رسالة تحذير أن الحساب غير مفعل

### **الخطوة 2: صفحة التفعيل - Verify Page**
```
URL: /auth/verify?redirect=/checkout
الحالة: عرض نموذج إرسال OTP
```

**ما يجب اختباره:**
- [ ] عرض رقم الهاتف بشكل صحيح
- [ ] زر "إرسال الرمز عبر واتساب" يعمل
- [ ] في dev mode: عرض OTP في صندوق أصفر
- [ ] رسائل النجاح/الخطأ تظهر بشكل صحيح

### **الخطوة 3: إرسال OTP**
```
Action: handleSendOTP()
API: otpViaWhatsApp(phoneNumber)
```

**ما يجب اختباره:**
- [ ] استدعاء `otpViaWhatsApp` بنجاح
- [ ] عرض رسالة "تم إرسال رمز التحقق عبر WhatsApp بنجاح"
- [ ] في dev mode: عرض OTP للاختبار
- [ ] تفعيل نموذج إدخال OTP
- [ ] بدء العد التنازلي (60 ثانية)

### **الخطوة 4: إدخال OTP**
```
Action: handleSubmit()
API: verifyTheUser(phoneNumber, code)
```

**ما يجب اختباره:**
- [ ] التحقق من صحة OTP (4 أرقام)
- [ ] استدعاء `verifyTheUser` بنجاح
- [ ] تحديث `user.isOtp = true` في قاعدة البيانات
- [ ] عرض رسالة نجاح SweetAlert
- [ ] العودة إلى `/checkout`

### **الخطوة 5: العودة إلى Checkout**
```
URL: /checkout
الحالة: user.isOtp = true
```

**ما يجب اختباره:**
- [ ] تحديث حالة التفعيل في UserInfoCard
- [ ] إخفاء رابط التفعيل
- [ ] عرض "✅ مفعل" بدلاً من "غير مفعل"
- [ ] إمكانية إكمال عملية الشراء

---

## 🧪 **سيناريوهات الاختبار**

### **السيناريو 1: رحلة ناجحة كاملة**
1. **Setup**: تسجيل دخول بحساب غير مفعل
2. **Action**: الذهاب إلى checkout
3. **Action**: النقر على "تفعيل الحساب"
4. **Action**: إرسال OTP
5. **Action**: إدخال OTP الصحيح
6. **Expected**: العودة إلى checkout مع تفعيل الحساب

### **السيناريو 2: OTP خاطئ**
1. **Setup**: تسجيل دخول بحساب غير مفعل
2. **Action**: الذهاب إلى صفحة التفعيل
3. **Action**: إرسال OTP
4. **Action**: إدخال OTP خاطئ
5. **Expected**: رسالة خطأ "رمز التحقق غير صحيح"

### **السيناريو 3: إعادة إرسال OTP**
1. **Setup**: في صفحة التفعيل مع OTP مرسل
2. **Action**: النقر على "إعادة إرسال الرمز"
3. **Expected**: إرسال OTP جديد مع تحديث العد التنازلي

### **السيناريو 4: Rate Limiting**
1. **Setup**: محاولة إرسال OTP عدة مرات
2. **Action**: إرسال OTP أكثر من 5 مرات في ساعة
3. **Expected**: رسالة "تم تجاوز الحد الأقصى لطلبات الرمز"

---

## 🔧 **أدوات الاختبار**

### **1. Dev Mode Features**
```typescript
// عرض OTP في وضع التطوير
{process.env.NODE_ENV === 'development' && isOTPSent && otpFromBackEnd && (
  <div className="mt-2 text-xs text-muted-foreground p-2 bg-yellow-50 border border-yellow-200 rounded">
    <span>رمز الاختبار (Dev): </span>
    <span className="font-mono font-bold text-yellow-700">{otpFromBackEnd}</span>
  </div>
)}
```

### **2. Console Logging**
```typescript
// إضافة logs للاختبار
console.log('Sending OTP to:', userPhone);
console.log('OTP Result:', result);
console.log('Verification Result:', result);
```

### **3. Database Check**
```sql
-- التحقق من تحديث الحالة
SELECT id, phone, isOtp, otpCode, isActive 
FROM User 
WHERE phone = 'your_test_phone';
```

---

## 🚨 **نقاط الفشل المحتملة**

### **1. WhatsApp API Issues**
- **المشكلة**: فشل في إرسال WhatsApp
- **الحل**: عرض رسالة خطأ واضحة
- **الاختبار**: قطع الاتصال بالإنترنت

### **2. Database Issues**
- **المشكلة**: فشل في تحديث `isOtp`
- **الحل**: التحقق من صحة البيانات
- **الاختبار**: إدخال بيانات غير صحيحة

### **3. Redirect Issues**
- **المشكلة**: عدم العودة إلى checkout
- **الحل**: التحقق من `redirectTo` parameter
- **الاختبار**: اختبار من صفحات مختلفة

### **4. Session Issues**
- **المشكلة**: فقدان الجلسة أثناء التفعيل
- **الحل**: التحقق من صحة الجلسة
- **الاختبار**: إغلاق المتصفح وإعادة الفتح

---

## 📊 **معايير النجاح**

### **Functional Requirements**
- [ ] إرسال OTP عبر WhatsApp بنجاح
- [ ] التحقق من OTP بنجاح
- [ ] تحديث `user.isOtp = true`
- [ ] العودة إلى checkout
- [ ] عرض الحالة المحدثة

### **Performance Requirements**
- [ ] وقت استجابة إرسال OTP < 5 ثواني
- [ ] وقت استجابة التحقق < 3 ثواني
- [ ] وقت تحميل صفحة checkout < 2 ثانية

### **UX Requirements**
- [ ] رسائل واضحة ومفهومة
- [ ] loading states مناسبة
- [ ] error handling شامل
- [ ] smooth transitions

---

## 🎯 **خطوات التنفيذ**

### **المرحلة 1: إعداد البيئة**
1. [ ] إضافة environment variables
2. [ ] اختبار WhatsApp API connection
3. [ ] إعداد قاعدة بيانات للاختبار

### **المرحلة 2: اختبار الوحدات**
1. [ ] اختبار `otpViaWhatsApp` function
2. [ ] اختبار `verifyTheUser` function
3. [ ] اختبار `resendOTP` function

### **المرحلة 3: اختبار التكامل**
1. [ ] اختبار رحلة كاملة من checkout
2. [ ] اختبار معالجة الأخطاء
3. [ ] اختبار rate limiting

### **المرحلة 4: اختبار UX**
1. [ ] اختبار loading states
2. [ ] اختبار رسائل النجاح/الخطأ
3. [ ] اختبار responsive design

---

## 📝 **تقرير الاختبار**

### **Template**
```
تاريخ الاختبار: [DATE]
المختبر: [NAME]
البيئة: [DEV/STAGING/PROD]

النتائج:
✅ نجح: [LIST]
❌ فشل: [LIST]
⚠️ تحسينات: [LIST]

التوصيات:
- [RECOMMENDATION 1]
- [RECOMMENDATION 2]
```

---

**هل تريد أن نبدأ بتنفيذ هذه الخطة؟ أم تحتاج تعديلات؟** 