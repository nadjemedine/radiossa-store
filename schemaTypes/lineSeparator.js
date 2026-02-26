export default {
    name: 'lineSeparator',
    title: 'Line Separator',
    type: 'document',
    fields: [
        {
            name: 'enabled',
            title: 'Enable Line Separator',
            type: 'boolean',
            description: 'Toggle to show/hide the line separator between pre-footer and footer',
            initialValue: true,
        },
        {
            name: 'thickness',
            title: 'Line Thickness',
            type: 'number',
            description: 'Thickness of the line in pixels',
            initialValue: 1,
            validation: Rule => Rule.min(1).max(10),
        },
        {
            name: 'style',
            title: 'Line Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Solid', value: 'solid' },
                    { title: 'Dashed', value: 'dashed' },
                    { title: 'Dotted', value: 'dotted' },
                ],
                layout: 'radio',
            },
            initialValue: 'solid',
        },
        {
            name: 'color',
            title: 'Line Color',
            type: 'string',
            description: 'Hex color code for the line',
            initialValue: '#e5e7eb',
            validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
        },
        {
            name: 'margin',
            title: 'Vertical Margin',
            type: 'number',
            description: 'Space above and below the line in pixels',
            initialValue: 20,
            validation: Rule => Rule.min(0).max(100),
        },
    ],
}