-- ==============================================
-- FIX: Google OAuth Persistence Trigger
-- Run this in the Supabase SQL Editor to ensure
-- Google Logins are automatically synced to your app.
-- ==============================================

-- 1. Create the Function that handles the new user
CREATE OR REPLACE FUNCTION public.handle_new_google_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into the table your app reads from (demo_raffle_entries)
  INSERT INTO public.demo_raffle_entries (
    name,
    email,
    demo_google_id, -- Link the Supabase Auth ID here
    responses,      -- Initialize empty JSON
    score,
    entries_count
  )
  VALUES (
    -- Try to get name from Google metadata, fallback to email part
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.id,
    '{}'::jsonb,
    0,
    1
  )
  ON CONFLICT (email) DO UPDATE SET
    -- If they exist (e.g. registered before logging in), just link the ID
    demo_google_id = EXCLUDED.demo_google_id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
-- Drop first to avoid errors if you run it multiple times
DROP TRIGGER IF EXISTS on_auth_user_created_genai ON auth.users;

CREATE TRIGGER on_auth_user_created_genai
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_google_user();

-- 3. Verify it works (Optional: Check if trigger exists)
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created_genai';
