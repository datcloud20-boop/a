
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ServiceType, Project } from '../types';
import { ArrowLeft, Calendar, User, Tag, MoveRight, ExternalLink, HardDrive } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('projects') || '[]');
    const found = data.find((p: Project) => p.id === projectId);
    setProject(found || null);
    setLoading(false);
  }, [projectId]);

  if (loading) return null;

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  // Logic to determine if we should favor vertical or horizontal display based on category
  const isVertical = project.category === ServiceType.POSTER_DESIGN || project.category === ServiceType.MERCHANDISE_DESIGN;

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link 
          to="/portfolio" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-red-500 transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Portfolio
        </Link>

        {/* Project Visuals - Moved above the text content */}
        <div className="mb-24 flex justify-center">
          <div className={`w-full max-w-5xl bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl ${isVertical ? 'max-w-2xl' : ''}`}>
            <img 
              src={project.imageUrl} 
              className="w-full h-auto block" 
              alt={project.title}
            />
          </div>
        </div>

        {/* Project Header - Moved below the image as requested */}
        <div className="grid lg:grid-cols-3 gap-16 mb-24">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">{project.category}</div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-orbitron leading-none text-white">
                {project.title}
              </h1>
            </div>
            
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-medium">
              {project.description || "A masterclass in digital execution. This project highlights our commitment to pushing boundaries and delivering unparalleled results for our clients."}
            </p>

            <div className="flex flex-wrap gap-3">
              {project.tags?.map(tag => (
                <span key={tag} className="text-[9px] font-black text-zinc-500 tracking-[0.2em] uppercase bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl h-fit space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-4">
                <span className="text-zinc-500 font-black uppercase tracking-widest flex items-center">
                  <User className="w-3.5 h-3.5 mr-2" /> Client
                </span>
                <span className="text-white font-bold">{project.client || 'Confidential'}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-4">
                <span className="text-zinc-500 font-black uppercase tracking-widest flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> Year
                </span>
                <span className="text-white font-bold">{project.year || '2024'}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-4">
                <span className="text-zinc-500 font-black uppercase tracking-widest flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-2" /> Category
                </span>
                <span className="text-white font-bold">{project.category}</span>
              </div>
            </div>

            <div className="space-y-3">
              {project.websiteLink && (
                <a 
                  href={project.websiteLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Visit Website <ExternalLink className="ml-3 w-4 h-4" />
                </a>
              )}
              {project.driveLink && (
                <a 
                  href={project.driveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-4 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Google Drive <HardDrive className="ml-3 w-4 h-4" />
                </a>
              )}
              <Link 
                to="/hire-us" 
                className="flex items-center justify-center w-full py-5 bg-[#f22c2c] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/10"
              >
                Start Similar Project <MoveRight className="ml-3 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
