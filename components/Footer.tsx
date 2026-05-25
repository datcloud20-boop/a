
import React, { useEffect, useState } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    setSettings(data);
  }, [location.pathname]);

  if (!settings) return null;

  const brandFirst = settings.brandName?.split(' ')[0] || 'DAT';
  const brandSecond = settings.brandName?.split(' ')[1] || 'CLOUD';

  // Helper to fix links that might have a # prefix or missing protocol
  const formatUrl = (url: string) => {
    if (!url || url === '#' || url.trim() === '') return undefined;
    let target = url.trim();
    if (target.startsWith('#')) {
      target = target.substring(1);
    }
    if (target.trim() === '') return undefined;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    return target;
  };

  const instagramUrl = formatUrl(settings.contact?.instagram);
  const linkedinUrl = formatUrl(settings.contact?.linkedin);

  return (
    <footer className="bg-black border-t border-zinc-900 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8 col-span-1 md:col-span-1">
             <Link to="/" className="font-orbitron text-3xl font-black tracking-tighter text-white">
              {brandFirst}<span className="text-red-600">{brandSecond}</span>
            </Link>
            <p className="text-zinc-500 text-sm font-medium max-w-xs leading-relaxed">
              {settings.footerDescription || 'A high-end portfolio and service-based commerce platform for creative professionals.'}
            </p>
            <div className="flex space-x-4">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-zinc-900 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-zinc-500 hover:text-white shadow-xl active:scale-95">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-zinc-900 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-zinc-500 hover:text-white shadow-xl active:scale-95">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/services/video-editing" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Video Editing</Link></li>
              <li><Link to="/services/thumbnail-design" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Thumbnail Design</Link></li>
              <li><Link to="/services/web-development" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Web Development</Link></li>
              <li><Link to="/services/merchandise-design" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Merchandise Design</Link></li>
              <li><Link to="/services/poster-design" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Poster Design</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Home</Link></li>
              <li><Link to="/hire-us" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Hire Us</Link></li>
              <li><Link to="/login" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Login</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Let's Connect</h4>
            <p className="text-zinc-400 text-sm">Have a vision? Let's talk.</p>
            <div className="space-y-4">
              <a href={`mailto:${settings.contact?.email}`} className="block text-xl font-black tracking-tight text-white hover:text-red-500 transition-colors lowercase">
                {settings.contact?.email?.toLowerCase() || 'datcloud20@gmail.com'}
              </a>
              <div className="flex space-x-4">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-600 transition-colors p-1">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors p-1">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            <div className="pt-2">
               <Link to="/hire-us" className="inline-block px-8 py-3 bg-[#f22c2c] text-white text-[11px] font-black uppercase tracking-[0.1em] rounded-md hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95">
                 READY TO LAUNCH?
               </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          <div>© {new Date().getFullYear()} {settings.brandName?.toUpperCase()}. ALL RIGHTS RESERVED.</div>
          <div className="mt-4 md:mt-0 space-x-8">
            <a href="#" className="hover:text-zinc-400">PRIVACY POLICY</a>
            <a href="#" className="hover:text-zinc-400">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
