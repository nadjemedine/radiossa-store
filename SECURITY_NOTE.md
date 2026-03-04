# 🔒 معلومات حساسة - لا ترفعها!

## الملفات التي يجب ألا تُرفع أبداً:

### ❌ **لا ترفع هذه الملفات:**

1. **`src/lib/rmExpress.js`** - يحتوي على API token
2. **`.env.local`** - يحتوي على جميع الأسرار
3. **`src/app/inventory-actions.js`** - منطق داخلي حساس

### ✅ **الملفات الآمنة للرفع:**

- `schemaTypes/product.js` ✓
- `schemaTypes/rmExpressSettings.js` ✓
- `src/app/page.js` ✓
- `src/app/actions.js` ✓
- `src/app/api/revalidate/route.js` ✓

---

## 🛡️ كيفية حماية مفاتيح API:

### 1. **استخدم `.env.local`**

```env
# .env.local
RM_EXPRESS_API_TOKEN=your_token_here
NEXT_PUBLIC_RM_EXPRESS_API_URL=https://api.rmexpress.ecotrack.dz
```

### 2. **أضف `.env.local` إلى `.gitignore`**

```gitignore
# .gitignore
.env.local
*.local
```

### 3. **أنشئ ملف `.env.example`**

```env
# .env.example (آمن للرفع)
RM_EXPRESS_API_TOKEN=your_token_here
NEXT_PUBLIC_RM_EXPRESS_API_URL=
```

---

## 📝 خطوات إنشاء تكامل RM Express بأمان:

### الخطوة 1: أنشئ ملف rmExpress.js محلياً

```javascript
// src/lib/rmExpress.js
const BASE_URL = process.env.NEXT_PUBLIC_RM_EXPRESS_API_URL;
const API_TOKEN = process.env.RM_EXPRESS_API_TOKEN;

export async function createShipment(orderData) {
    const response = await fetch(`${BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(orderData),
    });
    
    return await response.json();
}
```

**⚠️ مهم:** لا ترفع هذا الملف أبداً!

### الخطوة 2: أضفه إلى `.gitignore`

```bash
# .gitignore
src/lib/rmExpress.js
```

### الخطوة 3: استخدمه في actions.js

```javascript
// src/app/actions.js
import { createShipment } from '@/lib/rmExpress'; // ملف محمي

export async function submitOrder(orderDoc) {
    // ... حفظ الطلب
    
    // إرسال إلى RM Express
    const shipment = await createShipment(orderData);
    
    // ... إكمال المعالجة
}
```

---

## 🔐 أفضل الممارسات:

### ✅ افعل:

1. استخدم متغيرات البيئة دائماً
2. أضف الملفات الحساسة إلى `.gitignore`
3. أنشئ ملف `.env.example` للآخرين
4. راجع الملفات قبل الـ commit
5. استخدم `git status` للتحقق

### ❌ لا تفعل:

1. لا تضع API tokens في الكود مباشرة
2. لا ترفع `.env.local` أبداً
3. لا تشارك مفاتيح API في chat
4. لا تستخدم `console.log` للطباعة المفاتيح
5. لا ترفع ملفات تحتوي على كلمات مثل: "token", "secret", "key"

---

## 🚨 إذا رفقت معلومات حساسة بالخطأ:

### 1. **احذف الملف فوراً**

```bash
git rm --cached src/lib/rmExpress.js
git commit -m "Remove sensitive file"
```

### 2. **غيّر المفتاح**

إذا كان API token، قم بإنشاء واحد جديد من لوحة التحكم

### 3. **تأكد من `.gitignore`**

```bash
echo "src/lib/rmExpress.js" >> .gitignore
```

### 4. **ارفع التغييرات**

```bash
git push origin main
```

---

## 📋 قائمة تحقق قبل الـ commit:

```bash
# 1. تحقق من الملفات المعدلة
git status

# 2. تحقق من المحتوى
git diff

# 3. ابحث عن كلمات حساسة
grep -r "API_TOKEN\|SECRET\|KEY" src/

# 4. تأكد من .gitignore
cat .gitignore

# 5. راجع الملفات الجديدة
git ls-files --others --exclude-standard
```

---

## 🎯 الملفات الحالية في المشروع:

### آمنة ✓:
- ✅ `schemaTypes/rmExpressSettings.js` - schema فقط
- ✅ `src/app/api/revalidate/route.js` - webhook بدون أسرار
- ✅ `src/app/page.js` - منطق الفلترة
- ✅ `src/app/actions.js` - مبسّط بدون API calls

### محظورة ❌:
- ❌ `src/lib/rmExpress.js` - حذف
- ❌ `src/app/inventory-actions.js` - حذف
- ❌ `.env.local` - محمي بـ .gitignore
- ❌ `INVENTORY_GUIDE.md` - حذف
- ❌ `INVENTORY_UPDATE.md` - حذف

---

## 💡 نصيحة مهمة:

**قبل كل commit، اسأل نفسك:**
- هل هذا الملف يحتوي على مفاتيح API؟
- هل يمكن لشخص آخر استخدام هذا الكود؟
- هل أضع أي بيانات حساسة؟

إذا كانت الإجابة "نعم" ← **لا ترفعه!**

---

**الأمان أولاً! 🔒**
