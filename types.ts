export enum ServiceType {
  VIDEO_EDITING = 'Video Editing',
  THUMBNAIL_DESIGN = 'Thumbnail Design',
  WEB_DEVELOPMENT = 'Web Development',
  MERCHANDISE_DESIGN = 'Merchandise Design',
  POSTER_DESIGN = 'Poster Design',
}

export interface Project {
  id: string;
  title: string;
  category: ServiceType;
  status: 'Published' | 'Draft' | 'Featured';
  tags: string[];
  imageUrl: string;
  mainMediaUrl?: string;
  description: string;
  websiteLink?: string;
  driveLink?: string;
  client?: string;
  year?: string;
}

export interface Tool {
  name: string;
  iconUrl: string;
}

export interface ServiceCustom {
  title: string;
  description: string;
}

export interface SiteSettings {
  brandName: string;
  logoXShift: number;
  logoYShift: number;
  logoUrl: string;
  footerDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  textColor: string;
  heroTextXShift: number;
  heroTextYShift: number;
  headingScale: number;
  heroVideoUrl: string;
  heroBgImageUrl: string;
  videoOpacity: number;
  heroImageUrl: string;
  imageSize: number;
  imageXShift: number;
  imageYShift: number;
  stats: {
    projectsCompleted: number;
    happyClients: number;
    yearsExperience: number;
  };
  contact: {
    email: string;
    phone: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  tools: Tool[];
  serviceCustoms?: Record<string, ServiceCustom>;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  brief: string;
  timestamp: string;
  read: boolean;
}