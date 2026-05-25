import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ServiceType, SiteSettings } from '../types';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    setSettings(data);
    setIsMenuOpen(false); 
  }, [location.pathname]);

  const serviceLinks = Object.values(ServiceType).map(type => ({
    label: type,
    slug: type.toLowerCase().replace(/\s+/g, '-')
  }));

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
          style={{ transform: `translate(${settings?.logoXShift || 0}px, ${settings?.logoYShift || 0}px)` }}
        >
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.brandName} className="h-8 md:h-10 w-auto object-contain" />
          ) : (
            <span className="font-orbitron text-2xl font-black tracking-tighter text-white">
              {settings?.brandName ? (
                <>
                  {settings.brandName.split(' ')[0]}
                  <span className="text-red-600 font-black">{settings.brandName.split(' ')[1] || ''}</span>
                </>
              ) : (
                <>DAT<span className="text-red-600 font-black">CLOUD</span></>
              )}
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-xs font-black uppercase tracking-widest text-white hover:text-red-500 transition-colors">Home</Link>
          
          <div className="relative group py-2">
            <button className="flex items-center text-xs font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-all">
              Services <ChevronDown className="ml-1 w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full -left-4 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl py-3 shadow-2xl overflow-hidden mt-1">
                {serviceLinks.map(link => (
                  <Link 
                    key={link.slug}
                    to={`/services/${link.slug}`} 
                    className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-red-500 border-l-2 border-transparent hover:border-red-600 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-zinc-900 mt-2 pt-2">
                  <Link to="/portfolio" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all">View All Work</Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/hire-us" className="px-6 py-2.5 bg-[#f22c2c] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all hover:bg-red-700 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20 hover:shadow-red-600/40">
            Hire Us
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors">Dashboard</Link>
          )}
          
          {!isAdmin && (
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Login</Link>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white active:scale-95 transition-transform">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-zinc-950 border-t border-zinc-900 flex flex-col p-10 space-y-8 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <Link to="/" className="text-xl font-black uppercase tracking-[0.2em]">Home</Link>
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Specialties</span>
            <div className="space-y-4 pl-4 border-l border-zinc-800">
              {serviceLinks.map(link => (
                <Link 
                  key={link.slug} 
                  to={`/services/${link.slug}`} 
                  className="block text-sm font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/portfolio" className="text-xl font-black uppercase tracking-[0.2em]">Our Work</Link>
          {isAdmin && (
            <Link to="/admin" className="text-xl font-black uppercase tracking-[0.2em] text-red-600">Admin</Link>
          )}
          <Link to="/login" className="text-xl font-black uppercase tracking-[0.2em]">Login</Link>
          <Link to="/hire-us" className="inline-block py-5 text-center bg-[#f22c2c] text-white font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-red-600/20 active:scale-95 transition-transform">Hire Us</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;