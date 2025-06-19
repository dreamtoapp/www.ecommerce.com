# Multi-Tenant OAuth System - نظام OAuth متعدد العملاء

## 🎯 المفهوم

نظام يسمح لك بدعم عدة عملاء بـ callback URLs ديناميكية بدون تعديل إعدادات OAuth لكل عميل.

## 🏗️ كيف يعمل النظام

### **1. تحديد العميل من الدومين:**
```
client1.yourapp.com → العميل الأول
client2.yourapp.com → العميل الثاني  
yourapp.com → العميل الافتراضي
```

### **2. Callback URLs ديناميكية:**
```
https://client1.yourapp.com/api/auth/callback/google?tenant=client1
https://client2.yourapp.com/api/auth/callback/google?tenant=client2
https://yourapp.com/api/auth/callback/google
```

## 🚀 إعداد Google OAuth Console

### **OAuth Callback URLs المطلوبة:**
```
# إضافة هذه الـ URLs مرة واحدة فقط:
✅ https://*.yourapp.com/api/auth/callback/google
✅ https://yourapp.com/api/auth/callback/google
✅ https://yourapp.vercel.app/api/auth/callback/google
✅ https://*.yourapp.vercel.app/api/auth/callback/google
```

**الفكرة:** استخدام wildcards (*) لتغطية جميع الـ subdomains!

## 📋 متغيرات البيئة في Vercel

```bash
# متغيرات أساسية (مرة واحدة لجميع العملاء):
NEXTAUTH_SECRET=your_32_character_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=your_mongodb_connection

# متغيرات التطبيق:
NEXT_PUBLIC_BASE_URL=https://yourapp.com
```

## 🔧 إعداد العملاء

### **في ملف lib/multi-tenant-auth.ts:**
```typescript
const tenants = [
  {
    id: 'default',
    domain: 'yourapp.com',
    oauthEnabled: true,
    providers: ['google', 'credentials'],
  },
  {
    id: 'client1',
    subdomain: 'client1',
    customDomain: 'client1.com', // اختياري
    oauthEnabled: true,
    providers: ['google', 'credentials'],
  },
  {
    id: 'client2',
    subdomain: 'client2', 
    oauthEnabled: false, // فقط username/password
    providers: ['credentials'],
  },
];
```

## 🎯 كيفية إضافة عميل جديد

### **1. إضافة العميل للنظام:**
```typescript
// إضافة في lib/multi-tenant-auth.ts
{
  id: 'client3',
  subdomain: 'client3',
  customDomain: 'client3.com', // اختياري
  oauthEnabled: true,
  providers: ['google', 'credentials'],
}
```

### **2. إعداد DNS (إذا كان لديك subdomain):**
```
CNAME: client3.yourapp.com → yourapp.vercel.app
```

### **3. لا حاجة لتعديل OAuth في Google Console!**
الـ wildcard URLs تغطي العميل الجديد تلقائياً.

## 🌐 أمثلة على الاستخدام

### **العميل الافتراضي:**
```
URL: https://yourapp.com
OAuth: https://yourapp.com/api/auth/callback/google
```

### **العميل الأول:**
```
URL: https://client1.yourapp.com  
OAuth: https://client1.yourapp.com/api/auth/callback/google?tenant=client1
```

### **العميل بدومين مخصص:**
```
URL: https://client1.com
OAuth: https://client1.com/api/auth/callback/google?tenant=client1
```

## 🗄️ قاعدة البيانات (اختياري)

### **إضافة جدول العملاء:**
```prisma
model Tenant {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  subdomain String? @unique
  domain    String? @unique
  oauthEnabled Boolean @default(true)
  providers String[] @default(["credentials"])
  users     User[]
  createdAt DateTime @default(now())
}

model User {
  // ... الحقول الموجودة
  tenantId String? @db.ObjectId
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
}
```

### **تحميل العملاء من قاعدة البيانات:**
```typescript
static async initializeTenants() {
  const tenants = await db.tenant.findMany();
  tenants.forEach(tenant => {
    this.registerTenant({
      id: tenant.id,
      domain: tenant.domain || '',
      subdomain: tenant.subdomain || '',
      oauthEnabled: tenant.oauthEnabled,
      providers: tenant.providers,
    });
  });
}
```

## 🚀 النشر على Vercel

### **1. إعداد Vercel Domains:**
```bash
# في Vercel Dashboard → Settings → Domains
yourapp.com
*.yourapp.com  # للـ subdomains
client1.com    # للدومينات المخصصة
```

### **2. متغيرات البيئة:**
```bash
# نفس المتغيرات لجميع العملاء - لا حاجة للتكرار!
```

### **3. نشر واحد لجميع العملاء:**
```bash
git push origin main
# يخدم جميع العملاء من نفس الكود!
```

## 🎯 مزايا هذا النظام

### **للمطور:**
- ✅ **إعداد واحد** لجميع العملاء
- ✅ **كود واحد** يخدم الجميع
- ✅ **صيانة أسهل** - تحديث واحد للجميع
- ✅ **لا تكرار في الإعدادات**

### **للعملاء:**
- ✅ **دومين منفصل** لكل عميل
- ✅ **إعدادات مخصصة** (OAuth تشغيل/إيقاف)
- ✅ **مستخدمين منفصلين** (اختياري)
- ✅ **تجربة مخصصة**

## 🛠️ خطوات التنفيذ

### **المرحلة 1: إعداد النظام الأساسي**
1. إضافة wildcard URLs في Google OAuth Console
2. تحديث auth.config.ts
3. إعداد MultiTenantAuth class

### **المرحلة 2: إضافة العملاء**
1. تحديث قائمة العملاء في الكود
2. إعداد DNS للـ subdomains
3. اختبار OAuth لكل عميل

### **المرحلة 3: إعداد قاعدة البيانات (اختياري)**
1. إضافة جدول Tenant
2. ربط المستخدمين بالعملاء
3. تحميل العملاء ديناميكياً

## 🚨 نصائح مهمة

### **Wildcard Domains:**
```bash
# تأكد من إضافة هذه في Google OAuth Console:
https://*.yourapp.com/api/auth/callback/google
https://*.yourapp.vercel.app/api/auth/callback/google
```

### **DNS Configuration:**
```bash
# لكل عميل جديد:
CNAME: client-name.yourapp.com → yourapp.vercel.app
```

### **Environment Variables:**
```bash
# متغير واحد لجميع العملاء - لا حاجة للتكرار
GOOGLE_CLIENT_ID=same_for_all_clients
```

هذا النظام يوفر عليك تعديل OAuth لكل عميل ويجعل إدارة العملاء المتعددين سهلة جداً! 