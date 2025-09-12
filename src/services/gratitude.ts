import { supabase } from './supabase';

export interface GratitudeEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface GratitudeEntryCreate {
  content: string;
}

export async function createGratitudeEntry(entryData: GratitudeEntryCreate): Promise<GratitudeEntry | null> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found');
    return null;
  }

  console.log('Creating gratitude entry for user:', user.id);

  const { data, error } = await supabase
    .from('gratitude_entries')
    .insert([{
      user_id: user.id,
      content: entryData.content.trim()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating gratitude entry:', error);
    return null;
  }

  console.log('Gratitude entry created successfully:', data);
  return data;
}

export async function getGratitudeEntries(limit?: number): Promise<GratitudeEntry[]> {
  let query = supabase
    .from('gratitude_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gratitude entries:', error);
    return [];
  }

  return data || [];
}

export async function getGratitudeEntryById(id: string): Promise<GratitudeEntry | null> {
  const { data, error } = await supabase
    .from('gratitude_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching gratitude entry:', error);
    return null;
  }

  return data;
}

export function formatGratitudeTimestamp(created_at: string): string {
  try {
    const date = new Date(created_at);
    return date.toLocaleString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return created_at;
  }
}

export function truncateGratitudeContent(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}
