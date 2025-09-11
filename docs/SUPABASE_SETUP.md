# Supabase Setup Guide for Awesome PWA Boilerplate

This guide provides complete setup instructions for the Supabase backend of the Awesome PWA boilerplate, ensuring consistent and reliable database setup for all your projects.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Creation](#database-schema-creation)
4. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [Environment Variables](#environment-variables)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)
8. [Migration Guide](#migration-guide)

## 🔧 Prerequisites

- Supabase account ([supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic knowledge of SQL

## 🚀 Supabase Project Setup

### 1. Create New Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: `awesome-pwa` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create Project"

### 2. Wait for Setup
- Project creation takes 2-3 minutes
- You'll receive an email when ready
- Note your project URL and API keys from Settings → API

## 🗄️ Database Schema Creation

### Step 1: Create Profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table for user data
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  language_pref TEXT DEFAULT 'en',
  -- Onboarding fields
  onboarding_completed BOOLEAN DEFAULT FALSE,
  referral_source TEXT,
  objectives TEXT[], -- Array for multi-select objectives
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Verify Table Creation

```sql
-- Check table was created correctly
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

Expected output:
```
user_id: uuid, NO
username: text, YES
language_pref: text, YES
created_at: timestamp with time zone, YES
updated_at: timestamp with time zone, YES
```

## 🔒 Row Level Security (RLS) Policies

### Enable RLS and Create Policies

```sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own profile (for signups)
-- ⚠️ CRITICAL: WITH CHECK clause is required for INSERT policies
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

> **⚠️ Important**: The `WITH CHECK` clause in INSERT policies is critical. Without it, the policy allows inserts but doesn't validate them, which can cause profile creation to fail silently. Always include `WITH CHECK` in INSERT policies.

### Verify RLS Setup

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```

## 🌍 Environment Variables

### 1. Get Your Supabase Keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

### 2. Create Environment File

Create `.env.local` in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Verify Environment Setup

```bash
# Check environment variables are loaded
npm run dev
# Look for successful Supabase connection in console
```

## 🧪 Testing the Setup

### 1. Test User Registration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Sign Up" and create a new account
4. Check Supabase Auth → Users to verify account creation

### 2. Test Profile Creation

```sql
-- Check if profile was created automatically
SELECT * FROM profiles WHERE user_id = 'your-user-id';
```

### 3. Test Profile Updates

1. Go to Profile page in your app
2. Update username
3. Check browser console for success messages
4. Verify changes in Supabase table

### 4. Test Dashboard

1. Navigate to Dashboard
2. Verify username appears in welcome message
3. Check for any console errors

## 🔧 Troubleshooting

### Issue: INSERT Policy Missing WITH CHECK Clause

**Symptoms**: User signup succeeds but profile is never created, no errors shown
**Cause**: INSERT policy created without `WITH CHECK` clause, causing inserts to fail silently
**Solution**:

1. **Check current INSERT policy syntax**:
```sql
-- View the exact policy definition
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';
```

2. **If WITH_CHECK column is empty, fix the policy**:
```sql
-- Drop the incorrect policy
DROP POLICY "Users can insert own profile" ON profiles;

-- Re-create with proper WITH CHECK clause
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

3. **Verify the fix**:
```sql
-- Should now show 'auth.uid() = user_id' in with_check column
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';
```

4. **Test profile creation**:
   - Try signing up a new user
   - Check if profile record is created in the profiles table

### Issue: 406 Not Acceptable Errors

**Symptoms**: Profile fetch fails with 406 errors
**Cause**: Missing or incorrect RLS policies
**Solution**:
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Re-create policies if missing
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- Then re-run the RLS policy creation commands above
```

### Issue: Username Updates Don't Persist

**Symptoms**: Update succeeds but data doesn't change
**Cause**: Primary key mismatch or RLS blocking updates
**Solution**:
```sql
-- Check current primary key
SELECT conname, conkey
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass AND contype = 'p';

-- Ensure user_id is primary key
ALTER TABLE profiles DROP CONSTRAINT profiles_pkey;
ALTER TABLE profiles ADD PRIMARY KEY (user_id);
```

### Issue: Profile Not Created on Signup

**Symptoms**: User can sign up but no profile record exists
**Cause**: Profile creation failed due to RLS policy issues, application errors, or missing triggers
**Solution**:

1. **Check for recent signups without profiles**:
```sql
-- Find users who signed up but have no profile
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL
ORDER BY au.created_at DESC
LIMIT 5;
```

2. **Verify INSERT policy is correct**:
```sql
-- Check INSERT policy has WITH CHECK clause
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';
```
Expected: `with_check` column should contain `auth.uid() = user_id`

3. **If policy is missing/incorrect, fix it**:
```sql
-- Drop incorrect policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create correct policy
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

4. **Test profile creation manually**:
```sql
-- Replace 'your-user-id' with actual UUID from step 1
INSERT INTO profiles (user_id, username)
VALUES ('your-user-id', 'testuser');
```

5. **Check application logs** for any errors during signup process

### Issue: Environment Variables Not Loading

**Symptoms**: Supabase connection fails
**Cause**: Wrong file name or Vite not loading variables
**Solution**:
- Ensure file is named `.env.local` (not `.env`)
- Restart dev server after adding variables
- Check variables start with `VITE_`

### Issue: Foreign Key Constraint Errors

**Symptoms**: Insert/update fails with foreign key errors
**Cause**: User doesn't exist in auth.users
**Solution**:
```sql
-- Check user exists in auth
SELECT id, email FROM auth.users WHERE id = 'your-user-id';

-- Verify foreign key constraint
SELECT
  tc.table_name, kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'profiles';
```

## 📈 Migration Guide

### From Old Schema to New Schema

If you have an existing project with the old schema (with `id` column), migrate using:

```sql
-- Backup your data first!
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Drop old primary key
ALTER TABLE profiles DROP CONSTRAINT profiles_pkey;

-- Make user_id the primary key
ALTER TABLE profiles ADD PRIMARY KEY (user_id);

-- Add foreign key if missing
ALTER TABLE profiles
ADD CONSTRAINT profiles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove unnecessary id column
ALTER TABLE profiles DROP COLUMN id;

-- Add updated_at trigger
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Profiles table exists with correct schema
- [ ] RLS policies are active
- [ ] INSERT policy has WITH CHECK clause
- [ ] Environment variables configured
- [ ] User registration works
- [ ] Profile creation automatic
- [ ] Username updates persist
- [ ] Dashboard shows correct username
- [ ] No console errors

## 🎯 Next Steps

1. **Test thoroughly** with multiple user accounts
2. **Customize** the profile fields as needed
3. **Add authentication providers** (Google, GitHub, etc.) in Supabase Auth settings
4. **Set up backup policies** in Supabase
5. **Configure monitoring** if needed

This setup provides a solid, scalable foundation for user management in your PWA applications! 🚀
