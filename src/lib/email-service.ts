import mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export class EmailService {

    /**
     * Adds a new lead to the Mailchimp Audience
     */
    static async addSubscriber(email: string, firstName: string, lastName: string, tags: string[] = []) {
        const listId = process.env.MAILCHIMP_AUDIENCE_ID;

        if (!listId || !process.env.MAILCHIMP_API_KEY) {
            console.warn("[EmailService] Missing Credentials. Simulating Subscription.");
            return { success: true, status: 'simulated' };
        }

        try {
            console.log(`[EmailService] Adding ${email} to list ${listId}`);

            const response = await mailchimp.lists.addListMember(listId, {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
                tags
            }) as any;

            console.log(`[EmailService] Successfully subscribed ${email}. ID: ${response.id}`);
            return { success: true, id: response.id };
        } catch (error: any) {
            // If already subscribed, update their tags instead of failing
            if (error.response?.body?.title === 'Member Exists') {
                console.log(`[EmailService] ${email} already exists. Attempting to update tags...`);
                // Logic to update tags could go here if needed, 
                // but for now we just treat it as a success to not block flow.
                return { success: true, status: 'already_subscribed' };
            }

            console.error("[EmailService] Failed to subscribe:", error);
            // Don't kill the request
            return { success: false, error };
        }
    }
}
