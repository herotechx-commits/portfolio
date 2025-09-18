import { ReactNode, HTMLAttributes  } from "react";

export interface CardContextType {
  onCardClose: () => void;
  currentIndex: number | null;
}

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface SkillData {
  name: string;
  level: number;
  color: string;
}

export interface ProjectData {
  projectTitle: string;
  projectImage: string;
  projectLink: string;
  projectAuthor: string;
  projectGithub: string;
  projectDescription: string;
}

export interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

export interface BentoGridItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  className?: string;
  title: string;
  description: ReactNode;
  header: ReactNode;
  content: ReactNode;
  icon: ReactNode;
  index: number;
}

export interface BentoItem {
  title: string;
  description: ReactNode;
  header: ReactNode;
  className: string;
  icon: ReactNode;
  content: ReactNode;
}


// File: types/auth.ts
export interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}


export interface Project {
  id: string
  projectName: string | null
  projectImage: string | null
  projectLink: string | null
  projectGithub: string | null
  projectDescription: string | null
  authorId: string
  projectAuthor?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateProjectData {
  projectName: string
  projectImage?: string
  projectLink?: string
  projectGithub?: string
  projectDescription?: string
}

// types/aboutUser.ts
export interface Skill {
  id: string
  name: string
}

export interface SkillCategory {
  id: string
  title: string
  skills: Skill[]
}

export interface AboutUser {
  id: string
  name: string | null
  title: string | null
  resume: string | null
  bio: string | null
  quote: string | null
  userImg: string | null
  resumeSummary: string
  skillCategories: SkillCategory[]
  createdAt: string
  updatedAt: string
}

export interface CreateAboutUserData {
  name?: string
  title?: string
  resume?: string
  bio?: string
  quote?: string
  userImg?: string
  resumeSummary?: string
  skillCategories?: SkillCategory[]
}


export interface BentoItem {
  title: string;
  description: ReactNode;
  header: ReactNode;
  className: string;
  icon: ReactNode;
  content: ReactNode;
}

// Database types
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  link?: string;
  author?: string;
  featured: boolean;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

export interface ExperienceData {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  technologies: string[];
  order: number;
}

export interface QuoteData {
  id: string;
  text: string;
  author?: string;
  context: string;
  active: boolean;
  order: number;
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  resume?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// Combined data type for the bento grid
export interface BentoGridData {
  projects: ProjectData[];
  skills: SkillData[];
  experiences: ExperienceData[];
  quotes: QuoteData[];
  profile: ProfileData | null;
}

// Offline state type
export interface OfflineState {
  isOffline: boolean;
  lastSync: Date | null;
  cachedData: BentoGridData | null;
}
