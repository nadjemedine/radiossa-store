export default {
    name: 'preFooter',
    title: 'Pre-Footer',
    type: 'document',
    fields: [
        {
            name: 'enabled',
            title: 'Enable Pre-Footer',
            type: 'boolean',
            description: 'Toggle to show/hide the pre-footer section',
            initialValue: true,
        },
        {
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            description: 'Hex color code for pre-footer background',
            validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
        },
        {
            name: 'rectangle1',
            title: 'Rectangle 1',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'string',
                },
                {
                    name: 'icon',
                    title: 'Icon',
                    type: 'image',
                    options: {
                        hotspot: true,
                    }
                },
                {
                    name: 'iconSize',
                    title: 'Icon Size (px)',
                    type: 'number',
                    initialValue: 50,
                    validation: Rule => Rule.min(10).max(500),
                },
                {
                    name: 'backgroundColor',
                    title: 'Background Color',
                    type: 'string',
                    description: 'Hex color code for rectangle background',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'textColor',
                    title: 'Text Color',
                    type: 'string',
                    description: 'Hex color code for text',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'iconColor',
                    title: 'Icon Color',
                    type: 'string',
                    description: 'Hex color code for icon',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'widthPercentage',
                    title: 'Width Percentage',
                    type: 'number',
                    description: 'Width percentage (25 for full row of 4, 50 for half row of 2, etc.)',
                    initialValue: 25,
                    validation: Rule => Rule.min(10).max(100),
                },
            ]
        },
        {
            name: 'rectangle2',
            title: 'Rectangle 2',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'string',
                },
                {
                    name: 'icon',
                    title: 'Icon',
                    type: 'image',
                    options: {
                        hotspot: true,
                    }
                },
                {
                    name: 'iconSize',
                    title: 'Icon Size (px)',
                    type: 'number',
                    initialValue: 50,
                    validation: Rule => Rule.min(10).max(500),
                },
                {
                    name: 'backgroundColor',
                    title: 'Background Color',
                    type: 'string',
                    description: 'Hex color code for rectangle background',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'textColor',
                    title: 'Text Color',
                    type: 'string',
                    description: 'Hex color code for text',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'iconColor',
                    title: 'Icon Color',
                    type: 'string',
                    description: 'Hex color code for icon',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'widthPercentage',
                    title: 'Width Percentage',
                    type: 'number',
                    description: 'Width percentage (25 for full row of 4, 50 for half row of 2, etc.)',
                    initialValue: 25,
                    validation: Rule => Rule.min(10).max(100),
                },
            ]
        },
        {
            name: 'rectangle3',
            title: 'Rectangle 3',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'string',
                },
                {
                    name: 'icon',
                    title: 'Icon',
                    type: 'image',
                    options: {
                        hotspot: true,
                    }
                },
                {
                    name: 'iconSize',
                    title: 'Icon Size (px)',
                    type: 'number',
                    initialValue: 50,
                    validation: Rule => Rule.min(10).max(500),
                },
                {
                    name: 'backgroundColor',
                    title: 'Background Color',
                    type: 'string',
                    description: 'Hex color code for rectangle background',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'textColor',
                    title: 'Text Color',
                    type: 'string',
                    description: 'Hex color code for text',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'iconColor',
                    title: 'Icon Color',
                    type: 'string',
                    description: 'Hex color code for icon',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'widthPercentage',
                    title: 'Width Percentage',
                    type: 'number',
                    description: 'Width percentage (25 for full row of 4, 50 for half row of 2, etc.)',
                    initialValue: 25,
                    validation: Rule => Rule.min(10).max(100),
                },
            ]
        },
        {
            name: 'rectangle4',
            title: 'Rectangle 4',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'string',
                },
                {
                    name: 'icon',
                    title: 'Icon',
                    type: 'image',
                    options: {
                        hotspot: true,
                    }
                },
                {
                    name: 'iconSize',
                    title: 'Icon Size (px)',
                    type: 'number',
                    initialValue: 50,
                    validation: Rule => Rule.min(10).max(500),
                },
                {
                    name: 'backgroundColor',
                    title: 'Background Color',
                    type: 'string',
                    description: 'Hex color code for rectangle background',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'textColor',
                    title: 'Text Color',
                    type: 'string',
                    description: 'Hex color code for text',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'iconColor',
                    title: 'Icon Color',
                    type: 'string',
                    description: 'Hex color code for icon',
                    validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
                },
                {
                    name: 'widthPercentage',
                    title: 'Width Percentage',
                    type: 'number',
                    description: 'Width percentage (25 for full row of 4, 50 for half row of 2, etc.)',
                    initialValue: 25,
                    validation: Rule => Rule.min(10).max(100),
                },
            ]
        },
    ],
}