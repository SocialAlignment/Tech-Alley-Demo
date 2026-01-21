import axios from 'axios';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const API_KEY = process.env.PERPLEXITY_API_KEY;

// Voice Profile: Jonathan Sterritt
const SYSTEM_PROMPT = `
You are Jonathan Sterritt, the founder of Social Alignment.
You are writing a direct, high-signal intro email to a new lead who just registered for the Tech Alley event.

# VOICE & TONE
- **Raw & Direct**: No fluff. No "I hope this email finds you well."
- **High-Agency**: Focus on action, systems, and leverage.
- **Anti-Generic**: Do NOT use words like "unleash", "unlock", "elevate", "game-changer", "synergy".
- **Founder-to-Founder**: Speak equal-to-equal. Professional but not corporate.
- **Formatting**: Short paragraphs. Use bullet points if listing things.

# GOAL
Connect the lead's specific "Help Statement" (Who they help + What they solve) to a specific resource or insight you can offer.
The goal is to get a reply or a meeting, not just to say hello.

# DATA POINTS
You will be properly formatted JSON containing:
- Name
- Role
- Industry
- Help Statement (Who they help, Problems they solve)
- Goals (What they want to achieve)
`;

interface LeadProfile {
    name: string;
    role: string;
    industry: string;
    helpStatement?: string;
    problems?: string;
    goals?: string;
    vision?: string;
    wishlist?: string;
    company?: string;
}

export class GenAIService {

    static async generateIntroEmail(lead: LeadProfile, topic?: string): Promise<{ subject: string; body: string }> {
        if (!API_KEY) {
            console.error('[GenAIService] Missing PERPLEXITY_API_KEY');
            return {
                subject: 'Error: Missing API Key',
                body: 'Please configure PERPLEXITY_API_KEY in .env.local'
            };
        }

        const userPrompt = `
        Here is the new lead:
        - Name: ${lead.name}
        - Role: ${lead.role} at ${lead.company || 'Unknown Company'}
        - Industry: ${lead.industry}
        - What they do: ${lead.helpStatement || 'Not specified'}
        - Problems they solve: ${lead.problems || 'Not specified'}
        - Current Goals: ${lead.goals || 'Not specified'}
        - Vision: ${lead.vision || 'Not specified'}
        - Wishlist: ${lead.wishlist || 'Not specified'}
        
        TOPIC / FOCUS: ${topic ? `The email MUST focus on this topic: "${topic}"` : 'General intro and valid alignment check.'}


        Write a short, punchy intro email (Subject + Body).
        The subject line should be lowercase and intriguing (e.g., "thought on your protocol", "quick question re: [industry]").
        
        Return the response in JSON format:
        {
            "subject": "string",
            "body": "string" // Markdown supported
        }
        `;

        try {
            const response = await axios.post(
                PERPLEXITY_API_URL,
                {
                    model: 'sonar-pro',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    // response_format: { type: 'json_schema' } // Not fully supported by all Perplexity models yet, relying on prompt instructions
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content;

            // Clean up code blocks if Perplexity wraps in ```json ... ```
            const cleanJson = content.replace(/^```json\n/, '').replace(/\n```$/, '');

            try {
                return JSON.parse(cleanJson);
            } catch (e) {
                console.warn('[GenAIService] Failed to parse JSON, returning raw text', content);
                return {
                    subject: 'Personalized Intro (Parse Error)',
                    body: content
                };
            }

        } catch (error: any) {
            console.error('[GenAIService] API Call Failed:', error.response?.data || error.message);
            return {
                subject: 'Error Generating Email',
                body: 'Could not generate email details. Please check logs.'
            };
        }
    }
}
