export default {
    name: 'footer',
    title: 'Footer',
    type: 'document',
    fields: [
        {
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            description: 'Hex color code for footer background',
            validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
        },
        {
            name: 'textColor',
            title: 'Text Color',
            type: 'string',
            description: 'Hex color code for footer text',
            validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
        },
        {
            name: 'iconColor',
            title: 'Icon Color',
            type: 'string',
            description: 'Hex color code for footer icons',
            validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
        },
        {
            name: 'title',
            title: 'Footer Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Footer Description',
            type: 'text',
        },
        {
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'platform',
                            title: 'Platform',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Facebook', value: 'facebook' },
                                    { title: 'Instagram', value: 'instagram' },
                                    { title: 'Twitter', value: 'twitter' },
                                    { title: 'WhatsApp', value: 'whatsapp' },
                                    { title: 'TikTok', value: 'tiktok' },
                                    { title: 'YouTube', value: 'youtube' },
                                ]
                            }
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        },
                        {
                            name: 'icon',
                            title: 'Icon',
                            type: 'image',
                            options: {
                                hotspot: true,
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: 'quickLinks',
            title: 'Quick Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Link Title',
                            type: 'string',
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        }
                    ]
                }
            ]
        },
        {
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            fields: [
                {
                    name: 'phone',
                    title: 'Phone Number',
                    type: 'string',
                },
                {
                    name: 'email',
                    title: 'Email',
                    type: 'string',
                },
                {
                    name: 'address',
                    title: 'Address',
                    type: 'text',
                }
            ]
        },
        {
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'string',
        }
    ],
}