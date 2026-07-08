import { useParams } from 'react-router-dom'

interface Developer {
  id: string
  name: string
  role: string
  bio: string
  hobbies: string[]
  avatar: string
  github?: string
  linkedin?: string
}

const DEVELOPERS: Developer[] = [
  {
    id: 'developer-1',
    name: 'Alex Chen',
    role: 'Lead Developer',
    bio: 'Full-stack developer with a passion for building scalable applications. Love turning complex problems into simple, elegant solutions.',
    hobbies: ['Coding', 'Gaming', 'Photography', 'Music'],
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'developer-2',
    name: 'Brooke Williams',
    role: 'UI/UX Designer',
    bio: 'Creative designer focused on user-centered design. I believe great apps start with understanding user needs and creating intuitive experiences.',
    hobbies: ['Art', 'Design', 'Travel', 'Movies'],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'developer-3',
    name: 'Casey Johnson',
    role: 'Backend Engineer',
    bio: 'Database architect and API specialist. I ensure our platform runs smoothly and scales efficiently for all our users.',
    hobbies: ['Fitness', 'Hiking', 'Reading', 'Coding'],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
]

export default function DeveloperPage() {
  const { developerId } = useParams()

  const developer = DEVELOPERS.find(d => d.id === developerId)

  if (!developer) {
    return (
      <div className="developer-page not-found">
        <h2>Developer not found</h2>
        <p>The team member you're looking for doesn't exist.</p>
        <a href="/about" className="btn-primary">Back to About</a>
      </div>
    )
  }

  return (
    <div className="developer-page">
      <div className="developer-header">
        <div className="developer-avatar">
          <img src={developer.avatar} alt={developer.name} />
        </div>
        <div className="developer-info">
          <h1>{developer.name}</h1>
          <p className="developer-role">{developer.role}</p>
        </div>
      </div>

      <div className="developer-content">
        <section className="developer-bio">
          <h2>About</h2>
          <p>{developer.bio}</p>
        </section>

        <section className="developer-hobbies">
          <h2>Hobbies</h2>
          <div className="hobby-tags">
            {developer.hobbies.map(hobby => (
              <span key={hobby} className="hobby-tag">{hobby}</span>
            ))}
          </div>
        </section>

        <section className="developer-links">
          <h2>Connect</h2>
          <div className="social-links">
            {developer.github && (
              <a href={developer.github} target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {developer.linkedin && (
              <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </section>

        <div className="back-link">
          <a href="/about">&larr; Back to About</a>
        </div>
      </div>
    </div>
  )
}
