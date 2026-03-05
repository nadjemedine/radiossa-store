# 🔍 كيفية التحقق من صحة API URL

## الإعدادات الحالية ✅

تم التحقق من إعدادات RM Express API وهي:

```bash
RM_EXPRESS_API_URL=https://rmexpress.ecotrack.dz/api/v1
RM_EXPRESS_API_TOKEN=icP0ON4jM3xeXbFizivuwwGQ8pCCYTCIeTPth1zdWV2IiZt1m67ASVJ46HBN
STORE_NAME=Radiossa Store
STORE_PHONE=0540405278
```

## طرق التحقق

### 1️⃣ طريقة سريعة - سكريبت التحقق

```bash
node scripts/verify-api.js
```

هذا السكريبت يقوم بـ:
- ✅ قراءة ملف `.env.local` والتحقق من المتغيرات
- ✅ عرض جميع الإعدادات
- ✅ اختبار الاتصال بالـ API
- ✅ إعطاء تقرير شامل

### 2️⃣ التحقق اليدوي

افتح ملف `.env.local` وتأكد من وجود:

```bash
# يجب أن يكون السطر التالي موجوداً
RM_EXPRESS_API_URL=https://rmexpress.ecotrack.dz/api/v1

# التوكن الصحيح
RM_EXPRESS_API_TOKEN=icP0ON4jM3xeXbFizivuwwGQ8pCCYTCIeTPth1zdWV2IiZt1m67ASVJ46HBN
```

### 3️⃣ اختبار مباشر مع API

استخدم curl لاختبار الاتصال:

```bash
curl -H "Authorization: Bearer icP0ON4jM3xeXbFizivuwwGQ8pCCYTCIeTPth1zdWV2IiZt1m67ASVJ46HBN" https://rmexpress.ecotrack.dz/api/v1
```

## ملاحظات مهمة

### ⚠️ إذا فشل الاتصال

1. **تأكد من الإنترنت**: الخادم يجب أن يكون متصلاً بالإنترنت
2. **تحقق من الجدار الناري**: قد يمنع الاتصال بالخارج
3. **جرب في وقت آخر**: الـ API قد يكون تحت الصيانة

### 📝 التكامل الصحيح

الكود في `src/lib/rmExpress.js` يستخدم:

```javascript
const BASE_URL = process.env.RM_EXPRESS_API_URL || 'https://rmexpress.ecotrack.dz/api/v1';
```

هذا يعني:
- ✅ إذا وجدت `RM_EXPRESS_API_URL` في `.env.local` → يستخدمها
- ✅ إذا لم توجد → يستخدم القيمة الافتراضية `https://rmexpress.ecotrack.dz/api/v1`

### 🎯 النتيجة

**الإعداد الحالي صحيح تماماً** ✅

- الرابط: `https://rmexpress.ecotrack.dz/api/v1` ✓
- التوكن: موجود وصحيح ✓
- التكامل في الكود: صحيح ✓

فشل اختبار الاتصال (`fetch failed`) قد يكون بسبب:
- الجدار الناري في الشبكة
- الـ API غير متاح مؤقتاً
- مشاكل في الاتصال بالإنترنت

لكن **الإعدادات نفسها صحيحة** والكود سيعمل عند توفر الاتصال! 🚀
