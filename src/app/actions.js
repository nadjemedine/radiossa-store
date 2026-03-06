'use server';

import { client } from '@/lib/sanity';
import { sendOrderNotification } from '@/lib/email';
import { createShipment } from '@/lib/rmExpress';
import { updateProductInventory } from './inventory-actions';

export async function submitOrder(orderDoc) {
    try {
        console.log('Creating order in Sanity:', orderDoc);
        
        // Save order to Sanity
        const result = await client.create(orderDoc);
        console.log('Order created in Sanity with ID:', result._id);

        const wilayaRaw = String(orderDoc.wilaya || '');
        const wilayaCodeFromInput = String(orderDoc.wilayaCode || '').trim();
        const wilayaCodeMatch = wilayaRaw.match(/\d+/);
        const wilayaCode = wilayaCodeFromInput || (wilayaCodeMatch ? wilayaCodeMatch[0].padStart(2, '0') : '');
        const isDeskDelivery = String(orderDoc.shippingType || '').toLowerCase().includes('bureau')
            || String(orderDoc.shippingType || '').toLowerCase().includes('desk');
        const normalizedAddress = [orderDoc.commune, orderDoc.wilaya].filter(Boolean).join(', ');
        const itemsSummary = (orderDoc.items || [])
            .map((item, index) => {
                const name = item.productName || item.name || 'N/A';
                const price = item.price ?? 0;
                const quantity = item.quantity ?? 1;
                const color = item.color || 'N/A';
                const size = item.size || 'N/A';
                return `${index + 1}) ${name} | Price:${price} | Qty:${quantity} | Color:${color} | Size:${size}`;
            })
            .join(' || ');
        const fullOrderRemark = [
            `ShippingType:${orderDoc.shippingType || 'N/A'}`,
            `Wilaya:${orderDoc.wilaya || 'N/A'}`,
            `Commune:${orderDoc.commune || 'N/A'}`,
            `Items:${itemsSummary || 'N/A'}`,
        ].join(' | ');

        // Send order to RM Express for delivery
        const rmExpressData = {
            customerName: orderDoc.customerName,
            phone: orderDoc.phone,
            wilaya: wilayaCode,
            wilayaName: orderDoc.wilaya,
            commune: orderDoc.commune,
            shippingType: orderDoc.shippingType,
            address: normalizedAddress,
            stop_desk: isDeskDelivery ? '1' : '0',
            items: orderDoc.items,
            productName: orderDoc.items
                ?.map((item) => item.productName || item.name)
                .filter(Boolean)
                .join(', '),
            totalPrice: orderDoc.totalPrice,
            shippingCost: orderDoc.shippingCost,
            remark: fullOrderRemark,
            orderId: result._id,
        };

        console.log('Sending to RM Express:', rmExpressData);
        const shipmentResult = await createShipment(rmExpressData);
        console.log('RM Express response:', shipmentResult);

        // Update Sanity order with RM Express tracking number if successful
        if (shipmentResult.success && shipmentResult.trackingNumber) {
            const rmPatch = {
                rmExpressTrackingNumber: shipmentResult.trackingNumber,
                rmExpressStatus: 'created',
            };
            if (shipmentResult.source) {
                rmPatch.rmExpressSource = shipmentResult.source;
            }
            await client.patch(result._id).set(rmPatch).commit();
            console.log('Updated Sanity order with RM Express tracking:', shipmentResult.trackingNumber);
        } else {
            console.warn('RM Express shipment failed, but order was created. Error:', shipmentResult.error);
            const rmPatch = {
                rmExpressStatus: 'failed',
                rmExpressError: shipmentResult.error || 'Unknown RM Express error',
            };
            if (shipmentResult.source) {
                rmPatch.rmExpressSource = shipmentResult.source;
            }
            await client.patch(result._id).set(rmPatch).commit();
            // Don't fail the entire order if RM Express fails - order is still saved
        }

        // Update product inventory
        // Extract product IDs and items from order
        const inventoryUpdates = [];
        for (const item of orderDoc.items) {
            if (item.productId) {
                const inventoryResult = await updateProductInventory(item.productId, [item]);
                inventoryUpdates.push({
                    productId: item.productId,
                    productName: item.productName,
                    ...inventoryResult,
                });
            }
        }

        // Send email notification
        console.log('Sending email notification...');
        const emailResult = await sendOrderNotification(orderDoc);
        console.log('Email result:', emailResult);

        return {
            success: true,
            orderId: result._id,
            trackingNumber: shipmentResult.trackingNumber,
            rmExpressSuccess: shipmentResult.success,
            rmExpressError: shipmentResult.error,
            inventoryUpdated: inventoryUpdates,
            emailSent: emailResult.success,
            emailError: emailResult.error,
        };
    } catch (error) {
        console.error("Order submission error (server):", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return {
            success: false,
            error: error.message || "Failed to submit order"
        };
    }
}

