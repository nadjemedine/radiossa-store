import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'm3rey5o2',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-10-01',
    token: 'skWC2e77rYOlXYrbAMaAIS9dMjfmF1rsjWnamMXTQSLgC0WXRtBwecQzkIADOF0ukFeOC3IZvcvwhkjoTV3spNrthrDHVMaKI1rVbNAsJhbL8XmTeQjn40Ikg8MCdNQfrqwZevyJGVdVJBFXjQtddwWW1gtSpSS70GvgKRgkAveiLRBwsfpy',
});

const deliveryData = [
    { id: 1, name: "أدرار", home: 1100, office: 850, duration: "2-7 أيام" },
    { id: 2, name: "الشلف", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 3, name: "الأغواط", home: 800, office: 450, duration: "24-96 ساعة" },
    { id: 4, name: "أم البواقي", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 5, name: "باتنة", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 6, name: "بجاية", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 7, name: "بسكرة", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 8, name: "بشار", home: 1000, office: 750, duration: "24-96 ساعة" },
    { id: 9, name: "البليدة", home: 500, office: 300, duration: "24-48 ساعة" },
    { id: 10, name: "البويرة", home: 700, office: 400, duration: "24-48 ساعة" },
    { id: 11, name: "تمنراست", home: 1100, office: 900, duration: "2-7 أيام" },
    { id: 12, name: "تبسة", home: 800, office: 450, duration: "24-72 ساعة" },
    { id: 13, name: "تلمسان", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 14, name: "تيارت", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 15, name: "تيزي وزو", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 16, name: "الجزائر", home: 400, office: 250, duration: "1-24 ساعة" },
    { id: 17, name: "الجلفة", home: 750, office: 450, duration: "24-96 ساعة" },
    { id: 18, name: "جيجل", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 19, name: "سطيف", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 20, name: "سعيدة", home: 700, office: 550, duration: "24-72 ساعة" },
    { id: 21, name: "سكيكدة", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 22, name: "سيدي بلعباس", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 23, name: "عنابة", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 24, name: "قالمة", home: 700, office: 500, duration: "24-72 ساعة" },
    { id: 25, name: "قسنطينة", home: 700, office: 400, duration: "24-48 ساعة" },
    { id: 26, name: "المدية", home: 600, office: 300, duration: "12-48 ساعة" },
    { id: 27, name: "مستغانم", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 28, name: "المسيلة", home: 700, office: 500, duration: "24-96 ساعة" },
    { id: 29, name: "معسكر", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 30, name: "ورقلة", home: 800, office: 500, duration: "2-6 أيام" },
    { id: 31, name: "وهران", home: 700, office: 400, duration: "24-48 ساعة" },
    { id: 32, name: "البيض", home: 900, office: 500, duration: "2-6 أيام" },
    { id: 33, name: "إليزي", home: 1200, office: 1100, duration: "2-7 أيام" },
    { id: 34, name: "برج بوعريريج", home: 700, office: 500, duration: "24-72 ساعة" },
    { id: 35, name: "بومرداس", home: 600, office: 300, duration: "12-48 ساعة" },
    { id: 36, name: "الطارف", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 37, name: "تندوف", home: 1300, office: 850, duration: "2-7 أيام" },
    { id: 38, name: "تسمسيلت", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 39, name: "الوادي", home: 700, office: 550, duration: "2-6 أيام" },
    { id: 40, name: "خنشلة", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 41, name: "سوق أهراس", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 42, name: "تيبازة", home: 600, office: 400, duration: "12-48 ساعة" },
    { id: 43, name: "ميلة", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 44, name: "عين الدفلى", home: 700, office: 400, duration: "24-48 ساعة" },
    { id: 45, name: "النعامة", home: 900, office: 650, duration: "2-6 أيام" },
    { id: 46, name: "عين تموشنت", home: 700, office: 450, duration: "24-72 ساعة" },
    { id: 47, name: "غرداية", home: 800, office: 450, duration: "2-4 أيام" },
    { id: 48, name: "غليزان", home: 700, office: 400, duration: "24-72 ساعة" },
    { id: 49, name: "تيميمون", home: 1000, office: 750, duration: "2-6 أيام" },
    { id: 51, name: "أولاد جلال", home: 800, office: 600, duration: "2-6 أيام" },
    { id: 53, name: "إن صالح", home: 1000, office: 1000, duration: "2-6 أيام" },
    { id: 55, name: "تقرت", home: 800, office: 550, duration: "2-6 أيام" },
    { id: 57, name: "المغير", home: 800, office: null, duration: "2-6 أيام" },
    { id: 58, name: "المنيعة", home: 1000, office: 700, duration: "2-6 أيام" },
];

async function seed() {
    console.log('Starting seed...');
    for (const item of deliveryData) {
        const doc = {
            _type: 'delivery',
            _id: `delivery-${item.id}`,
            stateName: item.name,
            stateCode: item.id.toString(),
            homePrice: item.home,
            officePrice: item.office,
            duration: item.duration,
        };
        await client.createOrReplace(doc);
        console.log(`Updated ${item.name}`);
    }
    console.log('Seed finished!');
}

seed().catch(console.error);
