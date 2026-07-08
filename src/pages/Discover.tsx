import { useState, useEffect } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Discover.css';

const DEMO_PROFILES: Profile[] = [
  {
    id: 'demo-1',
    name: 'Alex Chen',
    bio: 'Love hiking, photography, and good coffee. Always up for an adventure!',
    hobbies: ['hiking', 'photography', 'coffee', 'travel'],
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'demo-2',
    name: 'Maya Patel',
    bio: 'Bookworm and yoga enthusiast. Looking for study buddies and coffee chats.',
    hobbies: ['reading', 'yoga', 'meditation', 'tea'],
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'demo-3',
    name: 'Jordan Kim',
    bio: 'Software developer by day, musician by night. Love jamming with others!',
    hobbies: ['music', 'coding', 'gaming', 'cooking'],
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'demo-4',
    name: 'Sam Rivera',
    bio: 'Fitness enthusiast and dog lover. Looking for workout partners!',
    hobbies: ['fitness', 'dogs', 'running', 'outdoors'],
    avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'demo-5',
    name: 'Taylor Wong',
    bio: 'Artist and creative soul. Love collaborating on projects and exploring galleries.',
    hobbies: ['art', 'design', 'galleries', 'crafts'],
    avatar_url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '',
    updated_at: ''
  }
];

export default function Discover() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchPopup, setMatchPopup] = useState<Profile | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [user]);

  async function loadProfiles() {
    if (!user) return;

    setLoading(true);

    const { data: swipedIds } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', user.id);

    const swipedUserIds = swipedIds?.map(s => s.swiped_id) || [];
    swipedUserIds.push(user.id);

    const demoFiltered = DEMO_PROFILES.filter(p => !swipedUserIds.includes(p.id));

    const { data: realProfiles } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${swipedUserIds.join(',')})`)
      .limit(10);

    const allProfiles = [...demoFiltered, ...(realProfiles || [])];
    setProfiles(allProfiles);
    setLoading(false);
  }

  async function handleSwipe(swipedProfile: Profile, swipeDirection: 'like' | 'pass') {
    if (!user) return;

    const { error } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,
        swiped_id: swipedProfile.id,
        direction: swipeDirection
      });

    if (error) {
      console.error('Error recording swipe:', error);
      return;
    }

    if (swipeDirection === 'like' && !swipedProfile.id.startsWith('demo')) {
      const { data: theirSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', swipedProfile.id)
        .eq('swiped_id', user.id)
        .eq('direction', 'like')
        .maybeSingle();

      if (theirSwipe) {
        const smallerId = user.id < swipedProfile.id ? user.id : swipedProfile.id;
        const largerId = user.id < swipedProfile.id ? swipedProfile.id : user.id;

        await supabase
          .from('matches')
          .insert({
            user1_id: smallerId,
            user2_id: largerId
          });

        setMatchPopup(swipedProfile);
      }
    }

    setDirection(swipeDirection === 'like' ? 'right' : 'left');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  }

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="discover-page">
        <div className="discover-loading">
          <div className="loading-spinner" />
          <p>Finding friends...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <div className="discover-page">
        <div className="discover-empty">
          <Heart size={48} />
          <h2>No more profiles</h2>
          <p>Check back later for new friends!</p>
          <button onClick={loadProfiles} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>Discover Friends</h1>
        <p>Find people who share your interests</p>
      </div>

      <div className="discover-card-container">
        <AnimatePresence mode="wait">
          {direction === null && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                x: direction === 'right' ? 300 : -300,
                opacity: 0,
                rotate: direction === 'right' ? 20 : -20
              }}
              transition={{ duration: 0.3 }}
              className="discover-card"
            >
              <div className="card-image-container">
                <img
                  src={currentProfile.avatar_url}
                  alt={currentProfile.name}
                  className="card-image"
                />
                <div className="card-gradient" />
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h2>{currentProfile.name}</h2>
                  <div className="card-hobbies">
                    {currentProfile.hobbies.slice(0, 4).map((hobby, idx) => (
                      <span key={idx} className="hobby-tag">{hobby}</span>
                    ))}
                  </div>
                </div>

                <p className="card-bio">{currentProfile.bio}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="discover-actions">
        <button
          className="action-btn pass-btn"
          onClick={() => handleSwipe(currentProfile, 'pass')}
          title="Pass"
        >
          <X size={28} />
        </button>
        <button
          className="action-btn like-btn"
          onClick={() => handleSwipe(currentProfile, 'like')}
          title="Like"
        >
          <Heart size={28} />
        </button>
      </div>

      {matchPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="match-popup"
          onClick={() => setMatchPopup(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="match-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="match-hearts">
              <Heart size={48} fill="#ff6b6b" color="#ff6b6b" />
            </div>
            <h2>It's a Match!</h2>
            <p>You and {matchPopup.name} liked each other</p>
            <img src={matchPopup.avatar_url} alt={matchPopup.name} className="match-avatar" />
            <div className="match-actions">
              <button className="match-btn secondary" onClick={() => setMatchPopup(null)}>
                Keep Swiping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
