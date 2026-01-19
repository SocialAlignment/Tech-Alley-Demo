
import { NextResponse } from 'next/server';
import { updateEventStatus } from '@/lib/notion';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, action } = body; // action: 'approve' | 'reject'

        if (!eventId || !action) {
            return NextResponse.json({ success: false, error: 'Missing eventId or action' }, { status: 400 });
        }

        console.log(`Admin Action: ${action} on Event ${eventId}`);

        let newStatus: 'Approved' | 'Rejected' | 'Pending Review' = 'Pending Review';

        if (action === 'approve') newStatus = 'Approved';
        else if (action === 'reject') newStatus = 'Rejected';
        else return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

        await updateEventStatus(eventId, newStatus);

        return NextResponse.json({ success: true, status: newStatus });
    } catch (error: any) {
        console.error('[ADMIN_APPROVE_EVENT] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
