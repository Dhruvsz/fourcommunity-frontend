-- Add is_admin column to user_profiles table
-- This script is safe to run multiple times

-- Add the is_admin column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
        
        RAISE NOTICE 'Added is_admin column to user_profiles table';
    ELSE
        RAISE NOTICE 'is_admin column already exists in user_profiles table';
    END IF;
END $$;

-- Optional: Set a specific user as admin (replace with actual user ID)
-- UPDATE user_profiles SET is_admin = TRUE WHERE email = 'your-admin-email@example.com';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'is_admin';