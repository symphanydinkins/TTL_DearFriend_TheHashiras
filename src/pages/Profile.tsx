import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, type Post } from '../lib/supabase';
import { Camera, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './Profile.css';

const HOBBY_SUGGESTIONS = [
  'hiking', 'reading', 'gaming', 'cooking', 'music', 'art', 'fitness',
  'travel', 'photography', 'yoga', 'movies', 'coffee', 'coding', 'gardening'
];

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/1172208/pexels-photo-1172208.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1051833/pexels-photo-1051833.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1103536/pexels-photo-1103536.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1679612/pexels-photo-1679612.jpeg?auto=compress&cs=tinysrgb&w=600'
];

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editHobbies, setEditHobbies] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditBio(profile.bio);
      setEditHobbies(profile.hobbies || []);
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function loadPosts() {
    if (!user) return;

    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setPosts(data || []);
  }

  async function handleSaveProfile() {
    setSaving(true);
    await updateProfile({
      name: editName,
      bio: editBio,
      hobbies: editHobbies
    });
    setIsEditing(false);
    setSaving(false);
  }

  async function handleCreatePost() {
    if (!newImageUrl.trim() || !user || posting) return;

    setPosting(true);
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        image_url: newImageUrl.trim(),
        caption: newCaption.trim()
      });

    if (!error) {
      setShowPostModal(false);
      setNewImageUrl('');
      setNewCaption('');
      loadPosts();
    }
    setPosting(false);
  }

  async function handleDeletePost(postId: string) {
    await supabase.from('posts').delete().eq('id', postId);
    loadPosts();
  }

  function toggleHobby(hobby: string) {
    if (editHobbies.includes(hobby)) {
      setEditHobbies(editHobbies.filter(h => h !== hobby));
    } else if (editHobbies.length < 5) {
      setEditHobbies([...editHobbies, hobby]);
    }
  }

  function addRandomHobby() {
    const available = HOBBY_SUGGESTIONS.filter(h => !editHobbies.includes(h));
    if (available.length > 0 && editHobbies.length < 5) {
      const random = available[Math.floor(Math.random() * available.length)];
      setEditHobbies([...editHobbies, random]);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={profile?.avatar_url} alt={profile?.name} className="profile-avatar" />
          <button className="avatar-edit-btn">
            <Camera size={18} />
          </button>
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <div className="profile-name-row">
              <h1>{profile?.name || 'Your Name'}</h1>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <Edit2 size={18} />
              </button>
            </div>
            <p className="profile-bio">{profile?.bio || 'Add a bio to tell others about yourself'}</p>
            <div className="profile-hobbies">
              {profile?.hobbies?.map((hobby, idx) => (
                <span key={idx} className="hobby-tag">{hobby}</span>
              ))}
              {(!profile?.hobbies || profile.hobbies.length === 0) && (
                <span className="no-hobbies">Add hobbies to find like-minded friends</span>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-edit-form"
          >
            <div className="edit-field">
              <label>Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="edit-field">
              <label>Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell others about yourself..."
                rows={3}
              />
            </div>
            <div className="edit-field">
              <label>Hobbies (select up to 5)</label>
              <div className="hobby-selector">
                {editHobbies.map((hobby, idx) => (
                  <button
                    key={idx}
                    className="hobby-tag selected"
                    onClick={() => toggleHobby(hobby)}
                  >
                    {hobby} <X size={14} />
                  </button>
                ))}
                {editHobbies.length < 5 && (
                  <button className="hobby-tag add" onClick={addRandomHobby}>
                    <Plus size={14} /> Add
                  </button>
                )}
              </div>
              <div className="hobby-suggestions">
                {HOBBY_SUGGESTIONS.filter(h => !editHobbies.includes(h)).slice(0, 8).map((hobby) => (
                  <button
                    key={hobby}
                    className="hobby-suggestion"
                    onClick={() => toggleHobby(hobby)}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="posts-section">
        <div className="posts-header">
          <h2>Your Posts</h2>
          <button className="new-post-btn" onClick={() => setShowPostModal(true)}>
            <Plus size={18} /> New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="posts-empty">
            <Camera size={48} />
            <h3>No posts yet</h3>
            <p>Share moments with your friends</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <img src={post.image_url} alt={post.caption} className="post-image" />
                {post.caption && <p className="post-caption">{post.caption}</p>}
                <button
                  className="post-delete"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="signout-btn" onClick={signOut}>
        Sign Out
      </button>

      {showPostModal && (
        <div className="post-modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Post</h2>
            <div className="image-preview">
              {newImageUrl ? (
                <img src={newImageUrl} alt="Preview" />
              ) : (
                <div className="image-placeholder">
                  <Camera size={32} />
                  <p>Add an image URL</p>
                </div>
              )}
            </div>
            <input
              type="url"
              placeholder="Image URL (paste a link)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <div className="sample-images">
              <p>Or try a sample:</p>
              <div className="sample-grid">
                {SAMPLE_IMAGES.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Sample ${idx + 1}`}
                    onClick={() => setNewImageUrl(url)}
                    className={newImageUrl === url ? 'selected' : ''}
                  />
                ))}
              </div>
            </div>
            <textarea
              placeholder="Write a caption..."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              rows={2}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowPostModal(false)}>
                Cancel
              </button>
              <button
                className="post-btn"
                onClick={handleCreatePost}
                disabled={!newImageUrl.trim() || posting}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
