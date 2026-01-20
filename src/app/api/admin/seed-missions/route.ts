import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// The specific list of missions requested by the user
const MISSIONS_TO_SEED = [
    {
        title: "Enter the GenAi video giveaway",
        description: "Register for the raffle to win a free GenAI video.",
        xp: 20,
        icon_name: "Video",
        action_path: "/demo" // Directs to the new demo flow
    },
    {
        title: "Follow Tech Alley Henderson on LinkedIn",
        description: "Stay updated with our latest news and events.",
        xp: 10,
        icon_name: "Linkedin",
        action_path: "https://www.linkedin.com/company/tech-alley-henderson"
    },
    {
        title: "Learn one new thing about AI",
        description: "Attend a session or ask a speaker something new.",
        xp: 15,
        icon_name: "Brain",
        action_path: ""
    },
    {
        title: "Grab a photo with Jonathan Sterritt",
        description: "Find the organizer and snap a selfie!",
        xp: 50,
        icon_name: "Camera",
        action_path: ""
    },
    {
        title: "Submit a photo to the photo booth",
        description: "Share your experience at the event.",
        xp: 15,
        icon_name: "Image",
        action_path: ""
    },
    {
        title: "Complete your Social Profile",
        description: "Fill out your profile details in the hub.",
        xp: 25,
        icon_name: "UserCheck",
        action_path: "/hub/profile/qualify"
    },
    {
        title: "Submit a Question or give Feedback",
        description: "Engage with our speakers.",
        xp: 10,
        icon_name: "MessageSquare",
        action_path: "/hub/feedback"
    },
    {
        title: "Connect with 5 New People",
        description: "Network and expand your circle.",
        xp: 30,
        icon_name: "Users",
        action_path: ""
    },
    {
        title: "Follow Hello Henderson on YouTube",
        description: "Watch our past events and highlights.",
        xp: 10,
        icon_name: "Youtube",
        action_path: "https://www.youtube.com/@HelloHenderson"
    }
];

export async function GET() {
    try {
        console.log("Seeding missions...");

        // Optional: clear existing missions if we want a fresh start
        // const { error: deleteError } = await supabase.from('missions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        // if (deleteError) throw deleteError;

        const { data, error } = await supabase
            .from('missions')
            .upsert(
                MISSIONS_TO_SEED.map(m => ({
                    ...m,
                    is_active: true
                })),
                { onConflict: 'title' } // Prevent duplicates by title
            )
            .select();

        if (error) {
            console.error("Error seeding missions:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
