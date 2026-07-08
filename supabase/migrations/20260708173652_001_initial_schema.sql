/*
# Dear Friend App - Initial Database Schema

This migration creates the core tables for the Dear Friend hobby-based matching app.

1. New Tables
- `profiles` - User profiles with hobbies, bio, and photos
  - id (uuid, primary key, references auth.users)
  - name (text)
  - age (integer)
  - bio (text)
  - hobbies (text array)
  - location (text)
  - photo_urls (text array)
  - created_at (timestamp)
  - updated_at (timestamp)
- `matches` - Mutual match records between users
  - id (uuid, primary key)
  - user1_id (uuid, references profiles)
  - user2_id (uuid, references profiles)
  - matched_at (timestamp)
  - created_at (timestamp)
- `swipes` - Individual swipe/like records
  - id (uuid, primary key)
  - swiper_id (uuid, references profiles)
  - swiped_id (uuid, references profiles)
  - direction (text: 'left' or 'right')
  - created_at (timestamp)
- `messages` - Private messages between matched users
  - id (uuid, primary key)
  - match_id (uuid, references matches)
  - sender_id (uuid, references profiles)
  - content (text)
  - created_at (timestamp)
  - read_at (timestamp, nullable)
- `posts` - User-shared images/posts
  - id (uuid, primary key)
  - user_id (uuid, references profiles)
  - image_url (text)
  - caption (text)
  - created_at (timestamp)

2. Security
- Enable RLS on all tables
- Owner-scoped policies for profiles, swipes, posts
- Match participants can access their messages
- Users can view profiles they've matched with
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  age integer,
  bio text DEFAULT '',
  hobbies text[] DEFAULT '{}',
  location text DEFAULT '',
  photo_urls text[] DEFAULT '{}',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  direction text NOT NULL CHECK (direction IN ('left', 'right')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_swipes" ON swipes;
CREATE POLICY "select_own_swipes" ON swipes FOR SELECT
  TO authenticated USING (auth.uid() = swiper_id);

DROP POLICY IF EXISTS "insert_own_swipes" ON swipes;
CREATE POLICY "insert_own_swipes" ON swipes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = swiper_id);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_matches" ON matches;
CREATE POLICY "select_own_matches" ON matches FOR SELECT
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "insert_matches" ON matches;
CREATE POLICY "insert_matches" ON matches FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_match_messages" ON messages;
CREATE POLICY "select_match_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_match_messages" ON messages;
CREATE POLICY "insert_match_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
    AND auth.uid() = sender_id
  );

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_posts" ON posts;
CREATE POLICY "select_all_posts" ON posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_posts" ON posts;
CREATE POLICY "insert_own_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_posts" ON posts;
CREATE POLICY "delete_own_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);