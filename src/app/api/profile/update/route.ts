import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: Request) {
    try {
        const { leadId, preferredName, avatarUrl } = await request.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        const propertiesToUpdate: any = {};

        // Update Preferred Name if provided
        if (preferredName) {
            propertiesToUpdate['Preferred Name'] = {
                rich_text: [
                    {
                        text: {
                            content: preferredName,
                        },
                    },
                ],
            };
        }

        // TODO: Handle Avatar URL update
        // We need a hosted URL to update the 'Profile Image' file property or page icon.
        // For now, we'll log it if we receive one but haven't implemented storage yet.
        if (avatarUrl) {
            console.log("Avatar URL update requested (requires external storage):", avatarUrl)
            // If we had a hosted URL, we would do:
            // propertiesToUpdate['Profile Image'] = {
            //    files: [{ name: 'avatar', external: { url: avatarUrl } }]
            // }
        }

        // Perform the update
        if (Object.keys(propertiesToUpdate).length > 0) {
            await notion.pages.update({
                page_id: leadId,
                properties: propertiesToUpdate,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update user profile' },
            { status: 500 }
        );
    }
}
