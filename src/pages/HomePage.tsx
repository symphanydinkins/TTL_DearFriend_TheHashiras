import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  if (user && profile) {
    navigate('/discover')
    return null
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your <span className="highlight">Hobby Buddy</span></h1>
          <p className="hero-subtitle">
            Connect with like-minded people who share your passions.
            Swipe, match, and start your next adventure together.
          </p>
          <div className="hero-actions">
            <button className="btn-primary large" onClick={() => navigate('/auth')}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => navigate('/about')}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="mockup-header">Dear Friend</div>
            <div className="mockup-content">
              <div className="mockup-card">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
                  alt="Sample profile"
                />
                <div className="mockup-overlay">
                  <span className="mockup-name">Sarah, 28</span>
                  <div className="mockup-hobbies">
                    <span>Hiking</span>
                    <span>Photography</span>
                    <span>Music</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Share your hobbies, interests, and what you're looking for in a friend.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Discover & Match</h3>
            <p>Swipe through profiles, find people with shared interests, and match!</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Connect & Enjoy</h3>
            <p>Chat with your matches, plan activities, and build lasting friendships.</p>
          </div>
        </div>
      </section>

      <section className="community-section">
        <h2>Join Our Community</h2>
        <p>Thousands of people are already finding their perfect hobby buddies.</p>
        <div className="community-stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-text">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-text">Matches Made</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100+</span>
            <span className="stat-text">Hobby Categories</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Find Your New Friend?</h2>
        <p>Start your journey today and connect with people who share your passion.</p>
        <button className="btn-primary large" onClick={() => navigate('/auth')}>
          Join Now - It's Free
        </button>
      </section>
    </div>
  )
}
