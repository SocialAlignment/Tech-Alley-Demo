import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Refactored to Supabase + Background Sync
export async function POST(request: Request) {
    try {
        const { leadId, preferredName, avatarUrl } = await request.json();

        if (!leadId) return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });

        // 1. Update Supabase
        const updateData: any = {};
        if (preferredName) updateData.preferred_name = preferredName;
        if (avatarUrl) updateData.avatar = avatarUrl;

        const { data: updatedUser, error } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
            .select('email') // Get email for Notion sync
            .single();

        if (error) throw new Error(error.message);

        // 2. Sync to Notion (Background)
        if (updatedUser?.email) {
            const { syncUpdateToNotion } = await import('@/lib/notion'); // Dynamic import
            syncUpdateToNotion(updatedUser.email, { preferred_name: preferredName });
        }

        return NextResponse.json({ success: true, message: 'Profile updated' });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }
}
