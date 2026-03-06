export default {
    name: 'order',
    title: 'Orders',
    type: 'document',
    fields: [
        {
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'wilaya',
            title: 'Wilaya',
            type: 'string',
        },
        {
            name: 'wilayaCode',
            title: 'Wilaya Code',
            type: 'string',
            description: 'Two-digit wilaya code (e.g., "16" for Algiers)',
        },
        {
            name: 'commune',
            title: 'Commune',
            type: 'string',
        },
        {
            name: 'shippingType',
            title: 'Shipping Type',
            type: 'string',
        },
        {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'productName', type: 'string' },
                        { name: 'price', type: 'number' },
                        { name: 'quantity', type: 'number' },
                        { name: 'color', type: 'string' },
                        { name: 'size', type: 'string' }
                    ]
                }
            ]
        },
        {
            name: 'shippingCost',
            title: 'Shipping Cost',
            type: 'number',
        },
        {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
        },
        {
            name: 'status',
            title: 'Order Status',
            type: 'string',
            initialValue: 'pending',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Confirmed', value: 'confirmed' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' }
                ]
            }
        },
        {
            name: 'rmExpressSource',
            title: 'RM Express Source',
            type: 'string',
            description: 'Configuration source used for RM Express request (env or schema)',
            options: {
                list: [
                    { title: 'Environment (.env)', value: 'env' },
                    { title: 'Sanity Schema Settings', value: 'schema' }
                ]
            },
            readOnly: true,
        },
        {
            name: 'rmExpressTrackingNumber',
            title: 'RM Express Tracking Number',
            type: 'string',
            readOnly: true,
        },
        {
            name: 'rmExpressStatus',
            title: 'RM Express Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Created', value: 'created' },
                    { title: 'Failed', value: 'failed' }
                ]
            },
            readOnly: true,
        },
        {
            name: 'rmExpressError',
            title: 'RM Express Error',
            type: 'text',
            readOnly: true,
        }
    ],
    preview: {
        select: {
            title: 'customerName',
            subtitle: 'phone'
        }
    }
}
