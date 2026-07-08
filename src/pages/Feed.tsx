import { useState, useEffect } from 'react';
import { supabase, type Post, type Profile } from '../lib/supabase';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import './Feed.css';

interface PostWithProfile extends Post {
  profiles: Profile;
}

export default function Feed() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (id, name, avatar_url, hobbies)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    setPosts(data?.map(p => ({ ...p, profiles: p.profiles as Profile })) || []);
    setLoading(false);
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  if (loading) {
    return (
      <div className="feed-page">
        <div className="feed-loading">
          <div className="loading-spinner" />
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1>Community Feed</h1>
        <p>See what your friends are sharing</p>
      </div>

      {posts.length === 0 ? (
        <div className="feed-empty">
          <Heart size={48} />
          <h2>No posts yet</h2>
          <p>Be the first to share something!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="feed-post"
            >
              <div className="post-header">
                <img
                  src={post.profiles?.avatar_url}
                  alt={post.profiles?.name}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <h3>{post.profiles?.name || 'Unknown'}</h3>
                  <span className="post-time">{formatTime(post.created_at)}</span>
                </div>
              </div>
              <div className="post-image-container">
                <img src={post.image_url} alt={post.caption} className="post-image" />
              </div>
              {post.caption && (
                <div className="post-content">
                  <p>
                    <strong>{post.profiles?.name}</strong> {post.caption}
                  </p>
                </div>
              )}
              <div className="post-hobbies">
                {post.profiles?.hobbies?.slice(0, 3).map((hobby, idx) => (
                  <span key={idx} className="hobby-tag">{hobby}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
