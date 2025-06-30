# 🔧 إعداد Environment Variables

## 📋 **المتغيرات المطلوبة لـ WhatsApp OTP**

### **1. إنشاء ملف `.env.local`**

قم بإنشاء ملف `.env.local` في المجلد الجذر للمشروع وأضف المتغيرات التالية:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PERMANENT_TOKEN=your_permanent_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here

# Application Configuration
APP_NAME=متجرنا الإلكتروني
APP_URL=http://localhost:3000

# Database Configuration (if not already set)
DATABASE_URL="mongodb://localhost:27017/your_database_name"

# NextAuth Configuration (if not already set)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (if not already set)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Development Mode
NODE_ENV=development
```

---

## 🔑 **كيفية الحصول على WhatsApp API Credentials**

### **الخطوة 1: إنشاء Meta Developer Account**
1. اذهب إلى [Meta for Developers](https://developers.facebook.com/)
2. أنشئ حساب جديد أو سجل دخول
3. أنشئ تطبيق جديد

### **الخطوة 2: إعداد WhatsApp Business API**
1. في لوحة التحكم، اذهب إلى "Products"
2. أضف "WhatsApp" إلى تطبيقك
3. اتبع خطوات الإعداد

### **الخطوة 3: الحصول على Credentials**
1. **Permanent Token**: من "System Users" أو "Access Tokens"
2. **Phone Number ID**: من "WhatsApp" > "Getting Started"

---

## 🧪 **للتجربة السريعة (بدون WhatsApp حقيقي)**

إذا كنت تريد تجربة النظام بدون WhatsApp حقيقي، يمكنك استخدام قيم وهمية:

```env
# Test Values (for development only)
WHATSAPP_PERMANENT_TOKEN=test_token_123
WHATSAPP_PHONE_NUMBER_ID=test_phone_id_123
APP_NAME=متجرنا الإلكتروني
```

**ملاحظة**: في هذه الحالة، سيتم عرض OTP في dev mode فقط.

---

## ✅ **التحقق من الإعداد**

### **1. إعادة تشغيل الخادم**
```bash
# أوقف الخادم (Ctrl+C)
# ثم أعد تشغيله
pnpm dev
```

### **2. التحقق من المتغيرات**
أضف هذا الكود مؤقتاً في أي ملف للتحقق:

```typescript
console.log('WhatsApp Token:', process.env.WHATSAPP_PERMANENT_TOKEN);
console.log('Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID);
console.log('App Name:', process.env.APP_NAME);
```

### **3. اختبار الاتصال**
- اذهب إلى `/auth/verify`
- انقر على "إرسال الرمز عبر واتساب"
- تحقق من console logs

---

## 🚨 **ملاحظات مهمة**

### **الأمان**
- لا تشارك ملف `.env.local` أبداً
- أضف `.env.local` إلى `.gitignore`
- استخدم متغيرات مختلفة للإنتاج

### **الإنتاج**
```env
# Production Environment
WHATSAPP_PERMANENT_TOKEN=your_real_production_token
WHATSAPP_PHONE_NUMBER_ID=your_real_phone_id
APP_NAME=متجرنا الإلكتروني
APP_URL=https://yourdomain.com
NODE_ENV=production
```

---

## 🔍 **استكشاف الأخطاء**

### **مشكلة: "Missing environment variables"**
- تحقق من وجود ملف `.env.local`
- تحقق من صحة أسماء المتغيرات
- أعد تشغيل الخادم

### **مشكلة: "WhatsApp API Error"**
- تحقق من صحة `WHATSAPP_PERMANENT_TOKEN`
- تحقق من صحة `WHATSAPP_PHONE_NUMBER_ID`
- تحقق من اتصال الإنترنت

### **مشكلة: "Database Error"**
- تحقق من `DATABASE_URL`
- تحقق من اتصال قاعدة البيانات
- تحقق من صحة schema

---

**هل تريد المساعدة في إعداد أي من هذه المتغيرات؟** 