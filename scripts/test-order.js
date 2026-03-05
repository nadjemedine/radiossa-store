import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            if (!line.startsWith('#')) envVars[key.trim()] = value;
        }
    });

    const API_TOKEN = envVars.RM_EXPRESS_API_TOKEN;

    // سأقوم بتجربة الرابط الأول (v1) والرابط الثاني (بدون v1) كما هو في طلب المستخدم
    const urls = [
        "https://rmexpress.ecotrack.dz/api/v1/create/order",
        "https://rmexpress.ecotrack.dz/api/create/order"
    ];

    const testOrder = {
        reference: "TEST_" + Date.now(),
        nom_client: "Test Nadjem",
        telephone: "0555555555",
        adresse: "Rue Didouche Mourad",
        commune: "Alger Centre",
        code_wilaya: "16",
        montant: "5500",
        produit: "Montre Radiossa x1",
        type: "1",
        stop_desk: "0"
    };

    const params = new URLSearchParams(testOrder);

    for (const baseUrl of urls) {
        console.log(`\n🔄 جاري التجربة على الرابط: ${baseUrl}`);
        const fullUrl = `${baseUrl}?${params.toString()}`;

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json().catch(() => null);

            if (response.ok) {
                console.log('✅ تم بنجاح!');
                console.log('الاستجابة:', JSON.stringify(data, null, 2));
                break; // إذا نجح نتوقف
            } else {
                console.log(`❌ فشل (خطأ ${response.status})`);
                if (data) console.log('الرسالة:', data.message || JSON.stringify(data));
            }
        } catch (e) {
            console.log('❌ خطأ في الاتصال:', e.message);
        }
    }

} catch (error) {
    console.error('❌ خطأ:', error.message);
}
