import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: Request) {
    try {
        const { leadId } = await request.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        // Retrieve Page Properties from Notion
        // We use notion.pages.retrieve
        const page = await notion.pages.retrieve({ page_id: leadId });

        if (!page) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Extract useful context (safely)
        // Note: Type assertions are tricky with the generic Notion API response, so we do basic checks
        const props = (page as any).properties;
        console.log("Identify: Notion Props Keys:", Object.keys(props));

        // Extract Name (Title)
        const name = props.Name?.title?.[0]?.plain_text || 'Guest';
        const company = props.Company?.rich_text?.[0]?.plain_text || '';
        const email = props.Email?.email || '';

        // Extract Profile Image (checking for Files & Media type)
        const profileImageFiles = props['Profile Image']?.files || [];
        const avatar = profileImageFiles.length > 0 ? (profileImageFiles[0].file?.url || profileImageFiles[0].external?.url || '') : '';

        // Extract Profile Completed Status
        const isProfileComplete = props['Social Profile Completed']?.checkbox || false;

        // Extract Contact Details (for pre-filling form)
        const toPlain = (richText: any[]) => richText?.[0]?.plain_text || '';

        const contactDetails = {
            phone: props['Phone']?.phone_number || '',
            schedulingLink: toPlain(props['Scheduling Link']?.rich_text),
            instagram: toPlain(props['Instagram']?.rich_text).replace('https://instagram.com/', '@'), // Strip URL for display if needed, but form expects handle/URL
            linkedin: toPlain(props['LinkedIn']?.rich_text),
            facebook: toPlain(props['Facebook']?.rich_text),
            youtube: toPlain(props['YouTube']?.rich_text),
            hometown: toPlain(props['Hometown']?.rich_text),
            timezone: toPlain(props['Timezone']?.rich_text),
            bestTime: toPlain(props['Best Time to Reach']?.rich_text),
            askMeAbout: toPlain(props['Ask Me About']?.rich_text),
            helpMeBy: toPlain(props['You can help me by:']?.rich_text),
            helpYouBy: toPlain(props['I can help you by:']?.rich_text),
            // Multi-selects
            learningPreference: props['Learning Preference']?.multi_select?.map((o: any) => o.name) || [],
            // Select (Single) -> Map back to array for frontend compatibility if needed, or handle string
            commPrefs: props['Communication Preference']?.select?.name ? [props['Communication Preference']?.select?.name] : []
        };

        // Reverse Map "SMS" -> "Text/SMS" for frontend
        const commReverseMap: Record<string, string> = {
            "SMS": "Text/SMS",
            "Phone": "Phone Call"
        };



        // Extract Mission Progress
        // 'MissionData' property now holds the IDs string (created to support Status Ring visualization on 'MissionProgress')
        // Fallback to 'MissionProgress' TEXT if 'MissionData' is empty (migration support), 
        // but 'MissionProgress' is now primarily a Number.
        // We will read 'MissionData' first.
        const missionData = props['MissionData']?.rich_text?.[0]?.plain_text || '';

        // If missionData is empty, check if we have any legacy data in MissionProgress (if it was text)
        // usage: const legacy = props['MissionProgress']?.rich_text?.[0]?.plain_text; 
        // But since we just changed types, let's stick to MissionData.

        const missionProgress = missionData;

        console.log("Identify: Returning Contact Details:", JSON.stringify(contactDetails, null, 2));


        return NextResponse.json({
            success: true,
            data: {
                name,
                company,
                email,
                avatar,
                isProfileComplete,
                missionProgress, // This is the string of IDs
                contactDetails
            }
        });

    } catch (error) {
        console.error('Identity Fetch Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to identify lead' },
            { status: 500 }
        );
    }
}
