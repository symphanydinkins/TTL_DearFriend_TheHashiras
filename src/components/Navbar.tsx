import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="logo">
          Dear Friend
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/discover" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Discover</span>
        </NavLink>

        <NavLink to="/matches" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Matches</span>
        </NavLink>

        <NavLink to="/messages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Messages</span>
        </NavLink>

        <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Posts</span>
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>About</span>
        </NavLink>
      </div>

      <div className="navbar-actions">
        {user && (
          <NavLink to="/profile" className="nav-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </NavLink>
        )}
        {!user && (
          <NavLink to="/auth" className="btn-auth">Sign In</NavLink>
        )}
      </div>
    </nav>
  )
}
