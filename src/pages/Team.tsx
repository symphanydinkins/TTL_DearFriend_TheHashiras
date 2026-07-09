import { Heart, Mail, Code, Palette, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import myPhoto from './20240923_071243.jpg';
import myPhoto from './IMG_2950.jpg';
import './Team.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Lead Developer',
    bio: 'Full-stack engineer passionate about creating seamless user experiences. Love building products that bring people together.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    icon: Code,
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 2,
    name: 'Jordan Chen',
    role: 'Developer & Designer',
    bio: 'KKCF Alumni and America on Tech Alumni passionate about using tech to create meaningful connections. Headed to Georgia Southern University in the fall to study Civil Engineering and Sustainability Science.',
    avatar: myPhoto,
    skills: ['KKCF Alumni', 'America on Tech Alumni', 'Civil Engineering', 'Sustainability Science'],
    icon: Palette,
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 3,
    name: 'Sam Rodriguez',
    role: 'Backend Engineer',
    bio: 'Infrastructure specialist ensuring our app runs smoothly. Obsessed with performance and reliability.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['Python', 'AWS', 'Docker', 'APIs'],
    icon: Server,
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  }
];

export default function Team() {
  return (
    <div className="team-page">
      <div className="team-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="team-hero"
        >
          <Heart className="team-logo" size={48} />
          <h1>Meet Our Team</h1>
          <p>The people behind Dear Friend</p>
        </motion.div>
      </div>

      <div className="team-intro">
        <p>
          We're a passionate team of developers and designers building meaningful connections.
          Our mission is to help people find genuine friendships based on shared interests.
        </p>
      </div>

      <div className="team-grid">
        {TEAM_MEMBERS.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="team-card"
          >
            <div className="team-card-header" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
              <member.icon className="role-icon" size={24} />
            </div>
            <div className="team-avatar-container">
              <img src={member.avatar} alt={member.name} className="team-avatar" />
            </div>
            <div className="team-info">
              <h2>{member.name}</h2>
              <span className="team-role">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
              <div className="team-skills">
                {member.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
              <div className="team-social">
                <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Code size={18} />
                </a>
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Palette size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="team-contact">
        <h2>Get in Touch</h2>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <a href="mailto:team@dearfriend.app" className="contact-btn">
          <Mail size={20} /> Contact Us
        </a>
      </div>
    </div>
  );
}
