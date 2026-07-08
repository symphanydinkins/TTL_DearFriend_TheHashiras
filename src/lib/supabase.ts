import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  bio: string;
  hobbies: string[];
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type Post = {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
  profiles?: Profile;
};

export type Swipe = {
  id: string;
  swiper_id: string;
  swiped_id: string;
  direction: 'like' | 'pass';
  created_at: string;
};
