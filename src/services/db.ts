import { supabase } from './supabase';
import type { AuthSession } from '@supabase/supabase-js';

// Fetches the user's profile from the 'profiles' table.
export async function getProfile(session: AuthSession | null) {
  if (!session) {
    console.error('No active session.');
    return null;
  }

  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*') // Select all columns including onboarding fields
      .eq('user_id', session.user.id) // Filter by the logged-in user's ID
      .single(); // Ensure only a single record is returned

    if (error && status !== 406) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return null;
  }
}

// Updates the user's profile in the 'profiles' table.
export async function updateProfile(session: AuthSession, updates: Record<string, any>) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }

    console.log('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

// Creates a new profile for a newly signed-up user.
export async function createProfile(user: any) {
  try {
    const { error } = await supabase.from('profiles').insert({
      user_id: user.id,
      username: user.email?.split('@')[0], // Use email prefix as a default username
    });

    if (error) {
      throw error;
    }

    console.log('Profile created successfully!');
  } catch (error) {
    console.error('Error creating new profile:', error);
  }
}
