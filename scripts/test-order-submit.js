/**
 * Test Order Submission Script
 * 
 * This script tests the order submission flow without going through the UI.
 * Run with: node scripts/test-order-submit.js
 */

require('dotenv').config({ path: '.env.local' });
const { client } = require('../src/lib/sanity');

async function testOrderSubmission() {
    console.log('🧪 Testing Order Submission...\n');

    const testOrder = {
        _type: 'order',
        customerName: 'Test Customer',
        phone: '0540405278',
        wilaya: '16 - Alger (Test)',
        wilayaCode: '16',
        commune: 'Alger Centre',
        shippingType: 'Domicile',
        items: [
            {
                _key: 'test1',
                productName: 'Test Product',
                price: 2500,
                quantity: 1,
                color: 'Red',
                size: 'M'
            }
        ],
        shippingCost: 800,
        totalPrice: 3300,
        status: 'pending'
    };

    try {
        console.log('📝 Order data:', JSON.stringify(testOrder, null, 2));
        console.log('\n📤 Creating order in Sanity...');
        
        const result = await client.create(testOrder);
        console.log('✅ Order created successfully!');
        console.log('📋 Order ID:', result._id);
        console.log('🔗 Order URL:', `https://m3rey5o2.sanity.studio/desk/order;${result._id}`);
        
        return result;
    } catch (error) {
        console.error('❌ Order creation failed:', error.message);
        console.error('Details:', error);
        throw error;
    }
}

// Run the test
testOrderSubmission()
    .then(() => {
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
