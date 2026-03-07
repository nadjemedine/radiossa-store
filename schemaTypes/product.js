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
            name: 'colors',
            title: 'الوان المنتج المتاحة',
            description: 'اختر جميع الألوان المتاحة لهذا المنتج (يمكن اختيار أكثر من لون)',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: '⚫ أسود - Black', value: 'Black' },
                    { title: '⚪ أبيض - White', value: 'White' },
                    { title: '🔴 أحمر - Red', value: 'Red' },
                    { title: '🔵 أزرق - Blue / Bleu', value: 'Blue' },
                    { title: '🟢 أخضر - Green / Vert', value: 'Green' },
                    { title: '🟡 أصفر - Yellow', value: 'Yellow' },
                    { title: '🟤 بني - Brown', value: 'Brown' },
                    { title: '⚪ رمادي - Grey', value: 'Grey' },
                    { title: '🌸 وردي - Pink', value: 'Pink' },
                    { title: '🟠 برتقالي - Orange', value: 'Orange' },
                    { title: '🟣 بنفسجي - Purple / Violet', value: 'Purple' },
                    { title: '🔷 كحلي - Navy', value: 'Navy' },
                    { title: '🟤 بيج - Beige', value: 'Beige' },
                    { title: '🩶 فضي - Silver', value: 'Silver' },
                    { title: '🎨 ذهبي - Gold', value: 'Gold' },
                    { title: '🍒 كرزي - Cerise', value: 'Cerise' },
                    { title: '💜 أرجواني - Mauve', value: 'Mauve' },
                    { title: '💙 تركواز - Turquoise', value: 'Turquoise' },
                    { title: '💚 زيتوني - Olive', value: 'Olive' },
                    { title: '🧡 نبيتي - Bordeaux', value: 'Bordeaux' },
                    { title: '🤎 جملي - Camel', value: 'Camel' },
                    { title: '🖤 فحمي - Charcoal', value: 'Charcoal' },
                    { title: '🩵 سماوي - Sky', value: 'Sky' },
                    { title: '🩷 مرجاني - Coral', value: 'Coral' },
                    { title: '🤍 كريمي - Cream', value: 'Cream' },
                    { title: '🩴 خمري - Burgundy', value: 'Burgundy' },
                    { title: '🟰 موكا - Mocha', value: 'Mocha' },
                    { title: '🥉 برونزي - Bronze', value: 'Bronze' },
                ]
            }
        },
        {
            name: 'sizes',
            title: 'مقاسات المنتج المتاحة',
            description: 'اختر جميع المقاسات المتاحة لهذا المنتج (يمكن اختيار أكثر من مقاس)',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Standard / موحد', value: 'Standard' },
                    { title: 'Taille 1', value: 'Taille 1' },
                    { title: 'Taille 2', value: 'Taille 2' },
                    { title: 'Taille 3', value: 'Taille 3' },
                    { title: 'S', value: 'S' },
                    { title: 'M', value: 'M' },
                    { title: 'L', value: 'L' },
                    { title: 'XL', value: 'XL' },
                    { title: 'XXL', value: 'XXL' },
                    { title: '3XL', value: '3XL' },
                    { title: '36', value: '36' },
                    { title: '38', value: '38' },
                    { title: '40', value: '40' },
                    { title: '42', value: '42' },
                    { title: '44', value: '44' },
                    { title: '46', value: '46' },
                    { title: '48', value: '48' },
                    { title: '50', value: '50' },
                    { title: '52', value: '52' },
                ]
            }
        },
        {
            name: 'inventory',
            title: 'خانة الكمية (تفاصيل المخزون)',
            description: 'أدخل هنا التوليفة المحددة (لون + مقاس) والكمية الخاصة بكل منها.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'variant',
                    title: 'تحديد الكمية لخيار معين',
                    fields: [
                        {
                            name: 'color',
                            title: 'اللون',
                            type: 'string',
                            options: {
                                list: [
                                    { title: '⚫ أسود - Black', value: 'Black' },
                                    { title: '⚪ أبيض - White', value: 'White' },
                                    { title: '🔴 أحمر - Red', value: 'Red' },
                                    { title: '🔵 أزرق - Blue / Bleu', value: 'Blue' },
                                    { title: '🟢 أخضر - Green / Vert', value: 'Green' },
                                    { title: '🟡 أصفر - Yellow', value: 'Yellow' },
                                    { title: '🟤 بني - Brown', value: 'Brown' },
                                    { title: '⚪ رمادي - Grey', value: 'Grey' },
                                    { title: '🌸 وردي - Pink', value: 'Pink' },
                                    { title: '🟠 برتقالي - Orange', value: 'Orange' },
                                    { title: '🟣 بنفسجي - Purple / Violet', value: 'Purple' },
                                    { title: '🔷 كحلي - Navy', value: 'Navy' },
                                    { title: '🟤 بيج - Beige', value: 'Beige' },
                                    { title: '🩶 فضي - Silver', value: 'Silver' },
                                    { title: '🎨 ذهبي - Gold', value: 'Gold' },
                                    { title: '🍒 كرزي - Cerise', value: 'Cerise' },
                                    { title: '💜 أرجواني - Mauve', value: 'Mauve' },
                                    { title: '💙 تركواز - Turquoise', value: 'Turquoise' },
                                    { title: '💚 زيتوني - Olive', value: 'Olive' },
                                    { title: '🧡 نبيتي - Bordeaux', value: 'Bordeaux' },
                                    { title: '🤎 جملي - Camel', value: 'Camel' },
                                    { title: '🖤 فحمي - Charcoal', value: 'Charcoal' },
                                    { title: '🩵 سماوي - Sky', value: 'Sky' },
                                    { title: '🩷 مرجاني - Coral', value: 'Coral' },
                                    { title: '🤍 كريمي - Cream', value: 'Cream' },
                                    { title: '🩴 خمري - Burgundy', value: 'Burgundy' },
                                    { title: '🟰 موكا - Mocha', value: 'Mocha' },
                                    { title: '🥉 برونزي - Bronze', value: 'Bronze' },
                                ]
                            }
                        },
                        {
                            name: 'size',
                            title: 'المقاس',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Standard / موحد', value: 'Standard' },
                                    { title: 'Taille 1', value: 'Taille 1' },
                                    { title: 'Taille 2', value: 'Taille 2' },
                                    { title: 'Taille 3', value: 'Taille 3' },
                                    { title: 'S', value: 'S' },
                                    { title: 'M', value: 'M' },
                                    { title: 'L', value: 'L' },
                                    { title: 'XL', value: 'XL' },
                                    { title: 'XXL', value: 'XXL' },
                                    { title: '3XL', value: '3XL' },
                                    { title: '36', value: '36' },
                                    { title: '38', value: '38' },
                                    { title: '40', value: '40' },
                                    { title: '42', value: '42' },
                                    { title: '44', value: '44' },
                                    { title: '46', value: '46' },
                                    { title: '48', value: '48' },
                                    { title: '50', value: '50' },
                                    { title: '52', value: '52' },
                                ]
                            }
                        },
                        {
                            name: 'stock',
                            title: 'الكمية المتوفرة',
                            type: 'number',
                            initialValue: 0,
                            description: 'أدخل الكمية المتوفرة من هذا اللون والمقاس'
                        },
                    ],
                    preview: {
                        select: {
                            size: 'size',
                            color: 'color',
                            stock: 'stock',
                        },
                        prepare({ size = '', color = '', stock }) {
                            const colorTitle = color || 'بدون لون';
                            const sizeTitle = size || 'بدون مقاس';
                            return {
                                title: `${colorTitle} | ${sizeTitle}`,
                                subtitle: `الكمية: ${stock}`,
                            };
                        },
                    },
                },
            ],
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
