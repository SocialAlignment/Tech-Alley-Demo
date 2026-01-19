import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Not authenticated", redirect: '/login' }, { status: 401 });
    }

    const { email, name } = session.user;

    try {
        // 1. Supabase Check
        const { data: existing } = await supabase
            .from('leads')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({
                success: true,
                redirect: `/hub?id=${existing.id}`,
                isNewUser: false
            });
        }

        // 2. Create New Lead in Supabase
        const { data: newLead, error } = await supabase
            .from('leads')
            .insert({
                name: name || 'Google User',
                email: email,
                avatar: session.user.image, // Setup avatar from Google
                // Initial empty CRM fields
                company: '',
                title: '',
                phone: '',
                instagram: ''
            })
            .select()
            .single();

        if (error || !newLead) {
            console.error("Supabase Create Error:", error);
            throw new Error("Failed to create user in Supabase");
        }

        // 3. Background Sync to Notion
        // We import syncToNotion dynamically or just use the helper if imported
        // Ideally imported at top level
        const { syncToNotion } = await import('@/lib/notion');
        syncToNotion({
            name: name || 'Google User',
            email: email,
            // Google doesn't give these, but we pass what we have
        });

        return NextResponse.json({
            success: true,
            redirect: `/onboarding?id=${newLead.id}`, // Direct to onboarding form first
            isNewUser: true
        });

    } catch (e) {
        console.error("Auth Sync Error:", e);
        return NextResponse.json({ error: "Sync failed", details: String(e) }, { status: 500 });
    }
}
