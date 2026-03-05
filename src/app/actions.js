'use server';

import { client } from '@/lib/sanity';
import { sendOrderNotification } from '@/lib/email';
import { createShipment } from '@/lib/rmExpress';
import { updateProductInventory } from './inventory-actions';

export async function submitOrder(orderDoc) {
    try {
        // Save order to Sanity
        const result = await client.create(orderDoc);

        // Send order to RM Express for delivery
        const rmExpressData = {
            customerName: orderDoc.customerName,
            phone: orderDoc.phone,
            wilaya: orderDoc.wilaya,
            commune: orderDoc.commune,
            items: orderDoc.items,
            totalPrice: orderDoc.totalPrice,
            orderId: result._id,
        };

        const shipmentResult = await createShipment(rmExpressData);

        // Update Sanity order with RM Express tracking number if successful
        if (shipmentResult.success && shipmentResult.trackingNumber) {
            await client.patch(result._id).set({
                rmExpressTrackingNumber: shipmentResult.trackingNumber,
                rmExpressStatus: 'created',
            }).commit();
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
        const emailResult = await sendOrderNotification(orderDoc);

        return {
            success: true,
            orderId: result._id,
            trackingNumber: shipmentResult.trackingNumber,
            rmExpressSuccess: shipmentResult.success,
            inventoryUpdated: inventoryUpdates,
            emailSent: emailResult.success,
            emailError: emailResult.error,
        };
    } catch (error) {
        console.error("Order submission error (server):", error);
        return {
            success: false,
            error: error.message || "Failed to submit order"
        };
    }
}