import React from 'react';
import { Video, Layout, Code, Shirt, Image as ImageIcon } from 'lucide-react';
import { ServiceType, Project, SiteSettings } from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'DAT CLOUD',
  logoXShift: 0,
  logoYShift: 0,
  logoUrl: '',
  footerDescription: 'A high-end portfolio and service-based e-commerce platform for creative professionals.',
  heroTitle: 'EXPERIENCES.',
  heroSubtitle: 'We turn bold ideas into high-converting solutions.',
  textColor: '#FFFFFF',
  heroTextXShift: 0,
  heroTextYShift: 0,
  headingScale: 4.8,
  heroVideoUrl: '',
  heroBgImageUrl: '',
  videoOpacity: 100,
  heroImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
  imageSize: 100,
  imageXShift: 0,
  imageYShift: 0,
  stats: {
    projectsCompleted: 114,
    happyClients: 45,
    yearsExperience: 8,
  },
  contact: {
    email: 'datcloud20@gmail.com',
    phone: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
  },
  tools: [
    { name: 'Adobe Premiere', iconUrl: '' },
    { name: 'After Effects', iconUrl: '' },
    { name: 'Photoshop', iconUrl: '' },
    { name: 'Figma', iconUrl: '' },
    { name: 'React', iconUrl: '' },
  ],
  serviceCustoms: {}
};

export const SERVICES_DATA = [
  {
    type: ServiceType.VIDEO_EDITING,
    icon: <Video className="w-8 h-8 text-red-500" />,
    description: "High-quality cinematic edits, reels, and documentary-style storytelling.",
  },
  {
    type: ServiceType.THUMBNAIL_DESIGN,
    icon: <ImageIcon className="w-8 h-8 text-red-500" />,
    description: "Conversion-focused thumbnails that drive CTR and engagement.",
  },
  {
    type: ServiceType.WEB_DEVELOPMENT,
    icon: <Code className="w-8 h-8 text-red-500" />,
    description: "Modern, responsive web applications built with the latest tech stack.",
  },
  {
    type: ServiceType.MERCHANDISE_DESIGN,
    icon: <Shirt className="w-8 h-8 text-red-500" />,
    description: "Exclusive studio merchandise, hoodies, and digital assets.",
  },
  {
    type: ServiceType.POSTER_DESIGN,
    icon: <Layout className="w-8 h-8 text-red-500" />,
    description: "Impactful visual designs for events, marketing, and digital branding.",
  }
];

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'v1',
    title: 'GAMING EXCELLENCE MONTAGE',
    category: ServiceType.VIDEO_EDITING,
    status: 'Published',
    tags: ['YOUTUBE', 'GAMING', 'REEL'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1280&h=720',
    description: 'A high-octane gaming montage featuring cinematic transitions, precise beat-syncing, and advanced color grading for a top-tier esports organization.',
    client: 'Apex Esport Elite',
    year: '2024'
  },
  {
    id: 't1',
    title: 'LinkedIn Growth Secrets',
    category: ServiceType.THUMBNAIL_DESIGN,
    status: 'Published',
    tags: ['BUSINESS', 'YOUTUBE', 'CTR'],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1280&h=720',
    description: 'Custom designed thumbnail engineered for maximum Click-Through Rate (CTR). Focus on high contrast, clear typography, and emotional resonance.',
    client: 'John Doe Growth',
    year: '2024'
  },
  {
    id: 't2',
    title: 'Historical Documentaries: World War I',
    category: ServiceType.THUMBNAIL_DESIGN,
    status: 'Published',
    tags: ['HISTORY', 'YOUTUBE', 'EDUCATION'],
    imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1280&h=720',
    description: 'Atmospheric and educational thumbnail design for a long-form history documentary series. Leverages period-accurate color palettes and dramatic framing.',
    client: 'History Unfolded',
    year: '2023'
  },
  {
    id: 't3',
    title: '2025: Best AI Tools Masterclass',
    category: ServiceType.THUMBNAIL_DESIGN,
    status: 'Published',
    tags: ['TECH', 'AI', 'TRENDING'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1280&h=720',
    description: 'Futuristic and vibrant design for a tech masterclass. Uses glowing elements and abstract 3D shapes to convey the cutting-edge nature of the content.',
    client: 'TechTrend AI',
    year: '2024'
  },
  {
    id: 'p1',
    title: 'Porsche 911 GT3 RS Edition',
    category: ServiceType.POSTER_DESIGN,
    status: 'Published',
    tags: ['AUTOMOTIVE', 'PRINT', 'MINIMAL'],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'Minimalist automotive poster showcasing the silhouette and performance specs of the iconic Porsche 911 GT3 RS. Designed for high-end print production.',
    client: 'GT Enthusiasts',
    year: '2024'
  },
  {
    id: 'p2',
    title: 'Sprite Refreshment Campaign',
    category: ServiceType.POSTER_DESIGN,
    status: 'Published',
    tags: ['BEVERAGE', 'VIBRANT', 'ADVERTISING'],
    imageUrl: 'https://images.unsplash.com/photo-1622543953490-0b70433856d6?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'A vibrant advertisement poster designed to convey a sense of coolness and energy. Focus on liquid dynamics and pop-art inspired color balance.',
    client: 'Beverage Direct',
    year: '2024'
  },
  {
    id: 'p3',
    title: 'Modern Architecture Series',
    category: ServiceType.POSTER_DESIGN,
    status: 'Published',
    tags: ['DESIGN', 'ABSTRACT'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'Abstract architectural poster emphasizing geometric purity and monochrome contrast. Part of an exhibition set for modern urban planning.',
    client: 'Urban Form Studio',
    year: '2023'
  },
  {
    id: 'p4',
    title: 'Retro Futurist Journey',
    category: ServiceType.POSTER_DESIGN,
    status: 'Published',
    tags: ['CYBERPUNK', 'POSTER'],
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'Synthwave and Cyberpunk inspired poster design. Rich with neon glows, grid patterns, and 80s aesthetics fused with futuristic themes.',
    client: 'Neon Dreams',
    year: '2024'
  },
  {
    id: 'm1',
    title: 'Studio Signature Hoodie',
    category: ServiceType.MERCHANDISE_DESIGN,
    status: 'Published',
    tags: ['STREETWEAR', 'APPAREL'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'High-end merchandise design focusing on quality materials and minimal typography. Engineered for the modern creative professional wardrobe.',
    client: 'DATCLOUD Exclusive',
    year: '2024'
  },
  {
    id: 'm2',
    title: 'Limited Edition Canvas Tote',
    category: ServiceType.MERCHANDISE_DESIGN,
    status: 'Published',
    tags: ['ACCESSORY', 'ECO'],
    imageUrl: 'https://images.unsplash.com/photo-1544816153-155018a3626e?auto=format&fit=crop&q=80&w=800&h=1200',
    description: 'Durable, stylish, and eco-friendly canvas tote design. Screen-printed with custom abstract artwork inspired by digital cloud formations.',
    client: 'EcoCreators',
    year: '2024'
  },
  {
    id: 'w1',
    title: 'DATCLOUD CORPORATE BRANDING',
    category: ServiceType.WEB_DEVELOPMENT,
    status: 'Published',
    tags: ['REACT', 'NEXTJS'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1280&h=720',
    description: 'Full-stack web application development for a creative powerhouse. Features custom animations, lightning-fast performance, and a sleek dark mode UI.',
    client: 'DATCLOUD HQ',
    year: '2024'
  }
];