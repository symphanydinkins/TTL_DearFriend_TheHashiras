import { useState, useEffect } from 'react'
import { supabase, Post, Profile } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<(Post & { profiles?: Profile })[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })

    if (data) {
      setPosts(data as (Post & { profiles?: Profile })[])
    }
    setLoading(false)
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)

    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        caption,
      })

    if (!error) {
      setImageUrl('')
      setCaption('')
      setShowCreateForm(false)
      fetchPosts()
    }
    setSubmitting(false)
  }

  async function deletePost(postId: string) {
    if (!user) return

    await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (loading) {
    return <div className="loading-page">Loading posts...</div>
  }

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1>Community Posts</h1>
        {user && (
          <button
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Share a Photo
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="create-post-modal">
          <div className="modal-content">
            <h2>Share a Photo</h2>
            <form onSubmit={createPost}>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>
              <div className="form-group">
                <label>Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening?"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || !imageUrl}
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-image">
              <img src={post.image_url} alt={post.caption || 'Post'} />
            </div>
            <div className="post-content">
              <div className="post-author">
                {post.profiles?.name || 'Unknown User'}
                {post.user_id === user?.id && (
                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              {post.caption && <p className="post-caption">{post.caption}</p>}
              <span className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
  )
}
