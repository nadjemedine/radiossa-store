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
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
        }
    ],
}
