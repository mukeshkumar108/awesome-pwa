import { supabase } from './supabase';

// This function creates a new user profile record in the 'profiles' table.
// It is typically called right after a new user signs up.
export const createProfile = async (user_id: string, username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        user_id,
        username,
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// This function retrieves a user's profile from the 'profiles' table.
export const getProfile = async (user_id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// This function updates an existing user profile record.
export const updateProfile = async (user_id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
