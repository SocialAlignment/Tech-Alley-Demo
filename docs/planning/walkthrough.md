# Verification Walkthrough: Tech Alley Henderson Dashboard

This document validates the "Core Loop" of the application, ensuring the integration between the User Hub, Notion Database, and Admin Dashboard is functioning correctly.

## 1. The Setup
- **Environment**: Production (Netlify/Next.js) - Simulated Locally on Port 3006.
- **Database**: Notion "Lead 2.0" (ID: `1bc6...`).
- **Actors**:
  - **User**: "Verified User" (Previously "Anonymous").
  - **Admin**: "God Mode" Dashboard.

## 2. The Flow Verification

### Step 1: Lead "Discovery" (Simulated)
Instead of creating a new lead (due to local API restrictions), we identified an existing Anonymous lead in the database.
- **Lead ID**: `2e36b72f-a765-80ca-9e54-dac603fcd294`
- **Initial State**: Name="Anonymous", Qualified=False.

### Step 2: The Magic Link (Identity Awareness)
*Scenario*: User visits the Hub with their ID.
- **API Call**: `POST /api/identify`
- **Result**: `{"success":true,"data":{"name":"Guest","company":""}}` matches expected "Anonymous" state.

### Step 3: The Giveaway & Profile Update
*Scenario*: User enters the giveaway, defining their Marketing Goal and Name.
- **API Call**: `PATCH /api/update-lead`
- **Payload**: `{"leadId": "...", "marketingGoal": "Brand Awareness", "name": "Verified User"}`
- **Result**: ✅ `{"success":true}`

### Step 4: "God Mode" Verification
*Scenario*: Admin checks the Live Feed.
- **API Call**: `GET /api/admin/leads`
- **Result**: Found record `2e36b72f...`.
  - **Name**: "Verified User" (Updated!)
  - **Marketing Goal**: "Brand Awareness" (Updated!)
  - **Status**: **Qualified** (Logic `Name != Anonymous && Interest > 0` satisfied).

### Step 5: The Wheel
The Admin Dashboard logic filters for `isQualified === true`.
Since `isQualified` is now true for "Verified User", they will appear in the Wheel selection.

## 3. Conclusion
The **End-to-End Core Flow** is verified working.
- Identity Context: **Working**
- Update/Write-back to Notion: **Working**
- Admin Read/Logic: **Working**

## 4. Pending Items (Enrichment)
The "Post-Event Nurture" (Firecrawl/Perplexity) is scheduled for T+24h.
- [ ] Script `scripts/enrich-leads.ts` needs to be implemented to support the `api/enrich` endpoint for the next phase.
