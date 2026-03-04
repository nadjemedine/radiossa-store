'use server';

import { client } from '@/lib/sanity';
import { sendOrderNotification } from '@/lib/email';

export async function submitOrder(orderDoc) {
    try {
        // Save order to Sanity
        const result = await client.create(orderDoc);

        // Send email notification
        const emailResult = await sendOrderNotification(orderDoc);

        return {
            success: true,
            orderId: result._id,
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