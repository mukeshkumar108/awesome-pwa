import { createClient } from "@supabase/supabase-js";

// Ensure your .env.local file has these variables defined.
// Do not expose these keys in a public client-side app (which Vite prevents automatically).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
