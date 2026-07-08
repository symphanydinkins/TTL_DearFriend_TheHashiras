export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Dear Friend</h1>
        <p className="tagline">Find your perfect hobby buddy</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Dear Friend is designed to connect people based on shared hobbies and interests.
          Whether you love gaming, hiking, photography, or any other passion,
          we help you find like-minded individuals to share your experiences with.
        </p>
      </section>

      <section className="about-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3>Smart Matching</h3>
            <p>Swipe right on profiles that match your interests and hobbies</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3>Private Messaging</h3>
            <p>Chat with your matches and plan your next adventure together</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Photo Sharing</h3>
            <p>Share your hobbies through photos and connect with the community</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <p className="team-intro">
          Dear Friend was created by a passionate team of developers who believe in the power of shared interests.
        </p>
        <div className="team-links">
          <a href="/team/developer-1" className="team-link-card">
            <div className="member-avatar">A</div>
            <div className="member-info">
              <h3>Developer 1</h3>
              <p>Lead Developer</p>
            </div>
          </a>
          <a href="/team/developer-2" className="team-link-card">
            <div className="member-avatar">B</div>
            <div className="member-info">
              <h3>Developer 2</h3>
              <p>UI/UX Designer</p>
            </div>
          </a>
          <a href="/team/developer-3" className="team-link-card">
            <div className="member-avatar">C</div>
            <div className="member-info">
              <h3>Developer 3</h3>
              <p>Backend Engineer</p>
            </div>
          </a>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <div className="contact-links">
          <a href="/contact" className="btn-primary">Contact Page</a>
        </div>
      </section>
    </div>
  )
}
