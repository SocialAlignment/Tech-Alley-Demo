import { NextResponse } from 'next/server';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';
const AWS_REGION = process.env.AWS_REGION!;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { s3Key, caption } = body;

        if (!s3Key) {
            return NextResponse.json(
                { error: 's3Key is required' },
                { status: 400 }
            );
        }

        // Construct the S3 URL
        const imageUrl = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

        // Save to Notion
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
                                    content: body.userId || 'Anonymous'
                                }
                            }
                        ]
                    },
                    'Instagram': {
                        rich_text: [
                            {
                                text: {
                                    content: body.instagramHandle || ''
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

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error('Error confirming upload:', error);
        return NextResponse.json(
            { error: 'Failed to save to database' },
            { status: 500 }
        );
    }
}
