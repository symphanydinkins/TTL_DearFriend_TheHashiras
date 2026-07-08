import { useState, useEffect } from 'react'
import { supabase, Profile } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function DiscoverPage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfiles()
    }
  }, [user])

  async function fetchProfiles() {
    if (!user) return

    const { data: swiped } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', user.id)

    const swipedIds = swiped?.map(s => s.swiped_id) || []

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'eq', user.id)
      .not('id', 'in', swipedIds.length > 0 ? swipedIds : ['00000000-0000-0000-0000-000000000000'])

    if (!error && data) {
      setProfiles(data as Profile[])
    }
    setLoading(false)
  }

  async function handleSwipe(direction: 'left' | 'right') {
    if (!user || swiping || currentIndex >= profiles.length) return

    setSwiping(true)
    setSwipeDirection(direction)

    const targetProfile = profiles[currentIndex]

    setTimeout(async () => {
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: targetProfile.id,
        direction,
      })

      if (direction === 'right') {
        const { data: mutualSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', targetProfile.id)
          .eq('swiped_id', user.id)
          .eq('direction', 'right')
          .maybeSingle()

        if (mutualSwipe) {
          const user1Id = user.id < targetProfile.id ? user.id : targetProfile.id
          const user2Id = user.id < targetProfile.id ? targetProfile.id : user.id

          await supabase.from('matches').insert({
            user1_id: user1Id,
            user2_id: user2Id,
          })
        }
      }

      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
      setSwiping(false)
    }, 300)
  }

  if (loading) {
    return <div className="loading-page">Loading profiles...</div>
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="no-profiles-page">
        <h2>No more profiles</h2>
        <p>Check back later for new people to discover!</p>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]
  const profilePhoto = currentProfile.photo_urls?.[0] || currentProfile.avatar_url || '/placeholder-avatar.png'

  return (
    <div className="discover-page">
      <div className="swipe-container">
        <div className={`profile-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
          <div className="profile-image-container">
            <img
              src={profilePhoto}
              alt={currentProfile.name}
              className="profile-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
              }}
            />
            <div className="profile-overlay">
              <h2>{currentProfile.name}, {currentProfile.age || '?'}</h2>
              <p className="location">{currentProfile.location || 'Location not set'}</p>
            </div>
          </div>

          <div className="profile-details">
            <p className="bio">{currentProfile.bio || 'No bio yet...'}</p>

            <div className="hobbies-section">
              <h3>Hobbies</h3>
              <div className="hobby-tags">
                {currentProfile.hobbies?.map(hobby => (
                  <span key={hobby} className="hobby-tag">{hobby}</span>
                ))}
                {(!currentProfile.hobbies || currentProfile.hobbies.length === 0) && (
                  <span className="no-hobbies">No hobbies set</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="swipe-buttons">
          <button
            className="swipe-btn pass"
            onClick={() => handleSwipe('left')}
            disabled={swiping}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            className="swipe-btn like"
            onClick={() => handleSwipe('right')}
            disabled={swiping}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
