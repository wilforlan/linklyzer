import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type LinkRecord = {
  id: string;
  shortId: string;
  originalUrl: string;
  createdAt: string;
};

export type AnalyticsRecord = {
  id: string;
  linkId: string;
  visitorIp: string | null;
  userAgent: string | null;
  referer: string | null;
  timestamp: string;
  country: string | null;
  city: string | null;
  device: string | null;
}; 