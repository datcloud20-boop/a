import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ServiceType, Project } from '../types';
import { Search } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | 'ALL'>('ALL');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('api.php?action=get_projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data.filter((p: Project) => p.status !== 'Draft'));
          localStorage.setItem('projects', JSON.stringify(data));
        }
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('projects') || '[]');
        setProjects(local.filter((p: Project) => p.status !== 'Draft'));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['ALL', ...Object.values(ServiceType)];
  
  const filtered = activeTab === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <section className="bg-black min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2">Portfolio Gallery</div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-orbitron mb-12 text-white">
            {activeTab === 'ALL' ? 'Featured Work' : activeTab}
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-8 border-b border-zinc-900 pb-8 mb-12">
            <div className="flex flex-wrap gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === cat 
                      ? 'bg-red-600 text-white' 
                      : 'bg-[#111] text-zinc-500 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-700 font-orbitron animate-pulse">SYNCING DATA...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.length > 0 ? filtered.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`} className="group block overflow-hidden">
                <div className={`relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-zinc-900 mb-6 group-hover:border-red-900/50 transition-all duration-500 ${
                  project.category === ServiceType.POSTER_DESIGN || project.category === ServiceType.MERCHANDISE_DESIGN ? 'aspect-[2/3]' : 'aspect-[16/9]'
                }`}>
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                     <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <Search className="w-5 h-5 text-white" />
                     </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors leading-tight">{project.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {project.tags.map(tag => <span key={tag} className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">#{tag}</span>)}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Awaiting entries for this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;