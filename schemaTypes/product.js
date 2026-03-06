export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'comparePrice',
            title: 'Compare Price (Discounted Price)',
            type: 'number',
            description: 'Original price for comparison (used to show discount)',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'images',
            title: 'Product Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                },
            ],
            description: 'Add multiple product images',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'colors',
            title: 'Available Colors',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        },
        {
            name: 'inventory',
            title: 'Inventory Management',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'size',
                            title: 'Size',
                            type: 'string',
                            description: 'Size name (e.g., S, M, L, XL)',
                        },
                        {
                            name: 'color',
                            title: 'Color',
                            type: 'string',
                            description: 'Color name (optional)',
                        },
                        {
                            name: 'stock',
                            title: 'Stock Quantity',
                            type: 'number',
                            description: 'Number of items in stock',
                            initialValue: 0,
                        },
                        {
                            name: 'sku',
                            title: 'SKU',
                            type: 'string',
                            description: 'Stock Keeping Unit (optional)',
                        },
                        {
                            name: 'trackInventory',
                            title: 'Track Inventory',
                            type: 'boolean',
                            description: 'Enable inventory tracking for this variant',
                            initialValue: true,
                        },
                        {
                            name: 'allowBackorder',
                            title: 'Allow Backorder',
                            type: 'boolean',
                            description: 'Allow customers to order when out of stock',
                            initialValue: false,
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
                                title: `${size} ${color ? `- ${color}` : ''}`,
                                subtitle: `Stock: ${stock}`,
                            };
                        },
                    },
                },
            ],
        },
        {
            name: 'category',
            title: 'Catégorie',
            type: 'reference',
            to: [{ type: 'category' }]
        },
        {
            name: 'autoHideOutOfStock',
            title: 'Auto-hide Out of Stock',
            type: 'boolean',
            description: 'Automatically hide product when all variants are out of stock',
            initialValue: true,
        },
    ],
}
