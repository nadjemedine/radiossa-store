export default {
    name: 'settings',
    title: 'Settings',
    type: 'document',
    fields: [
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'logoWidth',
            title: 'Logo Width (px)',
            type: 'number',
            description: 'Width of the logo in pixels',
            initialValue: 250,
            validation: Rule => Rule.min(50).max(500),
        },
        {
            name: 'logoHeight',
            title: 'Logo Height (px)',
            type: 'number',
            description: 'Height of the logo in pixels',
            initialValue: 100,
            validation: Rule => Rule.min(30).max(200),
        },
        {
            name: 'logoColor',
            title: 'Logo Color Filter',
            type: 'string',
            description: 'Apply color filter to logo (hex color code or CSS filter value)',
            placeholder: 'e.g., #E0B0FF or invert(100%)',
        },
        {
            name: 'previewImage',
            title: 'Preview Image (For Social Sharing)',
            type: 'image',
            description: 'Image that appears when sharing the link on social media or messages',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'previewTitle',
            title: 'Preview Title',
            type: 'string',
            description: 'Title shown in social media previews',
            initialValue: 'Radiossa Clothing',
        },
        {
            name: 'previewDescription',
            title: 'Preview Description',
            type: 'text',
            description: 'Description shown in social media previews',
            initialValue: 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.',
        },
        {
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
        }
    ],
}
