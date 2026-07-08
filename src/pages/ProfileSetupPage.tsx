import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const HOBBY_OPTIONS = [
  'Gaming', 'Reading', 'Hiking', 'Cooking', 'Photography',
  'Music', 'Art', 'Sports', 'Travel', 'Movies',
  'Fitness', 'Yoga', 'Writing', 'Dancing', 'Coding'
]

export default function ProfileSetupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleHobby(hobby: string) {
    setSelectedHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setError(null)
    setLoading(true)

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name,
          age: parseInt(age) || null,
          bio,
          location,
          hobbies: selectedHobbies,
        })

      if (profileError) throw profileError
      navigate('/discover')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-setup-page">
      <div className="setup-card">
        <h1>Create Your Profile</h1>
        <p>Tell us about yourself so we can find you the perfect hobby buddy</p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min="18"
              max="120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Hobbies (select at least 3)</label>
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

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || selectedHobbies.length < 3}
          >
            {loading ? 'Creating...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
