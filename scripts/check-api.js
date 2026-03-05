import { createShipment } from '../src/lib/rmExpress.js';

console.log('🔍 التحقق من إعدادات RM Express API\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// التحقق من المتغيرات
const baseUrl = process.env.RM_EXPRESS_API_URL;
const apiToken = process.env.RM_EXPRESS_API_TOKEN;

console.log('📋 متغيرات البيئة:');
console.log(`   Base URL: ${baseUrl || '❌ غير موجود'}`);
console.log(`   API Token: ${apiToken ? '✅ موجود' : '❌ غير موجود'}`);
console.log(`   Store Name: ${process.env.STORE_NAME || 'غير موجود'}`);
console.log(`   Store Phone: ${process.env.STORE_PHONE || 'غير موجود'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!baseUrl) {
    console.log('❌ خطأ: RM_EXPRESS_API_URL غير موجود في ملف .env.local\n');
    process.exit(1);
}

if (!apiToken) {
    console.log('❌ خطأ: RM_EXPRESS_API_TOKEN غير موجود في ملف .env.local\n');
    process.exit(1);
}

console.log('✅ جميع الإعدادات صحيحة!\n');
console.log('📝 المعلومات:');
console.log(`   الرابط: ${baseUrl}`);
console.log(`   التوكن: ${apiToken.substring(0, 20)}...`);
console.log(`   المتجر: ${process.env.STORE_NAME}`);
console.log(`   الهاتف: ${process.env.STORE_PHONE}\n`);

// اختبار الاتصال
async function testConnection() {
    try {
        console.log('🌐 جاري اختبار الاتصال بـ API...\n');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // محاولة الاتصال بالرابط الأساسي
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API متصل ويستجيب!');
            console.log('الاستجابة:', JSON.stringify(data, null, 2));
        } else {
            console.log(`⚠️ API استجاب بحالة: ${response.status}`);
            console.log('هذا طبيعي - بعض APIs لا تملك نقطة نهاية عامة');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ انتهى الوقت المحدد للاتصال (5 ثواني)');
        } else {
            console.log('⚠️ تعذر الاتصال - تأكد من صحة الرابط والتوكن');
        }
        console.log('\nالتفاصيل:', error.message);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ اكتمل الاختبار!\n');
}

testConnection().catch(console.error);
