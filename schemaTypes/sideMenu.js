export default {
    name: 'sideMenu',
    title: 'Side Menu',
    type: 'document',
    fields: [
        {
            name: 'menuTitle',
            title: 'Menu Title',
            type: 'string',
            description: 'Title displayed at the top of the menu',
            initialValue: 'Menu',
        },
        {
            name: 'collectionsHeading',
            title: 'Collections Section Heading',
            type: 'string',
            description: 'Heading for the collections/categories section (e.g., "Achats par collection")',
            initialValue: 'Achats par collection',
        },
        {
            name: 'showCollectionsHeading',
            title: 'Show Collections Heading',
            type: 'boolean',
            description: 'Toggle to show/hide the collections section heading in the store interface',
            initialValue: true,
        },
        {
            name: 'collectionsHeadingAlignment',
            title: 'Heading Alignment',
            type: 'string',
            options: {
                list: [
                    { title: 'Left (يسار)', value: 'left' },
                    { title: 'Center (منتصف)', value: 'center' },
                    { title: 'Right (يمين)', value: 'right' },
                ],
                layout: 'radio',
            },
            initialValue: 'left',
        },
        {
            name: 'collectionsHeadingStyle',
            title: 'Heading Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Normal (عادي)', value: 'normal' },
                    { title: 'Bold (عريض)', value: 'bold' },
                    { title: 'Italic (مائل)', value: 'italic' },
                    { title: 'Bold Italic (عريض مائل)', value: 'bold-italic' },
                ],
                layout: 'radio',
            },
            initialValue: 'bold-italic',
        },
        {
            name: 'collectionsHeadingColor',
            title: 'Heading Color',
            type: 'string',
            description: 'Hex color code for the heading text',
            placeholder: '#000000',
            initialValue: '#000000',
        },
        {
            name: 'showCollections',
            title: 'Show Collections',
            type: 'boolean',
            description: 'Toggle to show/hide the collections section in the menu',
            initialValue: true,
        },
        {
            name: 'collections',
            title: 'Collections to Display',
            type: 'array',
            description: 'Choose which collections/categories appear in the menu. Leave empty to show all categories.',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'category' }],
                },
            ],
        },
        {
            name: 'pagesHeading',
            title: 'Pages Section Heading',
            type: 'string',
            description: 'Heading for the pages section (e.g., "Pages")',
            initialValue: 'Pages',
        },
        {
            name: 'showPages',
            title: 'Show Pages Section',
            type: 'boolean',
            description: 'Toggle to show/hide the pages section in the menu',
            initialValue: true,
        },
        {
            name: 'pages',
            title: 'Menu Pages',
            type: 'array',
            description: 'Custom pages/links to display in the menu',
            of: [
                {
                    type: 'object',
                    name: 'menuPage',
                    title: 'Menu Page',
                    fields: [
                        {
                            name: 'title',
                            title: 'Page Title',
                            type: 'string',
                            validation: Rule => Rule.required(),
                        },
                        {
                            name: 'pageType',
                            title: 'Page Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Home (Accueil)', value: 'home' },
                                    { title: 'Cart (Panier)', value: 'cart' },
                                    { title: 'Suivi de commande', value: 'tracking' },
                                    { title: 'Contact', value: 'contact' },
                                    { title: 'External Link', value: 'external' },
                                    { title: 'WhatsApp', value: 'whatsapp' },
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'Facebook', value: 'facebook' },
                                ],
                            },
                            initialValue: 'home',
                        },
                        {
                            name: 'url',
                            title: 'URL / Link',
                            type: 'string',
                            description: 'External URL (for external links, WhatsApp, Instagram, Facebook)',
                            hidden: ({ parent }) => !['external', 'whatsapp', 'instagram', 'facebook'].includes(parent?.pageType),
                        },
                        {
                            name: 'icon',
                            title: 'Custom Icon',
                            type: 'image',
                            description: 'Optional custom icon for this page',
                            options: { hotspot: true },
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'pageType',
                            media: 'icon',
                        },
                    },
                },
            ],
        },
        {
            name: 'showFooterInfo',
            title: 'Show Footer Info in Menu',
            type: 'boolean',
            description: 'Toggle to show/hide the bottom section of the menu',
            initialValue: true,
        },
        {
            name: 'footerText',
            title: 'Menu Footer Text',
            type: 'string',
            description: 'Optional text at the bottom of the menu',
            placeholder: 'e.g., © 2025 Radiossa',
        },
    ],
    preview: {
        prepare() {
            return {
                title: 'Side Menu',
                subtitle: 'Menu Configuration',
            };
        },
    },
}
