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
-- alter publication supabase_realtime add table public.feedback;
