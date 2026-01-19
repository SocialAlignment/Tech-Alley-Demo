-- 1. Create the feedback table
create table public.feedback (
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
-- (Since your app uses the anon key for submissions)
create policy "Enable insert for everyone" 
on public.feedback 
for insert 
to public 
with check (true);

-- 4. Create Policy: Allow ANYONE to SELECT (Read) questions
-- (Needed for the live QuestionsStack to see new questions)
create policy "Enable read for everyone" 
on public.feedback 
for select 
to public 
using (true);

-- 5. Create Policy: Allow ANYONE to UPDATE (Mark as Answered)
-- (Needed so the "Mark Answered" button works from the client)
create policy "Enable update for everyone" 
on public.feedback 
for update 
to public 
using (true);

-- 6. Enable Realtime updates for this table
-- This allows the QuestionsStack to update instantly when a question comes in.
alter publication supabase_realtime add table public.feedback;
