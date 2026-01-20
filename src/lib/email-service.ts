
import client from '@mailchimp/mailchimp_marketing';

// Initialize Client (if creds exist)
const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us17"
const LIST_ID = process.env.MAILCHIMP_LIST_ID;

if (API_KEY && SERVER_PREFIX) {
    client.setConfig({
        apiKey: API_KEY,
        server: SERVER_PREFIX,
    });
}

export class EmailService {
    /**
     * Adds a user to the main newsletter list.
     * @param email User's email
     * @param firstName User's first name
     * @param lastName User's last name (optional)
     * @param tags Array of tags to add to the subscriber
     */
    static async addSubscriber(email: string, firstName: string, lastName: string = '', tags: string[] = []) {
        if (!API_KEY || !LIST_ID || !SERVER_PREFIX) {
            console.log(`[EmailService] [SIMULATION] Adding ${email} to Mailchimp List ${LIST_ID || 'MISSING_ID'} with tags: [${tags.join(', ')}]`);
            return { status: 'simulated' };
        }

        try {
            const response = await client.lists.addListMember(LIST_ID, {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
                tags
            });

            console.log(`[EmailService] Successfully added ${email} to list.`);
            return response;
        } catch (error: any) {
            // If user already exists, that's fine, maybe update tags?
            // For now, just log generic error or specific "Member Exists"
            if (error.response && error.response.body.title === "Member Exists") {
                console.log(`[EmailService] User ${email} already in list.`);
                // Optional: Update tags here if needed.
                return { status: 'exists' };
            }
            console.error("[EmailService] Error adding subscriber:", error);
            return { status: 'error', error };
        }
    }
}
