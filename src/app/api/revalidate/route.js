import { NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req) {
    try {
        const { body, isValidSignature } = await parseBody(
            req,
            process.env.SANITY_WEBHOOK_SECRET
        );

        if (!isValidSignature) {
            return new Response('Invalid signature', { status: 401 });
        }

        if (!body) {
            return new Response('Bad Request', { status: 400 });
        }

        // If a product was updated, revalidate the page
        if (body._type === 'product') {
            const { revalidateTag } = require('next/cache');
            revalidateTag('products');
            
            return NextResponse.json({
                success: true,
                message: 'Revalidated products',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook received',
        });
    } catch (err) {
        console.error(err);
        return new Response('Error processing webhook', { status: 500 });
    }
}
