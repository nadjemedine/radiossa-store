export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'اسم المنتج',
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug (الرابط)',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'images',
            title: 'صور المنتج',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                },
            ],
            description: 'أضف جميع صور المنتج هنا. سيتم عرضها كمعرض صور.',
            validation: Rule => Rule.required().min(1),
        },
        {
            name: 'price',
            title: 'السعر الحالي',
            type: 'number',
            validation: Rule => Rule.required(),
        },
        {
            name: 'comparePrice',
            title: 'السعر القديم (للتخفيض)',
            type: 'number',
            description: 'السعر الأصلي قبل التخفيض ليظهر مشطوباً',
        },
        {
            name: 'inventory',
            title: 'المخزون والخيارات (المقاس واللون)',
            description: 'أدخل هنا كل مقاس ولون مع الكمية الخاصة به',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'variant',
                    title: 'خيار المنتج',
                    fields: [
                        {
                            name: 'size',
                            title: 'المقاس',
                            type: 'string',
                            description: 'مثال: M, L, XL أو 42, 43',
                        },
                        {
                            name: 'color',
                            title: 'اللون',
                            type: 'string',
                            description: 'مثال: أحمر أو أسود أو Rouge أو Noir',
                        },
                        {
                            name: 'colorHex',
                            title: 'لون الزر (Hex Code)',
                            type: 'string',
                            description: 'مثال: #000000 للأسود، #ef4444 للأحمر',
                            options: {
                                list: [
                                    { title: '⚫ أسود', value: '#000000' },
                                    { title: '⚪ أبيض', value: '#FFFFFF' },
                                    { title: '🔴 أحمر', value: '#ef4444' },
                                    { title: '🔵 أزرق', value: '#3b82f6' },
                                    { title: '🟢 أخضر', value: '#22c55e' },
                                    { title: '🟡 أصفر', value: '#eab308' },
                                    { title: '🟤 بني', value: '#92400e' },
                                    { title: '⚪ رمادي', value: '#6b7280' },
                                    { title: '🌸 وردي', value: '#ec4899' },
                                    { title: '🟠 برتقالي', value: '#f97316' },
                                    { title: '🟣 بنفسجي', value: '#8b5cf6' },
                                    { title: '🔷 كحلي', value: '#1e3a8a' },
                                    //新增颜色
                                    { title: '🟤 بيج', value: '#d4c4a8' },
                                    { title: '🩶 فضي', value: '#c0c0c0' },
                                    { title: '🎨 ذهبي', value: '#ffd700' },
                                    { title: '✨ فضي معدني', value: '#silver' },
                                    { title: '💜 أرجواني', value: '#9b59b6' },
                                    { title: '💙 تركواز', value: '#40e0d0' },
                                    { title: '💚 زيتوني', value: '#808000' },
                                    { title: '🧡 نبيتي', value: '#722f37' },
                                    { title: '🤎 جملي', value: '#c19a6b' },
                                    { title: '🖤 فحمي', value: '#36454f' },
                                    { title: '🩵 سماوي', value: '#87ceeb' },
                                    { title: '🩷 مرجاني', value: '#ff7f50' },
                                    { title: '🤍 كريمي', value: '#fffdd0' },
                                    { title: '🩴 خمري', value: '#800020' },
                                    { title: '🟰 موكا', value: '#967969' },
                                    { title: '🥉 برونزي', value: '#cd7f32' },
                                ]
                            }
                        },
                        {
                            name: 'stock',
                            title: 'الكمية المتوفرة',
                            type: 'number',
                            initialValue: 0,
                        },
                    ],
                    preview: {
                        select: {
                            size: 'size',
                            color: 'color',
                            stock: 'stock',
                        },
                        prepare({ size, color, stock }) {
                            return {
                                title: `${size || 'بدون مقاس'} ${color ? `- ${color}` : ''}`,
                                subtitle: `الكمية: ${stock}`,
                            };
                        },
                    },
                },
            ],
            validation: Rule => Rule.required().min(1),
        },
        {
            name: 'description',
            title: 'وصف المنتج',
            type: 'text',
        },
        {
            name: 'category',
            title: 'التصنيف',
            type: 'reference',
            to: [{ type: 'category' }]
        },
        {
            name: 'autoHideOutOfStock',
            title: 'إخفاء تلقائي عند نفاد المخزون',
            type: 'boolean',
            description: 'إخفاء المنتج من المتجر عندما تنفد جميع الكميات',
            initialValue: true,
        },
    ],
}
