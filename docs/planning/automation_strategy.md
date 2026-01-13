# Tech Alley Henderson: Post-Event Nurture & Automation Strategy

> **Goal**: Convert event leads into Social Alignment clients via a personalized, multi-channel, data-driven nurture sequence.

## 1. Immediate Post-Event Action (The "9 PM Ritual")
**Trigger**: Time-based (January 21st, 9:00 PM PST).
**Audience**: All *new* leads captured during the event.
**Action**:
- **Channel**: SMS (Primary).
- **Message**: "Thanks for joining us tonight! 🎙️ I'd love to hear your thoughts while they're fresh. Reply with a quick voice note or text on what you loved or what we can improve."
- **Data Goal**: Capture "Natural Language Feedback" to analyze tone/sentiment for future personalization.
- **Storage**: Append reply to `Lead 2.0` Database -> `Post-Event Feedback` property.

## 2. The "Context Window" (0h - 24h Post-Event)
- **Status**: *Waiting Period*.
- **Human Action**: Jonathan reviews leads in Notion and adds manual `Initial Notes` (context, vibes, specific verbal conversations).
- **System Action**: NO automated outreach or enrichment happens during this window to allow for human data entry.

## 3. The "Deep Enrichment" (T+24 Hours)
**Trigger**: 24 hours after Event End (or manually triggered Batch Job).
**Input Data**:
1. Initial Form Data (Name, Company, Interest).
2. Survey/Hub Interactions (Did they spin the wheel? What marketing goal did they select?).
3. 9 PM SMS Feedback (Sentiment/Requests).
4. Manual `Initial Notes`.
**Process**:
- **Firecrawl**: Scrape Company Website -> Extract Value Prop, Pricing, Recent News.
- **Perplexity**: "Analyze this lead's digital footprint + our event notes. Generate 3 specific pain points Social Alignment can solve using GenAI Video, and draft a hyper-personalized opening line."
- **Output**: Update Notion `Enriched Context` and `Generated Icebreakers`.

## 4. The Nurture Campaigns (The "Close")
**Logic**: Segment based on `Interests` and `Communication Preference`.

### Campaign A: "The Alignment" (General Newsletter)
- **Frequency**: 3x / Week (e.g., Mon/Wed/Fri).
- **Duration**: 4 Weeks (12 Emails total).
- **Content**: Social Alignment value props, case studies, "Lead Magnets" (PDFs, Templates).
- **Call to Action**: "Book a Strategy Call".

### Campaign B: "GenAI Video Alpha" (Targeted)
- **Audience**: Leads who selected "GenAI Video" interest or entered the "Command Commercial" Raffle.
- **Frequency**: 2x / Week (Off-days, e.g., Tue/Thu).
- **Content**: Specific benefits of GenAI (Time savings, Cost reduction, Virality).
- **Personalization**: Uses the "pain points" found during Enrichment.
- **Call to Action**: Cal.com Link (Specific "Video Strategy" Event Type).

### Channel Logic
- **If Prefers Email**: Send via Newsletter Engine.
- **If Prefers SMS/Phone**: Send abbreviated "Nudge" via SMS linking to the content/calendar instead of long-form email.
