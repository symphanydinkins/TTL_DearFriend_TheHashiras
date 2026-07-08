import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Profile, Match } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface MatchWithProfile extends Match {
  other_profile?: Profile
}

export default function MatchesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState<MatchWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchMatches()
    }
  }, [user])

  async function fetchMatches() {
    if (!user) return

    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('matched_at', { ascending: false })

    if (!matchData) {
      setLoading(false)
      return
    }

    const matchesWithProfiles = await Promise.all(
      matchData.map(async (match) => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .maybeSingle()

        return {
          ...match,
          other_profile: profile as Profile,
        }
      })
    )

    setMatches(matchesWithProfiles)
    setLoading(false)
  }

  if (loading) {
    return <div className="loading-page">Loading matches...</div>
  }

  if (matches.length === 0) {
    return (
      <div className="empty-state-page">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2>No matches yet</h2>
        <p>Start swiping to find your new hobby buddy!</p>
        <button className="btn-primary" onClick={() => navigate('/discover')}>
          Discover People
        </button>
      </div>
    )
  }

  return (
    <div className="matches-page">
      <h1>Your Matches</h1>
      <div className="matches-grid">
        {matches.map(match => {
          const profile = match.other_profile
          if (!profile) return null

          const photo = profile.photo_urls?.[0] || profile.avatar_url

          return (
            <div
              key={match.id}
              className="match-card"
              onClick={() => navigate(`/messages/${match.id}`)}
            >
              <div className="match-avatar">
                {photo ? (
                  <img
                    src={photo}
                    alt={profile.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="match-info">
                <h3>{profile.name}</h3>
                <p className="match-hobbies">
                  {profile.hobbies?.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
