-- 1. Create the feedback table (SAFE MODE: Only if it doesn't exist)
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  speaker_id text not null,
  speaker_name text not null,
  visitor_name text, -- Optional
  topic text not null,
  content text not null,
  type text not null, -- 'question' or 'feedback'
  is_answered boolean default false
);

-- 2. Enable Row Level Security (RLS)
alter table public.feedback enable row level security;

-- 3. Create Policy: Allow ANYONE to INSERT feedback/questions
-- First drop to ensure we can update it
drop policy if exists "Enable insert for everyone" on public.feedback;
create policy "Enable insert for everyone" 
on public.feedback 
for insert 
to public 
with check (true);

-- 4. Create Policy: Allow ANYONE to SELECT (Read) questions
drop policy if exists "Enable read for everyone" on public.feedback;
create policy "Enable read for everyone" 
on public.feedback 
for select 
to public 
using (true);

-- 5. Create Policy: Allow ANYONE to UPDATE (Mark as Answered)
drop policy if exists "Enable update for everyone" on public.feedback;
create policy "Enable update for everyone" 
on public.feedback 
for update 
to public 
using (true)
with check (true);

-- 6. Enable Realtime updates for this table
-- (Already enabled appropriately if you see an error about it being a member)

-- IWT Grant Qualification Submissions
CREATE TABLE if not exists iwt_qualifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contact
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    
    -- Business
    business_name TEXT NOT NULL,
    business_address TEXT,
    ein TEXT,
    has_business_license BOOLEAN,
    has_workers_comp BOOLEAN,
    has_liability_insurance BOOLEAN,
    has_payroll_systems BOOLEAN,
    
    -- Purpose
    purpose_avert_layoff BOOLEAN DEFAULT FALSE,
    purpose_wage_increase BOOLEAN DEFAULT FALSE,
    purpose_promotion BOOLEAN DEFAULT FALSE,
    purpose_title_change BOOLEAN DEFAULT FALSE,
    
    -- Employee Requirements
    trainee_count INTEGER,
    employees_work_authorized BOOLEAN,
    employees_performance_qualified BOOLEAN,
    commit_to_retention BOOLEAN,
    will_displace_employees BOOLEAN,
    training_already_started BOOLEAN,
    
    -- Training Details
    training_type TEXT,
    training_provider TEXT,
    estimated_cost DECIMAL(10,2),
    preferred_timeline TEXT,
    
    -- Qualification Result
    qualification_status TEXT NOT NULL CHECK (qualification_status IN ('qualified', 'disqualified', 'needs_review')),
    disqualification_reasons TEXT[],
    warnings TEXT[],
    
    -- Tracking
    source TEXT DEFAULT 'live_event',
    lead_id TEXT,
    discovery_call_booked BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- Index for quick lookups
CREATE INDEX if not exists idx_iwt_qual_status ON iwt_qualifications(qualification_status);
CREATE INDEX if not exists idx_iwt_qual_created ON iwt_qualifications(created_at DESC);
CREATE INDEX if not exists idx_iwt_qual_email ON iwt_qualifications(contact_email);


-- Enable RLS for iwt_qualifications
ALTER TABLE iwt_qualifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Enable insert for everyone" 
ON iwt_qualifications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow reading only by authenticated users (or specific roles if needed, for now just auth/service_role)
-- For now, we don't strictly need a select policy for the public form, but if admins need to see it via client:
CREATE POLICY "Enable select for authenticated users only"
ON iwt_qualifications
FOR SELECT
TO authenticated
USING (true);

-- 7. EVENTS TABLE (For Community Submissions)
CREATE TABLE if not exists public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL, -- "18:00"
    description TEXT,
    link TEXT, -- URL for RSVP
    
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'published', 'done')) DEFAULT 'pending',
    tags TEXT[], -- Array of strings e.g. ['community']

    -- Metadata
    submitted_by_name TEXT,
    submitted_by_email TEXT
);

-- RLS for Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow Public Insert (Submission)
DROP POLICY IF EXISTS "Enable insert for events (public)" ON public.events;
CREATE POLICY "Enable insert for events (public)" 
ON public.events 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow Public Read (Only Approved/Published)
DROP POLICY IF EXISTS "Enable read for events (public)" ON public.events;
CREATE POLICY "Enable read for events (public)" 
ON public.events 
FOR SELECT 
TO public 
USING (status IN ('approved', 'published', 'done'));

-- Allow Update for Authenticated (Admins)
DROP POLICY IF EXISTS "Enable update for events (admins)" ON public.events;
CREATE POLICY "Enable update for events (admins)" 
ON public.events 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 8. MISSIONS TABLE (For Checklist)
CREATE TABLE if not exists public.missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    title TEXT NOT NULL,
    description TEXT,
    xp INTEGER DEFAULT 10 NOT NULL,
    icon_name TEXT,
    action_path TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    notion_id TEXT -- To prevent duplicates during migration
);

-- RLS for Missions
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Enable read for missions (public)" 
ON public.missions 
FOR SELECT 
TO public 
USING (is_active = true);

-- Allow Admin Write (Service Role will bypass, but good to have)
CREATE POLICY "Enable write for missions (admins)" 
ON public.missions 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 9. DONATIONS TABLE (For Sponsor Page)
CREATE TABLE if not exists public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    donor_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    avatar_url TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE
);

-- RLS for Donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Enable read for donations (public)" 
ON public.donations 
FOR SELECT 
TO public 
USING (true);

-- Allow Public Insert (For demo purposes/simulated payment webhook)
CREATE POLICY "Enable insert for donations (public)" 
ON public.donations 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 10. DEMO RAFFLE ENTRIES TABLE (For Demo Flow)
CREATE TABLE if not exists public.demo_raffle_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    social_handle TEXT,
    demo_google_id TEXT, -- Optional ID from the "Demo" Google Auth
    is_winner BOOLEAN DEFAULT FALSE,
    is_first_time BOOLEAN DEFAULT FALSE -- New field for tracking first-time visitors
);

-- RLS for Demo Raffle Entries
ALTER TABLE public.demo_raffle_entries ENABLE ROW LEVEL SECURITY;

-- Allow Public Insert (Since we might use a public client for the demo flow)
CREATE POLICY "Enable insert for demo_raffle_entries (public)" 
ON public.demo_raffle_entries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow Read for Admins/Service Role (Authenticated)
CREATE POLICY "Enable read for demo_raffle_entries (admins)" 
ON public.demo_raffle_entries 
FOR SELECT 
TO authenticated 
USING (true);
