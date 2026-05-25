
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import Portfolio from './components/Portfolio';
import HireUs from './components/HireUs';
import Footer from './components/Footer';
import ServiceDetail from './components/ServiceDetail';
import ProjectDetail from './components/ProjectDetail';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import { SiteSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black">
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </div>
  );
};

// Extremely robust JSON extractor to prevent parsing errors from server noise
const parseClean = (txt: string) => {
  if (!txt) return null;
  const trimmed = txt.trim();
  
  // Quick check for simple primitives
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;

  // If it doesn't contain JSON-like structures, avoid parsing (prevents errors from 404 text)
  if (!trimmed.includes('{') && !trimmed.includes('[')) return null;

  // Try to find the actual JSON block using anchors
  const startObj = txt.indexOf('{');
  const startArr = txt.indexOf('[');
  let start = -1;
  if (startObj !== -1 && (startArr === -1 || startObj < startArr)) start = startObj;
  else if (startArr !== -1) start = startArr;

  const endObj = txt.lastIndexOf('}');
  const endArr = txt.lastIndexOf(']');
  let end = -1;
  if (endObj !== -1 && (endArr === -1 || endObj > endArr)) end = endObj;
  else if (endArr !== -1) end = endArr;

  if (start !== -1 && end !== -1 && end > start) {
    const candidate = txt.substring(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // Silent fail for noise extraction
    }
  }

  // Final fallback attempt
  try {
    // Only attempt if it looks like JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed);
    }
  } catch (e) {
    // Silent fail to avoid polluting console with server 404 noise
  }
  return null;
};

const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('api.php?action=get_settings');
        if (!res.ok) throw new Error("Server response not OK");
        const text = await res.text();
        const data = parseClean(text);
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setSettings(data);
          localStorage.setItem('siteSettings', JSON.stringify(data));
        }
      } catch (e) {
        const local = localStorage.getItem('siteSettings');
        if (local) {
          try {
            setSettings(JSON.parse(local));
          } catch(err) {
             setSettings(DEFAULT_SETTINGS);
          }
        }
      }
    };
    loadSettings();
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <div className="bg-black py-32 text-center">
         <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.5em] text-zinc-900 select-none mb-20 font-orbitron">INDUSTRY STANDARD TOOLS</h2>
         <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center max-w-6xl mx-auto px-6">
            {(settings.tools || DEFAULT_SETTINGS.tools).map((tool, i) => (
              <div key={i} className="flex flex-col items-center gap-5 group transition-all duration-500">
                <div className="w-20 h-20 bg-[#080808] border border-zinc-900 rounded-[32px] flex items-center justify-center group-hover:border-red-600/40 group-hover:shadow-[0_0_30px_rgba(242,44,44,0.1)] transition-all p-5">
                  {tool.iconUrl ? <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-contain" /> : <span className="text-2xl font-black text-zinc-800 italic">{tool.name.substring(0, 2).toUpperCase()}</span>}
                </div>
                <span className="text-[10px] font-black uppercase text-zinc-800 group-hover:text-zinc-500">{tool.name}</span>
              </div>
            ))}
         </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncData = async () => {
      try {
        const [setRes, projRes] = await Promise.all([
          fetch('api.php?action=get_settings'),
          fetch('api.php?action=get_projects')
        ]);
        
        let settings = null;
        let projects = null;

        if (setRes.ok) {
          const setText = await setRes.text();
          settings = parseClean(setText);
        }
        
        if (projRes.ok) {
          const projText = await projRes.text();
          projects = parseClean(projText);
        }

        if (settings && typeof settings === 'object' && Object.keys(settings).length > 0) {
          localStorage.setItem('siteSettings', JSON.stringify(settings));
        } else if (!localStorage.getItem('siteSettings')) {
          localStorage.setItem('siteSettings', JSON.stringify(DEFAULT_SETTINGS));
        }
        
        if (projects) localStorage.setItem('projects', JSON.stringify(projects));
      } catch (e) { 
        console.warn("Sync failed or server unavailable, using cache."); 
      } finally {
        setLoading(false);
      }
    };
    syncData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
        <div className="font-orbitron text-5xl font-black tracking-tighter text-white">DAT<span className="text-red-600">CLOUD</span></div>
        <div className="mt-8 w-48 h-[2px] bg-zinc-900 overflow-hidden rounded-full">
          <div className="h-full bg-red-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/hire-us" element={<HireUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/services/:serviceType" element={<ServiceDetail />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
