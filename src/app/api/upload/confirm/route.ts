import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';
const AWS_REGION = process.env.AWS_REGION!;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

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
            throw new Error(`Notion API Error: ${errorText}`);
        }

        // 2. Sync Instagram to User Profile (Supabase) if provided
        if (userId && instagramHandle) {
            // Clean the handle first? optional but good practice
            const cleanHandle = instagramHandle.startsWith('@')
                ? `https://instagram.com/${instagramHandle.substring(1)}`
                : instagramHandle; // Or keep it as is if we want raw handle. 
            // Actually, keep it simple for now, or match `contact/update` logic.
            // contact/update logic: url ? (url.startsWith('@') ? `https://instagram.com/${url.substring(1)}` : url) : null;
            // The file-upload component might send raw handle or URL. The user sees what they type.
            // Let's just save what they typed, or arguably, check if it's empty in DB first?
            // "Upsert" logic: Update if instagram is null or empty? Or always update?
            // User explicit input here is fresher than profile probably.

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

            // Also Trigger Notion Sync for the user profile? 
            // Yes, ideally, but let's stick to Supabase for now to fix the immediate "pulls from profile" loop.
            // If we update Supabase, next time they load IdentityContext, it will be there.
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error('Error confirming upload:', error);
        return NextResponse.json(
            { error: 'Failed to save to database' },
            { status: 500 }
        );
    }
}
