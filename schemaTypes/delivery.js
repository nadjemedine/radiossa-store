export default {
    name: 'delivery',
    title: 'Delivery Prices',
    type: 'document',
    fields: [
        {
            name: 'stateName',
            title: 'State Name (Wilaya)',
            type: 'string',
        },
        {
            name: 'homePrice',
            title: 'Home Delivery Price',
            type: 'number',
        },
        {
            name: 'officePrice',
            title: 'Office (Stopdesk) Price',
            type: 'number',
        },
        {
            name: 'duration',
            title: 'Delivery Duration',
            type: 'string',
        },
        {
            name: 'stateCode',
            title: 'State Code',
            type: 'string',
        }
    ],
}
