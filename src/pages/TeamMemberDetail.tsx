import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Code, Palette, BookOpen, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMemberById } from '../data/teamMembers';
import './TeamMemberDetail.css';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.52 1.22 2.89 2.89 0 0 1 2.31-4.29V9.55a6.33 6.33 0 0 0-5.61 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.63a8.16 8.16 0 0 0 4.78 1.53V6.75a4.83 4.83 0 0 1-2.42-.06z"/>
  </svg>
);

export default function TeamMemberDetail() {
  const { id } = useParams<{ id: string }>();
  const member = getMemberById(Number(id));

  if (!member) {
    return (
      <div className="member-detail-page">
        <div className="member-not-found">
          <h2>Member not found</h2>
          <p>This team member doesn't exist.</p>
          <Link to="/team" className="back-link">
            <ArrowLeft size={18} /> Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="member-detail-page" data-member-name={member.name}>
      <Link to="/team" className="back-link">
        <ArrowLeft size={18} /> Back to Team
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="member-detail-card"
        style={member.cardColor ? { background: member.cardColor } : undefined}
      >
        <div className="member-detail-header" />

        <div className="member-detail-avatar-wrap">
          <img src={member.avatar} alt={member.name} className="member-detail-avatar" />
        </div>

        <div className="member-detail-body">
          <h1>{member.name}</h1>
          <span className="member-detail-role">{member.role}</span>

          <div className="member-detail-section">
            <h3><BookOpen size={18} className="section-icon" /> About</h3>
            <p className="member-detail-bio">{member.longBio}</p>
          </div>

          <div className="member-detail-section">
            <h3><Sparkles size={18} className="section-icon" /> Skills</h3>
            <div className="member-detail-tags">
              {member.skills.map((skill, idx) => (
                <span key={idx} className="member-detail-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="member-detail-section">
            <h3><Heart size={18} className="section-icon" /> Interests</h3>
            <div className="member-detail-tags">
              {member.interests.map((interest, idx) => (
                <span key={idx} className="member-detail-tag">{interest}</span>
              ))}
            </div>
          </div>

          <div className="member-detail-section">
            <h3><BookOpen size={18} className="section-icon" /> Education</h3>
            <ul className="member-detail-edu">
              {member.education.map((edu, idx) => (
                <li key={idx}>
                  <span className="edu-dot" />
                  {edu}
                </li>
              ))}
            </ul>
          </div>

          <div className="member-detail-social">
            <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <Code size={20} />
            </a>
            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <Palette size={20} />
            {member.social.tiktok && (
              <a href={member.social.tiktok} target="_blank" rel="noopener noreferrer" className="social-link" title="TikTok @symkaro">
                <TikTokIcon className="tiktok-icon" />
              </a>
            )}
            </a>
            <a href="mailto:team@dearfriend.app" className="social-link" title="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
