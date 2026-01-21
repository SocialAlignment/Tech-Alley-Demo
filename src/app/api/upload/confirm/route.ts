import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';
const AWS_REGION = process.env.S3_REGION!;
const AWS_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { s3Key, caption, userId, instagramHandle } = body;

        if (!s3Key) {
            return NextResponse.json(
                { error: 's3Key is required' },
                { status: 400 }
            );
        }

        // Construct the S3 URL
        const imageUrl = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

        // 1. Save to Notion (Photo Booth Gallery)
        const res = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { database_id: NOTION_DB_ID },
                properties: {
                    'Caption': {
                        title: [
                            {
                                text: {
                                    content: caption || 'Untitled Memory'
                                }
                            }
                        ]
                    },
                    'ImageURL': {
                        url: imageUrl
                    },
                    'S3Key': {
                        rich_text: [
                            {
                                text: {
                                    content: s3Key
                                }
                            }
                        ]
                    },
                    'Status': {
                        select: {
                            name: 'Approved'
                        }
                    },
                    'UploadedAt': {
                        date: {
                            start: new Date().toISOString()
                        }
                    },
                    'User': {
                        rich_text: [
                            {
                                text: {
                                    content: userId || 'Anonymous'
                                }
                            }
                        ]
                    },
                    'Instagram': {
                        rich_text: [
                            {
                                text: {
                                    content: instagramHandle || ''
                                }
                            }
                        ]
                    }
                }
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Notion API Error Raw:", errorText);
            let errorJson;
            try {
                errorJson = JSON.parse(errorText);
            } catch (e) {
                errorJson = { message: errorText };
            }
            return NextResponse.json(
                { error: `Notion Error: ${errorJson.message || errorText}` },
                { status: res.status }
            );
        }

        // 2. Sync Instagram to User Profile (Supabase) if provided
        if (userId && instagramHandle) {
            // Use Admin Client if available to bypass RLS issues just in case
            const adminAuthClient = process.env.SUPABASE_SERVICE_ROLE_KEY
                ? require('@supabase/supabase-js').createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                )
                : supabase;

            console.log(`[Upload Confirm] Syncing Instagram for user ${userId}: ${instagramHandle}`);

            await adminAuthClient
                .from('leads')
                .update({ instagram: instagramHandle })
                .eq('id', userId);
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error('Error confirming upload:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save to database' },
            { status: 500 }
        );
    }
}
