import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, action } = body; // action: 'approve' | 'reject'

        if (!eventId || !action) {
            return NextResponse.json({ success: false, error: 'Missing eventId or action' }, { status: 400 });
        }

        console.log(`Admin Action: ${action} on Event ${eventId} (Supabase)`);

        let newStatus: 'approved' | 'rejected' | 'pending' = 'pending';

        if (action === 'approve') newStatus = 'approved';
        else if (action === 'reject') newStatus = 'rejected';
        else return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

        const { error } = await supabase
            .from('events')
            .update({ status: newStatus })
            .eq('id', eventId);

        if (error) {
            throw error;
        }

        // Revalidate public page if approved
        if (newStatus === 'approved') {
            revalidatePath('/hub/upcoming');
        }

        return NextResponse.json({ success: true, status: newStatus });
    } catch (error: any) {
        console.error('[ADMIN_APPROVE_EVENT] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
