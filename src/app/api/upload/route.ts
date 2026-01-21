import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-west-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
});

export async function GET(request: Request) {
    try {
        if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
            console.error("Missing S3 Environment Variables");
            return NextResponse.json(
                { error: 'Server configuration error: Missing S3 credentials' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const contentType = searchParams.get('contentType');

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'File name and content type are required.' },
                { status: 400 }
            );
        }

        // Generate a unique filename to prevent overwriting
        const uniqueFilename = `uploads/${Date.now()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniqueFilename,
            ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

        return NextResponse.json({
            url: presignedUrl,
            key: uniqueFilename
        });

    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate presigned URL' },
            { status: 500 }
        );
    }
}
