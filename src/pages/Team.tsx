import { Heart, Mail, Code, Palette, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import myPhoto from './20240923_071243.jpg';
import './Team.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Symphany',
    role: 'Aspiring Cloud Security Engineer',
    bio: "Hi! My name is Symphany. I'm currently a senior in high school and aspire to become a Cloud Security Engineer. I've taken multiple Cybersecurity classes and plan to take more in the fall at Atlanta Technical College. I'm participating in many programs to grow my knowledge for the future. So far, I've been working on many projects with The Knowledge House (TKH), such as building my own web page using CSS and HTML. I enjoy playing electric guitar, flute, and sports.",
    avatar: 'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['Cybersecurity', 'Cloud Security', 'HTML & CSS', 'The Knowledge House (TKH)'],
    icon: Code,
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 2,
    name: 'Nadya Ibim',
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
    name: 'Cayly Knibbs',
    role: 'Aspiring Aerospace Engineer',
    bio: "Hello! My Name is Cayly Knibbs! I am a 16 year old junior in high school and my goal is to become an Aerospace engineer! My hobbies are playing into a few orchestras as a violinist, fashion, Kickboxing, Photography and Coding/Robotics. As of now, I have been working outside of school to create/design a device that can monitor the electromagnetic waves from plants in order to diagnose what they may need. It's nice to meet you!",
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: ['Aerospace Engineering', 'Violin & Orchestra', 'Kickboxing', 'Robotics & Coding'],
    icon: Rocket,
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
