import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 التحقق من إعدادات RM Express API\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
    // قراءة ملف .env.local
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    
    // تحليل المتغيرات
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            if (!line.startsWith('#')) {
                envVars[key.trim()] = value;
            }
        }
    });
    
    const baseUrl = envVars.RM_EXPRESS_API_URL;
    const apiToken = envVars.RM_EXPRESS_API_TOKEN;
    const storeName = envVars.STORE_NAME;
    const storePhone = envVars.STORE_PHONE;
    
    console.log('📋 متغيرات البيئة من .env.local:');
    console.log(`   Base URL: ${baseUrl || '❌ غير موجود'}`);
    console.log(`   API Token: ${apiToken ? '✅ موجود' : '❌ غير موجود'}`);
    console.log(`   Store Name: ${storeName || '❌ غير موجود'}`);
    console.log(`   Store Phone: ${storePhone || '❌ غير موجود'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (!baseUrl) {
        console.log('❌ خطأ: RM_EXPRESS_API_URL غير موجود\n');
        process.exit(1);
    }
    
    if (!apiToken) {
        console.log('❌ خطأ: RM_EXPRESS_API_TOKEN غير موجود\n');
        process.exit(1);
    }
    
    console.log('✅ جميع الإعدادات صحيحة!\n');
    console.log('📝 المعلومات المؤكدة:');
    console.log(`   الرابط: ${baseUrl}`);
    console.log(`   التوكن: ${apiToken.substring(0, 20)}...`);
    console.log(`   المتجر: ${storeName}`);
    console.log(`   الهاتف: ${storePhone}\n`);
    
    // اختبار الاتصال
    console.log('🌐 جاري اختبار الاتصال بـ API...\n');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
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
            console.log('⚠️ انتهى الوقت المحدد للاتصال (5 ثواني)');
        } else {
            console.log('⚠️ تعذر الاتصال بالتطبيق');
        }
        console.log('\nالتفاصيل:', error.message);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ اكتمل الاختبار!\n');
    
} catch (error) {
    console.error('❌ خطأ في قراءة الملف:', error.message);
    process.exit(1);
}
