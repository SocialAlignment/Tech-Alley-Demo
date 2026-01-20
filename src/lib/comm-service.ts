import twilio from 'twilio';

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

type CommType = 'sms' | 'email';

interface CommLogEntry {
    userId: string;
    type: CommType;
    trigger: string;
    status: 'sent' | 'failed' | 'simulated';
    payload: string;
    timestamp: Date;
}

export class CommService {

    /**
     * Sends the "Welcome to Tech Alley" SMS
     * Trigger: Registration Complete (Step 3 or 4 of Wizard)
     */
    static async sendWelcomeSMS(phone: string, name: string) {
        const firstName = name.split(' ')[0];
        const message = `Mark your calendar! - you are in..We will see you at the next Tech Alley Henderson Meetup on Feb 21st, 2026 inside the Pass Casino. Doors open at 5PM. Buckle up ${firstName} its going to be a innovatve year. See you Soon.`;

        return this.sendSMS(phone, message, 'welcome_event_reg');
    }

    /**
     * Sends the "Raffle Winner" SMS
     * Trigger: Admin Dashboard -> Select Winner
     */
    static async sendRaffleWinnerSMS(phone: string, name: string) {
        const firstName = name.split(' ')[0];
        const message = `Congratualtions ${firstName} you won a free private video session with me and the Social Alignment Team. Use this link to schedule our connect and get your going. - https://cal.com/social-alignment-jonathan/followup`;

        return this.sendSMS(phone, message, 'raffle_winner');
    }

    /**
     * Sends the "Post-Event Follow-up" SMS
     * Trigger: Scheduled (Jan 21st @ 9PM) or Admin Blast
     */
    static async sendPostEventFollowUpSMS(phone: string, name: string, personalizedTopic: string) {
        const firstName = name.split(' ')[0];
        const topic = personalizedTopic || "your goals";
        const message = `Hey ${firstName} thanks so much for coming out tonight. I apprceiate you. If you want to connect for coffee this month and talk more about ${topic}. You can schedule some time with me and I'd love to dive in deeper with you. No Pressure! Either way ill see you around the community. Cheers!`;

        return this.sendSMS(phone, message, 'post_event_followup');
    }

    /**
     * Sends the "GenAI Resources" SMS
     * Sent after GenAI Qualification form submission (`/api/demo/qualify`), customized by business stage (e.g., "Foundation", "Growth", "Scale").
     * Context: Used to select the most relevant "Blocker" or "Opportunity" based message.
     */
    static async sendGenAIResourcesSMS(phone: string, name: string, context: { tags: string[], band: string, stage: string, industry?: string }) {
        const firstName = name.split(' ')[0];
        const { tags, band, stage, industry } = context;
        let message = '';

        // Voice: Jonathan Sterritt (Direct, Personal, High-Signal)

        if (band === 'PRIORITY' || tags.includes('SCALE') || tags.includes('VOLUME')) {
            // VIP / High Volume
            message = `${firstName}, just saw your numbers coming through. Impressive volume. Most people get stuck in the weeds, but you're ready for systems. I'm sending over some high-leverage assets specifically for scaling. Check your email. - Jonathan`;
        } else if (tags.includes('TIME_BLOCKED')) {
            // Efficiency Focus
            message = `Hey ${firstName}, Jonathan here. I noticed you mentioned time is the biggest bottleneck. I get it—it's the enemy. I'm sending you the "Systemization" protocol I use to buy back 10+ hours a week. Check your inbox.`;
        } else if (tags.includes('BRAND_MISMATCH') || tags.includes('GENERIC_OUTPUTS') || tags.includes('TRUST_BLOCKED')) {
            // Quality/Trust Focus
            message = `${firstName}, I saw your note about generic AI outputs. I hate them too. That's why I'm sending you my "Brand DNA" kit—it fixes the quality issue so you actually sound like YOU. Watch your inbox. - Jonathan`;
        } else if (tags.includes('PROMPT_BLOCKED') || tags.includes('CONSISTENCY_BLOCKED')) {
            // Tactical/Skill Focus
            message = `Hey ${firstName}, Jonathan here. Saw you're getting stuck on the prompting side. It happens. I'm sending you the exact frameworks we use at Social Alignment to remove the guesswork. Check your inbox shortly.`;
        } else {
            // Default / Standard - Now leverages Industry Context
            const industryStr = industry ? ` for ${industry}` : '';
            message = `Hey ${firstName}, Jonathan here. Saw your profile come through. I'm pulling together some resources specifically${industryStr} at the ${stage} stage to help you move faster. Watch your inbox—sending them now.`;
        }

        return this.sendSMS(phone, message, 'genai_resources_qualify');
    }

    /**
    * Sanitize phone number to E.164
    * (e.g. 310-721-3535 -> +13107213535)
    */
    private static formatPhone(phone: string): string {
        // 1. Remove all non-numeric chars
        const digits = phone.replace(/\D/g, '');
        // 2. Add +1 if missing (assuming US for this demo context)
        if (digits.length === 10) return `+1${digits}`;
        if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
        // Fallback: return with + prefix if it seems valid, or original
        return `+${digits}`;
    }

    /**
     * Core SMS Sender
     */
    private static async sendSMS(to: string, body: string, triggerId: string) {
        const cleanPhone = this.formatPhone(to);

        console.log(`[CommService] Attempting to send SMS to ${cleanPhone} (Original: ${to}) [Trigger: ${triggerId}]`);
        console.log(`[CommService] Content: "${body}"`);

        if (!client) {
            console.warn("[CommService] Twilio credentials missing. SIMULATING SEND.");
            return { success: true, status: 'simulated', sid: 'simulated_sid' };
        }

        try {
            const result = await client.messages.create({
                body,
                from: fromNumber,
                to: cleanPhone
            });
            console.log(`[CommService] SMS Sent! SID: ${result.sid}`);
            return { success: true, status: 'sent', sid: result.sid };
        } catch (error) {
            console.error("[CommService] Failed to send SMS:", error);
            // Don't throw to avoid crashing the API route flow
            return { success: false, status: 'failed', error };
        }
    }
}
