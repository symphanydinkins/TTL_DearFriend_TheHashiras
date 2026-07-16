import { Code, Palette, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import myPhoto from '../pages/20240923_071243.jpg';
import photo from 'src/data/teamMembers.ts';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  longBio: string;
  avatar: string;
  skills: string[];
  interests: string[];
  education: string[];
  icon: LucideIcon;
  cardColor?: string;
  social: {
    github: string;
    tiktok?: string;
    linkedin: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Symphany',
    role: 'Aspiring Cloud Security Engineer',
    bio: "Hi! My name is Symphany. I'm an upcoming senior in high school and aspire to become a Cloud Security Engineer. I'm participating in many programs to grow my knowledge for the future.",
    longBio: "Hi! My name is Symphany. I'm an upcoming senior in high school and aspire to become a Cloud Security Engineer. I'm participating in many programs to grow my knowledge for the future. So far, I've been working on many projects with The Knowledge House (TKH), such as building my own web page using CSS and HTML. I enjoy playing electric guitar, flute, and playing sports.",
    avatar: '/IMG_2950 copy.jpg',
    skills: ['Cybersecurity', 'Cloud Security', 'HTML & CSS', 'The Knowledge House (TKH)'],
    interests: ['Electric Guitar', 'Flute', 'Sports'],
    education: ['Upcoming Senior in High School', 'Atlanta Technical College (Fall 2026)'],
    icon: Code,
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      tiktok: 'https://www.tiktok.com/@symkaro'
    }
  },
  {
    id: 2,
    name: 'Nadya Ibim',
    role: 'Developer & Designer',
    bio: 'KKCF Alumni and America on Tech Alumni passionate about using tech to create meaningful connections. Headed to Georgia Southern University in the fall to study Civil Engineering and Sustainability Science.',
    longBio: 'Nadya Ibim is a KKCF Alumni and America on Tech Alumni passionate about using technology to create meaningful connections. She is headed to Georgia Southern University in the fall to study Civil Engineering and Sustainability Science. With a strong foundation in both design and development, Nadya brings a unique perspective to every project she works on.',
    avatar: myPhoto,
    skills: ['KKCF Alumni', 'America on Tech Alumni', 'Civil Engineering', 'Sustainability Science'],
    interests: ['Design', 'Development', 'Sustainability'],
    education: ['KKCF Alumni', 'America on Tech Alumni', 'Georgia Southern University (Fall 2026)'],
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
    bio: "Hello! My Name is Cayly Knibbs! I am a 16 year old junior in high school and my goal is to become an Aerospace engineer! My hobbies include playing in orchestras as a violinist, fashion, kickboxing, photography, and coding/robotics.",
    longBio: "Hello! My Name is Cayly Knibbs! I am a 16 year old junior in high school and my goal is to become an Aerospace engineer! My hobbies are playing into a few orchestras as a violinist, fashion, Kickboxing, Photography and Coding/Robotics. As of now, I have been working outside of school to create/design a device that can monitor the electromagnetic waves from plants in order to diagnose what they may need. It's nice to meet you!",
    avatar: '/files_10910052-2026-07-14T16-34-05-611Z-Screenshot_2026-07-14_123341 copy copy.png',
    skills: ['Aerospace Engineering', 'Violin & Orchestra', 'Kickboxing', 'Robotics & Coding'],
    interests: ['Violin & Orchestra', 'Fashion', 'Kickboxing', 'Photography', 'Robotics'],
    education: ['Junior in High School', 'Self-taught Robotics & Coding'],
    icon: Rocket,
    cardColor: '#f0e6ff',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  }
];

export function getMemberById(id: number): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}
