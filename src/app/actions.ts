"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function submitEvent(formData: FormData) {
    const name = formData.get("name") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;

    if (!name || !date || !time || !description) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const { error } = await supabase.from('events').insert({
            name,
            date,
            time,
            description,
            link: link || null,
            status: 'pending',
            tags: ['community_submission']
        });

        if (error) {
            console.error("Supabase Error:", error);
            throw new Error(error.message);
        }

        // Revalidate the events page just in case, though the event won't appear until approved
        revalidatePath("/hub/upcoming");

        return { success: true };
    } catch (error) {
        console.error("Server Action Error:", error);
        return { success: false, error: "Failed to submit event" };
    }
}
