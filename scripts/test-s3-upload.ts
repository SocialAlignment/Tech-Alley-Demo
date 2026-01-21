import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

async function testUpload() {
    console.log("Testing S3 Upload...");
    console.log("Region:", process.env.S3_REGION);
    console.log("Bucket:", process.env.S3_BUCKET_NAME);
    console.log("Access Key Length:", process.env.S3_ACCESS_KEY_ID?.length);

    const key = `test-upload-${Date.now()}.txt`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            Body: "Hello from Tech Alley debug script!",
            ContentType: "text/plain",
        });

        console.log(`Attempting to upload ${key}...`);
        await s3Client.send(command);
        console.log("✅ Upload Successful!");

    } catch (error: any) {
        console.error("❌ Upload Failed:", error);
    }
}

testUpload();
