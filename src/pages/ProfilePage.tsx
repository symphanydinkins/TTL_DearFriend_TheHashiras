import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const HOBBY_OPTIONS = [
  'Gaming', 'Reading', 'Hiking', 'Cooking', 'Photography',
  'Music', 'Art', 'Sports', 'Travel', 'Movies',
  'Fitness', 'Yoga', 'Writing', 'Dancing', 'Coding'
]

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ matches: 0, posts: 0 })

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setAge(profile.age?.toString() || '')
      setBio(profile.bio)
      setLocation(profile.location)
      setSelectedHobbies(profile.hobbies || [])
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  async function fetchStats() {
    if (!user) return

    const { count: matchCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

    const { count: postCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    setStats({ matches: matchCount || 0, posts: postCount || 0 })
  }

  function toggleHobby(hobby: string) {
    setSelectedHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        age: parseInt(age) || null,
        bio,
        location,
        hobbies: selectedHobbies,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (!error) {
      setEditing(false)
      window.location.reload()
    }
    setSaving(false)
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Please sign in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar_url || profile.photo_urls?.[0] ? (
            <img
              src={profile.avatar_url || profile.photo_urls?.[0]}
              alt={profile.name}
            />
          ) : (
            <div className="avatar-placeholder large">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="profile-location">{profile.location || 'Location not set'}</p>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats.matches}</span>
              <span className="stat-label">Matches</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.posts}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>

          {!editing && (
            <button className="btn-secondary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <form onSubmit={saveProfile} className="edit-profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="120"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="form-group">
            <label>Hobbies</label>
            <div className="hobby-grid">
              {HOBBY_OPTIONS.map(hobby => (
                <button
                  key={hobby}
                  type="button"
                  className={`hobby-btn ${selectedHobbies.includes(hobby) ? 'selected' : ''}`}
                  onClick={() => toggleHobby(hobby)}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <div className="bio-section">
            <h2>About Me</h2>
            <p>{profile.bio || 'No bio yet...'}</p>
          </div>

          <div className="hobbies-section">
            <h2>My Hobbies</h2>
            <div className="hobby-tags">
              {profile.hobbies?.map(hobby => (
                <span key={hobby} className="hobby-tag">{hobby}</span>
              ))}
              {(!profile.hobbies || profile.hobbies.length === 0) && (
                <span className="no-hobbies">No hobbies set</span>
              )}
            </div>
          </div>

          <button className="btn-logout" onClick={signOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
