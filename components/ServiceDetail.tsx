import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ServiceType, Project, SiteSettings } from '../types';
import { SERVICES_DATA } from '../constants';
import { ArrowLeft, MoveRight, Search, PlayCircle, Image as ImageIcon } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const pData = JSON.parse(localStorage.getItem('projects') || '[]');
    const sData = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    setProjects(pData);
    setSettings(sData);
  }, []);

  // Helper to match URL param to ServiceType enum
  const serviceKey = Object.keys(ServiceType).find(
    key => ServiceType[key as keyof typeof ServiceType].toLowerCase().replace(/\s+/g, '-') === serviceType
  );

  if (!serviceKey) {
    return <Navigate to="/" replace />;
  }

  const currentServiceType = ServiceType[serviceKey as keyof typeof ServiceType];
  const serviceInfo = SERVICES_DATA.find(s => s.type === currentServiceType);
  const filteredProjects = projects.filter(p => p.category === currentServiceType && p.status !== 'Draft');

  // Load custom content
  const slug = serviceType || '';
  const custom = settings?.serviceCustoms?.[slug];
  const displayTitle = custom?.title || currentServiceType.toUpperCase();
  const displayDescription = custom?.description || (serviceInfo?.description + " We deliver premium visual solutions designed for maximum impact and brand recognition.");

  // Determine Aspect Ratio and Grid Layout based on Category
  const isVertical = currentServiceType === ServiceType.POSTER_DESIGN || currentServiceType === ServiceType.MERCHANDISE_DESIGN;
  const isLandscape = currentServiceType === ServiceType.THUMBNAIL_DESIGN || currentServiceType === ServiceType.VIDEO_EDITING;
  
  const aspectClass = isVertical ? 'aspect-[2/3]' : 'aspect-[16/9]';
  const gridColsClass = isVertical ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // Process split title for color styling
  const titleWords = displayTitle.split(' ');
  const firstWord = titleWords[0];
  const restOfTitle = titleWords.slice(1).join(' ');

  const featuredProject = filteredProjects[0];

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-red-500 transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Specialties
        </Link>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              {/* Fix: Added explicit prop type to React.ReactElement to resolve className assignment error */}
              {serviceInfo && React.cloneElement(serviceInfo.icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10 text-red-500" })}
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter font-orbitron leading-none text-white">
              {firstWord} <br />
              <span className="text-red-600">{restOfTitle}</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-md font-medium leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </p>
            <div className="pt-4">
               <Link to="/hire-us" className="inline-flex items-center px-10 py-5 bg-[#f22c2c] text-white text-xs font-black uppercase tracking-[0.2em] rounded-md hover:scale-105 transition-all shadow-lg shadow-red-900/20">
                  Start a Project <MoveRight className="ml-3 w-4 h-4" />
               </Link>
            </div>
          </div>

          <div className="relative group">
            <Link 
              to={featuredProject ? `/project/${featuredProject.id}` : '#'}
              className={`block overflow-hidden rounded-3xl border border-zinc-800 relative shadow-2xl transition-all duration-500 hover:border-red-600/50 ${isVertical ? 'aspect-[3/4] max-w-sm mx-auto' : 'aspect-video'}`}
            >
               <img 
                 src={featuredProject?.imageUrl || `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1280&h=720`} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 alt={featuredProject?.title || currentServiceType}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
               {isLandscape && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-20 h-20 text-white opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                 </div>
               )}
            </Link>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-red-900/20 rounded-full -z-10 animate-pulse"></div>
          </div>
        </div>

        {/* Showcase Gallery */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-12">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-2">Portfolio Showcase</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter font-orbitron text-white">
                {isVertical ? 'PORTRAIT EXCELLENCE' : 'LANDSCAPE MASTERY'}
              </h2>
            </div>
            <p className="text-zinc-600 text-sm max-w-sm font-medium">
              Browse our curated collection of {currentServiceType.toLowerCase()} work. Designed for performance, built for the elite.
            </p>
          </div>

          <div className={`grid gap-x-8 gap-y-14 ${gridColsClass}`}>
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`} className="group block cursor-pointer">
                {/* Content container with category-specific aspect ratio */}
                <div className={`relative ${aspectClass} overflow-hidden rounded-2xl bg-[#0a0a0a] border border-zinc-900 mb-6 group-hover:border-red-600/50 transition-all duration-500 shadow-xl group-hover:shadow-red-900/10`}>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-100 group-hover:text-red-500 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map(tag => (
                      <span key={tag} className="text-[9px] font-black text-zinc-600 tracking-[0.2em] uppercase bg-zinc-950 px-2.5 py-1 rounded-sm border border-zinc-900">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )) : (
              // Placeholder grid based on aspect ratio
              [1,2,3,4,5,6].map(i => (
                <div key={i} className="group">
                  <div className={`${aspectClass} bg-zinc-900/20 border border-dashed border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center grayscale opacity-30`}>
                    <ImageIcon className="w-8 h-8 text-zinc-800 mb-2" />
                    <span className="text-zinc-800 font-black text-[9px] uppercase tracking-widest text-center px-4">Case Study Awaiting Upload 0{i}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;