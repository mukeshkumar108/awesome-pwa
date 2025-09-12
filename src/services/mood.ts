import { supabase } from './supabase';

export interface MoodLog {
  id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  created_at: string;
}

export interface MoodLogCreate {
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}

export const MOOD_EMOJIS = {
  1: '😣',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄'
} as const;

export const MOOD_TAGS = {
  1: ['anxious', 'stressed', 'sad', 'tired', 'overwhelmed', 'lonely', 'frustrated', 'burnt_out'],
  2: ['stressed', 'tired', 'irritable', 'overwhelmed', 'flat', 'sad', 'frustrated', 'hopeful'],
  3: ['flat', 'calm', 'reflective', 'meh', 'hopeful', 'focused'],
  4: ['content', 'focused', 'productive', 'grateful', 'optimistic', 'energized', 'proud'],
  5: ['joyful', 'grateful', 'inspired', 'content', 'proud', 'energized', 'optimistic']
} as const;

export async function createMoodLog(moodData: MoodLogCreate): Promise<MoodLog | null> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found');
    return null;
  }

  console.log('Creating mood log for user:', user.id);

  const { data, error } = await supabase
    .from('mood_logs')
    .insert([{
      user_id: user.id,
      rating: moodData.rating,
      tags: moodData.tags || []
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating mood log:', error);
    return null;
  }

  console.log('Mood log created successfully:', data);
  return data;
}

export async function getMoodLogs(limit?: number): Promise<MoodLog[]> {
  let query = supabase
    .from('mood_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching mood logs:', error);
    return [];
  }

  return data || [];
}

export async function getMoodLogById(id: string): Promise<MoodLog | null> {
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching mood log:', error);
    return null;
  }

  return data;
}

export function getEmojiForRating(rating: 1 | 2 | 3 | 4 | 5): string {
  return MOOD_EMOJIS[rating];
}

export function getTagsForRating(rating: 1 | 2 | 3 | 4 | 5): string[] {
  return [...(MOOD_TAGS[rating] || [])];
}

export function formatMoodTimestamp(created_at: string): string {
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
