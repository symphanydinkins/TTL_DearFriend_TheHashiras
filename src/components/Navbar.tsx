import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, User, Users, Info } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Heart className="brand-icon" />
        <span className="brand-text">Dear Friend</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/discover" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Users size={20} />
          <span>Discover</span>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MessageCircle size={20} />
          <span>Messages</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/feed" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Heart size={20} />
          <span>Feed</span>
        </NavLink>
      </div>
      <div className="navbar-footer">
        <NavLink to="/team" className={({ isActive }) => isActive ? 'nav-link footer-link active' : 'nav-link footer-link'}>
          <Info size={16} />
          <span>Our Team</span>
        </NavLink>
      </div>
    </nav>
  );
}
