export default {
    name: 'storeFront',
    title: 'Store Front',
    type: 'document',
    fields: [
        {
            name: 'productsTitle',
            title: 'Products Section Title',
            type: 'string',
            description: 'The title displayed above the products grid. Leave empty to hide the title.',
            initialValue: '',
        },
        {
            name: 'showProductsTitle',
            title: 'Show Products Title',
            type: 'boolean',
            description: 'Toggle the products section title on/off',
            initialValue: true,
        },
        {
            name: 'titleStyle',
            title: 'Title Style',
            type: 'string',
            description: 'Choose the visual style of the title',
            options: {
                list: [
                    { title: 'Bold Italic (Default)', value: 'bold-italic' },
                    { title: 'Bold', value: 'bold' },
                    { title: 'Elegant', value: 'elegant' },
                    { title: 'Uppercase', value: 'uppercase' },
                ],
                layout: 'radio',
            },
            initialValue: 'bold-italic',
        },
        {
            name: 'titleColor',
            title: 'Title Color',
            type: 'string',
            description: 'Color of the title text (hex code)',
            placeholder: '#000000',
            initialValue: '#000000',
        },
        {
            name: 'showUnderline',
            title: 'Show Underline',
            type: 'boolean',
            description: 'Show a decorative underline below the title',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'productsTitle',
        },
        prepare({ title }) {
            return {
                title: title || 'Store Front',
                subtitle: 'Products Section Configuration',
            };
        },
    },
}
