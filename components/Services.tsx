
import React, { useEffect, useState } from 'react';
import { SERVICES_DATA } from '../constants';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../types';

const Services: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    setSettings(data);
  }, []);

  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 font-orbitron">
            OUR SPECIALTIES
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {SERVICES_DATA.map((service, idx) => {
            const slug = service.type.toLowerCase().replace(/\s+/g, '-');
            const custom = settings?.serviceCustoms?.[slug];
            const displayTitle = custom?.title || service.type.toUpperCase();
            const displayDescription = custom?.description || service.description;

            return (
              <div 
                key={idx}
                className="group relative bg-[#0a0a0a] border border-[#1a1a1a] p-10 rounded-2xl hover:border-red-600/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(242,44,44,0.05)] transition-all duration-500 flex flex-col h-full"
              >
                {/* Icon Box */}
                <div className="mb-8 bg-zinc-900/80 w-14 h-14 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-all">
                  {/* Fix: Added explicit prop type to React.ReactElement to resolve className assignment error */}
                  {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6 text-red-500" })}
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white leading-tight group-hover:text-red-500 transition-colors">
                  {displayTitle}
                </h3>
                
                <p className="text-zinc-500 text-[13px] Birding-relaxed mb-10 font-medium whitespace-pre-wrap">
                  {displayDescription}
                </p>

                <div className="mt-auto">
                  <Link 
                    to={`/services/${slug}`}
                    className="flex items-center text-[11px] font-black uppercase tracking-[0.15em] text-red-600 hover:text-red-500 transition-colors group/link"
                  >
                    DISCOVER MORE 
                    <span className="ml-2 group-hover/link:translate-x-1 transition-transform">
                      <MoveRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;