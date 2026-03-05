import { trackShipment } from '@/lib/rmExpress';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('id');

    if (!trackingNumber) {
        return Response.json({ success: false, error: 'Tracking number is required' }, { status: 400 });
    }

    const result = await trackShipment(trackingNumber);

    if (result.success) {
        return Response.json(result);
    } else {
        return Response.json({ success: false, error: result.error }, { status: 404 });
    }
}
