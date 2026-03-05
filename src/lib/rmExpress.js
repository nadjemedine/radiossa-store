const BASE_URL = process.env.RM_EXPRESS_API_URL || 'https://rmexpress.ecotrack.dz/api/v1';
const API_TOKEN = process.env.RM_EXPRESS_API_TOKEN;

/**
 * Create a new shipment in RM Express system
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Shipment result
 */
export async function createShipment(orderData) {
    try {
        if (!API_TOKEN) {
            console.error('RM Express API token is missing');
            return {
                success: false,
                error: 'API token not configured',
            };
        }

        // تحضير الروابط (Params) حسب توثيق curl
        const params = new URLSearchParams({
            reference: orderData.orderId || orderData.reference || '',
            nom_client: orderData.customerName || orderData.name || '',
            telephone: orderData.phone || '',
            telephone_2: orderData.phone2 || '',
            adresse: orderData.address || '',
            commune: orderData.commune || '',
            code_wilaya: orderData.wilaya || '', // تأكد من إرسال كود الولاية إذا كان مطلوباً كرقم
            montant: orderData.totalPrice || orderData.cod_amount || 0,
            remarque: orderData.remark || '',
            produit: orderData.items?.map(item => item.productName).join(', ') || orderData.description || '',
            type: orderData.type || '1', // 1 للتوصيل العادي غالباً
            stop_desk: orderData.stop_desk || '0'
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // تأكد من أن BASE_URL ينتهي بـ /api/v1
        const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        const url = `${cleanBaseUrl}/create/order?${params.toString()}`;

        console.log('🔗 Sending request to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Accept': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create shipment');
        }

        return {
            success: true,
            trackingNumber: data.tracking_number || data.reference || data.id,
            data: data,
        };
    } catch (error) {
        console.error('RM Express shipment creation error:', error);
        return {
            success: false,
            error: error.name === 'AbortError' ? 'RM Express API connection timed out' : error.message,
        };
    }
}

/**
 * Track a shipment by tracking number
 * @param {string} trackingNumber 
 * @returns {Promise<Object>} Tracking status
 */
export async function trackShipment(trackingNumber) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

        const response = await fetch(`${BASE_URL}/tracking/${trackingNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Tracking information not found');
        }

        const data = await response.json();

        return {
            success: true,
            status: data.status,
            history: data.history,
        };
    } catch (error) {
        console.error('RM Express tracking error:', error);
        return {
            success: false,
            error: error.name === 'AbortError' ? 'RM Express API connection timed out' : error.message,
        };
    }
}
