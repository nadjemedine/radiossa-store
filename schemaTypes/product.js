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
                            description: 'مثال: أحمر أو أسود|#000000',
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
