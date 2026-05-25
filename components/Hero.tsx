
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../types';

const Hero: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    setSettings(data);
  }, []);

  if (!settings) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        {settings.heroVideoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              opacity: (settings.videoOpacity || 100) / 100 
            }}
            key={settings.heroVideoUrl}
          >
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        ) : settings.heroBgImageUrl ? (
          <img 
            src={settings.heroBgImageUrl} 
            className="w-full h-full object-cover" 
            alt="Hero Background"
          />
        ) : null}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center pt-24">
        <div 
          className="space-y-8"
          style={{ 
            transform: `translate(${settings.heroTextXShift || 0}px, ${settings.heroTextYShift || 0}px)`,
            color: settings.textColor || '#FFFFFF'
          }}
        >
          <div className="inline-block border border-red-500/50 bg-red-500/10 px-4 py-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Creative Studio & Production</span>
          </div>
          
          <h1 
            className="font-black uppercase tracking-tighter leading-[0.95] font-orbitron"
            style={{ fontSize: `${settings.headingScale || 4.8}rem` }}
          >
            {settings.heroTitle}
          </h1>

          <p className="text-zinc-400 text-lg max-w-md font-medium">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/portfolio" className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-100 hover:scale-105 transition-all shadow-lg active:scale-95">Portfolio</Link>
            <Link to="/hire-us" className="px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 active:scale-95">Hire Us</Link>
          </div>
        </div>

        <div 
          className="hidden md:block relative animate-float"
          style={{ 
            transform: `translate(${settings.imageXShift || 0}px, ${settings.imageYShift || 0}px) scale(${(settings.imageSize || 100) / 100})`
          }}
        >
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-zinc-800 group">
             <img 
               src={settings.heroImageUrl} 
               className="w-full h-auto block object-contain group-hover:scale-[1.02] transition-transform duration-700"
               alt="Studio Work"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
