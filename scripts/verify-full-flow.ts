
import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function main() {
    console.log('🚀 Starting Verification Flow...');

    // Debug Credentials (Safe Masking)
    const keyId = process.env.AWS_ACCESS_KEY_ID || 'MISSING';
    const secret = process.env.AWS_SECRET_ACCESS_KEY || 'MISSING';
    console.log(`ℹ️  AWS Config:`);
    console.log(`   Region: ${process.env.AWS_REGION}`);
    console.log(`   Access Key: ${keyId.substring(0, 4)}...${keyId.substring(keyId.length - 4)}`);
    console.log(`   Secret Key: ${secret.substring(0, 4)}...${secret.substring(secret.length - 4)} (Length: ${secret.length})`);

    // 0. Connectivity Test
    console.log(`\n📡 Step 0: Testing Connectivity (ListBuckets)...`);
    try {
        const listCmd = new ListBucketsCommand({});
        await s3Client.send(listCmd);
        console.log('   ✅ Connection Successful! Credentials work.');
    } catch (err: any) {
        console.error('   ❌ Connection Failed. Your credentials in .env.local are likely invalid.');
        console.error(`   Error: ${err.name} - ${err.message}`);
        process.exit(1);
    }

    // 1. Create a dummy image buffer
    const timestamp = Date.now();
    const filename = `verification-test-${timestamp}.txt`;
    const s3Key = `uploads/${filename}`;
    const fileContent = 'This is a test file uploaded via the verification script.';

    console.log(`\n📸 Step 1: Uploading test file to S3...`);
    console.log(`   Bucket: ${process.env.AWS_BUCKET_NAME}`);
    console.log(`   Key: ${s3Key}`);

    try {
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'text/plain',
        });

        await s3Client.send(uploadCommand);
        console.log('   ✅ Upload Successful! (Server-side bypasses CORS)');
    } catch (err: any) {
        console.error('   ❌ Upload Failed:', err.message);
        process.exit(1);
    }

    // 2. Call the Confirm API
    console.log(`\n🔗 Step 2: Registering in Notion via API...`);
    const confirmBody = {
        s3Key: s3Key,
        caption: "Verification Script Test (With Logic)",
        userId: "Test User (Verification Script)",
        instagramHandle: "@test_ig_handle"
    };
    const apiUrl = 'http://localhost:3000/api/upload/confirm';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(confirmBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('   ✅ API Confirmation Successful!');
        console.log('   📂 Notion Entry Created:', JSON.stringify(data, null, 2));

        console.log('\n🎉 VALIDATION COMPLETE!');
        console.log('1. Check your Notion "Photo Booth Gallery" database -> The new row should be there.');
        console.log('2. Check http://localhost:3000/hub/photo-booth/gallery -> The new item should appear.');

    } catch (err) {
        console.error('   ❌ API Call Failed:', err);
        process.exit(1);
    }
}

main();
