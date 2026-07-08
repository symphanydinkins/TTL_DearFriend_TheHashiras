/*
# Dear Friend - Initial Database Schema

1. Tables
- `profiles` - User profiles with name, bio, hobbies, images
  - id (uuid, primary key, references auth.users)
  - name (text, not null)
  - bio (text)
  - hobbies (text array)
  - avatar_url (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- `swipes` - Swipe/matching records
  - id (uuid, primary key)
  - swiper_id (uuid, references profiles)
  - swiped_id (uuid, references profiles)
  - direction (text: 'like' or 'pass')
  - created_at (timestamp)

- `matches` - Mutual matches between users
  - id (uuid, primary key)
  - user1_id (uuid, references profiles)
  - user2_id (uuid, references profiles)
  - created_at (timestamp)

- `messages` - Private messages between matched users
  - id (uuid, primary key)
  - match_id (uuid, references matches)
  - sender_id (uuid, references profiles)
  - content (text, not null)
  - created_at (timestamp)
  - read_at (timestamp)

- `posts` - User posts/images
  - id (uuid, primary key)
  - user_id (uuid, references profiles)
  - image_url (text)
  - caption (text)
  - created_at (timestamp)

2. Security
- RLS enabled on all tables
- Owner-scoped policies for authenticated users
- Users can only see their own data and data from their matches
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  hobbies text[] DEFAULT '{}',
  avatar_url text DEFAULT 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=300',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (true);

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
  direction text NOT NULL CHECK (direction IN ('like', 'pass')),
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
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_matches" ON matches;
CREATE POLICY "select_own_matches" ON matches FOR SELECT
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "insert_own_matches" ON matches;
CREATE POLICY "insert_own_matches" ON matches FOR INSERT
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
    ) AND auth.uid() = sender_id
  );

DROP POLICY IF EXISTS "update_match_messages" ON messages;
CREATE POLICY "update_match_messages" ON messages FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
