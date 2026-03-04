export default {
    name: 'rmExpressSettings',
    title: 'RM Express Settings',
    type: 'document',
    fields: [
        {
            name: 'apiUrl',
            title: 'API Base URL',
            type: 'url',
            description: 'Base URL for RM Express API (e.g., https://api.rmexpress.dz)',
        },
        {
            name: 'apiToken',
            title: 'API Token',
            type: 'string',
            description: 'Your RM Express API authentication token',
        },
        {
            name: 'storeName',
            title: 'Store Name',
            type: 'string',
            description: 'Your store name as it appears on RM Express',
            initialValue: 'Radiossa Store',
        },
        {
            name: 'storePhone',
            title: 'Store Phone',
            type: 'string',
            description: 'Your store phone number for RM Express',
        },
        {
            name: 'storeAddress',
            title: 'Store Address',
            type: 'text',
            description: 'Your store address for pickup',
        },
        {
            name: 'autoCreateShipment',
            title: 'Auto-create Shipment',
            type: 'boolean',
            description: 'Automatically create shipment in RM Express when order is placed',
            initialValue: true,
        },
        {
            name: 'defaultWeight',
            title: 'Default Package Weight (kg)',
            type: 'number',
            description: 'Default weight for packages if not specified',
            initialValue: 1,
        },
    ],
    preview: {
        select: {
            title: 'storeName',
            subtitle: 'apiUrl',
        },
    },
};
