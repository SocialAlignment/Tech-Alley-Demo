# Tech Alley Henderson Automation & "Gorgeous UI" Plan

## Goal Description
Create a "Lead Generation Machine" for Tech Alley Henderson that starts with a Popl QR code scan and leads to a "Gorgeous" personalized Notion-backed Companion Hub. The core requirement is maintaining a single "truth" record in Notion for each attendee as they interact with various forms and surveys on the Hub.

## User Review Required
> [!IMPORTANT]
> **Identity Architecture**: I am designing the Hub to be "Identity-Aware". The link emailed to users MUST look like `https://techalley-hub.netlify.app/?id=NOTION_PAGE_ID`. This allows all subsequent forms on the Hub to update the *correct* Notion record without creating duplicates.
>
> **Form Strategy (CRITICAL)**: I strongly recommend using **Internal React Forms** for ALL surveys/giveaways. This allows us to invisibly pass the `id` to our API and update specific properties (e.g., "Entered to Win" Checkbox) on the Lead 2.0 database safely. Embedding Notion/Google forms will likely create DUPLICATE rows, breaking your data integrity.

## Proposed Changes

### 1. The Workflow
- **Step 1: Popl Entry (External)**
  - Attendee scans Popl QR -> Native Popl Form.
  - **Automation**: Popl Webhook -> Deduplication -> **Create/Update Notion Record**.
  - **Trigger**: Send SMS/Email with *Magic Link* (`?id=<PageID>`) to Hub.

- **Step 2: The "Gorgeous" Companion Hub (Next.js)**
  - **Exploration**: User browses Hello World, Speakers, Follow Us.
  - **Giveaway (GenAI Video)**: User fills out internal form (Choice + Goal) -> **API Updates Notion**: 
    - `Marketing Goal` = "Video Type"
    - `Entered to Win` = Checked (True)
  - **Feedback**: User fills out internal Survey -> **API Updates Notion**:
    - `Event Feedback` = Text

- **Step 3: Admin "God Mode"**
  - **Wheel Logic**: Filters purely for `Entered to Win == Checked`.
  - **Live Table**: Shows Real-time "Qualification" status.**Architecture**: Identity-Aware Application.
- **Global Layout**: Persistent Left Sidebar with Tabs (Mobile: Bottom Sheet).
- **Session State**: App reads `searchParams.get('id')` and stores it in Context/Session.

#### [MODIFY] `src/app/`
- `layout.tsx`: Add Sidebar/Navigation Wrapper.
- `page.tsx`: Redirect logic (if ID exists -> Hub, else -> "Scan QR" landing).
- **New Tab Routes**:
  - `/hello-world`: "How to use this hub" + Agenda.
  - `/speakers`: Guest Speaker profiles & Startup Spotlight.
  - `/surveys`: **Internal Feedback Form**. (Updates `Event Feedback` property).
  - `/giveaway`: "GenAI Video" Qualification Form. (Updates `Marketing Goal` & `Entered to Win`).
  - `/follow-us`: Social links aggregator.

#### [NEW] `src/components/`
- `Sidebar.tsx`: Glassmorphism navigation.
- `SmartForm.tsx`: Reusable form component that updates Notion properties via API.

#### [NEW] `src/app/admin/`
- **Goal**: Private "God Mode" for Jonathan.
- **Security**: Basic Auth via Middleware (login with env password).
- **Features**:
  - **Live Leads**: Data table of all captures.
  - **The Wheel**: "Big Screen" mode. Fetches *qualified* leads (checked box) to spin for a winner.
  - **CMS**: Updates simple content (Agenda, Links) stored in a Notion "Config" database (future).
  - **Triggers**: Buttons to start the "9 PM SMS" or "Voice Calls" (future).

### 3. Backend (API & Automation)
- **Real-time API**: 
  - `api/identify`: Fetch context for Hub personalization.
  - `api/update-lead`: PATCH Notion Key/Values (Identity-Aware).
- **Scheduled Automation** (See `automation_strategy.md` for full logic):
  - **9 PM SMS Blast**: Netlify Scheduled Function (or manual trigger via Notion Button).
  - **Enrichment Job**: Batch process triggered 24h post-event.
  - **Campaign Manager**: Logic to feed enriched leads into Email/SMS tools.

## Verification Plan
### Automated Tests
- Test `update-lead` API: Ensure it updates Notion properties without duplication.
- Test Magic Link flow: Verify `?id=` param is correctly parsed.

### Manual Verification
1. **The "Live" Flow**: Scan QR -> Form -> Hub -> Win Prize.
2. **The "Nurture" Flow**:
   - Manually trigger "9 PM SMS" script.
   - Wait/Simulate 24h delay.
   - Run `enrich-lead` script on test record.
   - Verify Notion is populated with Perplexity insights.
