import { NextResponse } from 'next/server';
import { CommService } from '@/lib/comm-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, message } = body;

        if (!phone) {
            return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 });
        }

        const msg = message || "Test message from Tech Alley Dashboard";

        console.log(`[Test SMS] Attempting send to ${phone}`);

        // Use the internal formatPhone to see what it looks like, but CommService does it too.
        // We'll trust CommService.sendSMS which is private but we can add a public test method or just use a public one.
        // Actually, CommService.sendSMS is private. We have to use one of the public methods or expose one.
        // Let's modify CommService to expose a generic send method or use sendWelcomeSMS as a proxy if needed.
        // BETTER: Let's just create a raw twilio call here to debug, OR verify CommService has a generic sender.

        // Looking at CommService (previous view), it has sendWelcomeSMS, sendRaffleWinnerSMS etc.
        // It does NOT have a public generic send.
        // I will add a static public sendTestSMS to CommService first, then use it here.

        // Wait, I can't modify CommService in this tool call. I'll do it in the next step.
        // For now, I'll assume CommService.sendTestSMS exists.

        // actually, let's just use sendWelcomeSMS for the test to see if THAT works,
        // or just import twilio directly here for a raw test.
        // A raw test is better for "I want to believe".

        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        // Use Verified Messaging Service SID (Linked to CM8de... Campaign)
        const MESSAGING_SERVICE_SID = 'MG761ccd492c31c0f0aa524b57a2f89a52';

        const result = await client.messages.create({
            body: msg,
            messagingServiceSid: MESSAGING_SERVICE_SID,
            to: phone
        });

        // Wait 2 seconds to check status (Twilio is async)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const updatedMsg = await client.messages(result.sid).fetch();

        return NextResponse.json({
            success: true,
            sid: result.sid,
            status: updatedMsg.status,
            errorCode: updatedMsg.errorCode,
            errorMessage: updatedMsg.errorMessage,
            fullResult: result
        });

    } catch (error: any) {
        console.error("Test SMS Failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        }, { status: 500 });
    }
}
