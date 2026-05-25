import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Settings, LogOut, 
  ShieldCheck, FileText, Trash2, Plus, 
  Upload, HardDrive, Mail, Globe, User, Wrench, Image as ImageIcon,
  Edit3, Sliders
} from 'lucide-react';
import { ServiceType, Project, SiteSettings, Message, Tool } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

enum AdminTab {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  MESSAGES = 'MESSAGES',
  SETTINGS = 'SETTINGS'
}

const parseSafe = (txt: string) => {
  if (!txt) return null;
  const start = Math.max(txt.indexOf('{'), txt.indexOf('['));
  const end = Math.max(txt.lastIndexOf('}'), txt.lastIndexOf(']'));
  if (start !== -1 && end !== -1 && end > start) {
    try { 
      const jsonText = txt.substring(start, end + 1);
      return JSON.parse(jsonText); 
    } catch (e) { }
  }
  try { 
    const trimmed = txt.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed); 
    }
  } catch (e) { }
  return null;
};

const FieldInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  onFileUpload,
  uploadLabel = 'UPLOAD',
  className = ""
}: { 
  label: string, 
  value: any, 
  onChange: (val: any) => void, 
  type?: string, 
  placeholder?: string, 
  onFileUpload?: (file: File) => void,
  uploadLabel?: string,
  className?: string
}) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</label>
      {onFileUpload && (
        <label className="cursor-pointer text-[9px] font-black uppercase text-red-500 hover:text-white transition-colors flex items-center gap-1">
          <Upload className="w-3 h-3" /> {uploadLabel}
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])} />
        </label>
      )}
    </div>
    <div className="relative flex items-center">
      <input 
        type={type} 
        value={value ?? ''} 
        placeholder={placeholder}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full bg-[#080808] border border-zinc-900 rounded-xl px-5 py-4 text-sm font-black focus:border-zinc-700 outline-none text-white transition-all placeholder:text-zinc-800"
      />
      {onFileUpload && (
        <label className="absolute right-3 bg-[#1e2329] border border-zinc-800 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors">
          {uploadLabel}
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])} />
        </label>
      )}
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<Message[]>([]);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', category: ServiceType.VIDEO_EDITING, status: 'Published',
    tags: [], description: '', imageUrl: '', mainMediaUrl: '', websiteLink: '', driveLink: '',
    client: '', year: '2024'
  });

  const safeFetch = async (url: string, options: any = {}) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      const text = await res.text();
      return parseSafe(text);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, setRes, msgRes] = await Promise.all([
        safeFetch('api.php?action=get_projects'),
        safeFetch('api.php?action=get_settings'),
        safeFetch('api.php?action=get_messages')
      ]);

      if (projRes && Array.isArray(projRes)) setProjects(projRes);
      if (setRes && typeof setRes === 'object' && Object.keys(setRes).length > 0) {
        setSiteSettings(prev => ({
          ...prev,
          ...setRes,
          tools: Array.isArray(setRes.tools) ? setRes.tools : (prev.tools || []),
          stats: setRes.stats || prev.stats,
          contact: setRes.contact || prev.contact
        }));
      }
      if (msgRes && Array.isArray(msgRes)) setMessages(msgRes);
    } catch (e) { } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleFileUpload = async (file: File, target: string, toolIndex?: number) => {
    setUploading(target);
    const body = new FormData();
    body.append('file', file);
    try {
      const data = await safeFetch('api.php?action=upload', { method: 'POST', body: body });
      if (data && data.success) {
        if (target === 'project-thumb') setFormData(prev => ({ ...prev, imageUrl: data.url }));
        else if (target === 'project-media') setFormData(prev => ({ ...prev, mainMediaUrl: data.url }));
        else if (target === 'hero-image') setSiteSettings(prev => ({ ...prev, heroImageUrl: data.url }));
        else if (target === 'hero-video') setSiteSettings(prev => ({ ...prev, heroVideoUrl: data.url }));
        else if (target === 'hero-bg') setSiteSettings(prev => ({ ...prev, heroBgImageUrl: data.url }));
        else if (target === 'logo') setSiteSettings(prev => ({ ...prev, logoUrl: data.url }));
        else if (target === 'tool-icon' && typeof toolIndex === 'number') {
          setSiteSettings(prev => {
            const newTools = [...(prev.tools || [])];
            newTools[toolIndex] = { ...newTools[toolIndex], iconUrl: data.url };
            return { ...prev, tools: newTools };
          });
        }
        showFeedback("UPLOAD SUCCESSFUL");
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  const handleSaveSettings = async () => {
    const data = await safeFetch('api.php?action=save_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteSettings)
    });
    if (data && data.success) {
      localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
      showFeedback("SETTINGS COMMITTED");
    }
  };

  const handleCreateOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      id: editingProject ? editingProject.id : `prj-${Date.now()}`,
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()).filter(t => t) : (formData.tags || [])
    };
    const data = await safeFetch('api.php?action=save_project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (data && data.success) {
      setIsModalOpen(false);
      setEditingProject(null);
      showFeedback("PROJECT UPDATED");
      loadData();
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Delete project?')) {
      const data = await safeFetch(`api.php?action=delete_project&id=${id}`);
      if (data && data.success) {
        showFeedback("PROJECT DELETED");
        loadData();
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm('Delete message?')) {
      const data = await safeFetch(`api.php?action=delete_message&id=${id}`);
      if (data && data.success) {
        showFeedback("MESSAGE REMOVED");
        loadData();
      }
    }
  };

  const addTool = () => {
    const name = window.prompt("Enter software name:");
    if (!name || name.trim() === '') return;
    setSiteSettings(prev => {
      const currentTools = Array.isArray(prev.tools) ? prev.tools : [];
      return { ...prev, tools: [...currentTools, { name: name.trim(), iconUrl: '' }] };
    });
  };

  const removeTool = (index: number) => {
    setSiteSettings(prev => {
      const currentTools = Array.isArray(prev.tools) ? prev.tools : [];
      return { ...prev, tools: currentTools.filter((_, i) => i !== index) };
    });
  };

  const handleServiceCustomChange = (slug: string, field: 'title' | 'description', value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      serviceCustoms: {
        ...(prev.serviceCustoms || {}),
        [slug]: { ...(prev.serviceCustoms?.[slug] || { title: '', description: '' }), [field]: value }
      }
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="text-red-600 font-orbitron animate-pulse font-black uppercase tracking-widest">CONNECTING TO CORE...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-inter">
      {saveStatus && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl animate-bounce">
          {saveStatus}
        </div>
      )}

      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-zinc-900 p-8 flex-col space-y-12 z-40 shadow-2xl">
        <div className="font-orbitron text-xl font-black tracking-tighter text-white">DAT<span className="text-red-600">ADMIN</span></div>
        <nav className="flex-1 space-y-4">
          {[
            { id: AdminTab.DASHBOARD, icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
            { id: AdminTab.PROJECTS, icon: <FileText className="w-4 h-4" />, label: 'Projects' },
            { id: AdminTab.MESSAGES, icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
            { id: AdminTab.SETTINGS, icon: <Settings className="w-4 h-4" />, label: 'Settings' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-4 px-4 py-3 text-red-900 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-widest">
          <LogOut className="w-4 h-4" /> <span>Logout</span>
        </button>
      </div>

      <div className="lg:ml-64 p-8 md:p-12 max-w-7xl mx-auto">
        {activeTab === AdminTab.DASHBOARD && (
          <div className="space-y-12">
            <h1 className="text-5xl font-black font-orbitron uppercase">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px]">
                <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Entries</div>
                <div className="text-4xl font-black font-orbitron text-red-600">{projects.length}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px]">
                <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Inbox</div>
                <div className="text-4xl font-black font-orbitron text-red-600">{messages.length}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px]">
                <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Tools</div>
                <div className="text-4xl font-black font-orbitron text-red-600">{siteSettings?.tools?.length || 0}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px]">
                <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Status</div>
                <div className="text-xs font-black uppercase text-green-500 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> CORE ACTIVE
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === AdminTab.PROJECTS && (
          <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h1 className="text-5xl font-black font-orbitron uppercase">Projects</h1>
              <button 
                onClick={() => { setEditingProject(null); setFormData({ category: ServiceType.VIDEO_EDITING, status: 'Published', tags: [], imageUrl: '', mainMediaUrl: '', title: '', description: '', client: '', websiteLink: '', driveLink: '', year: '2024' }); setIsModalOpen(true); }} 
                className="bg-red-600 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                ADD NEW PROJECT
              </button>
            </header>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
               <table className="w-full text-left">
                  <thead className="bg-zinc-900/30">
                    <tr>
                      <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Identity</th>
                      <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Specialty</th>
                      <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-zinc-900/10 transition-colors group">
                        <td className="px-8 py-6 flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800">
                             <img src={p.imageUrl} className="w-full h-full object-cover opacity-80" alt="" />
                           </div>
                           <div><div className="text-xs font-black">{p.title}</div><div className="text-[9px] text-zinc-600 uppercase tracking-widest">{p.client || 'General'}</div></div>
                        </td>
                        <td className="px-8 py-6"><span className="text-[10px] font-black uppercase px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400">{p.category}</span></td>
                        <td className="px-8 py-6 text-right space-x-6">
                           <button onClick={() => { setEditingProject(p); setFormData(p); setIsModalOpen(true); }} className="text-zinc-500 hover:text-white uppercase text-[10px] font-black">Modify</button>
                           <button onClick={() => deleteProject(p.id)} className="text-red-900 hover:text-red-500 uppercase text-[10px] font-black">Erase</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === AdminTab.SETTINGS && (
          <div className="space-y-12">
            <h1 className="text-5xl font-black font-orbitron uppercase tracking-tighter">System Config</h1>
            <div className="grid grid-cols-1 gap-12">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  <h2 className="text-2xl font-black uppercase tracking-tighter font-orbitron mb-6 text-white flex items-center gap-3"><Sliders className="w-6 h-6 text-red-600" /> BRAND & IDENTITY</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <FieldInput label="LOGO TEXT" value={siteSettings.brandName} onChange={v => setSiteSettings({...siteSettings, brandName: v})} />
                    <div className="grid grid-cols-2 gap-4">
                       <FieldInput type="number" label="X SHIFT" value={siteSettings.logoXShift} onChange={v => setSiteSettings({...siteSettings, logoXShift: v})} />
                       <FieldInput type="number" label="Y SHIFT" value={siteSettings.logoYShift} onChange={v => setSiteSettings({...siteSettings, logoYShift: v})} />
                    </div>
                  </div>
                  <FieldInput label="LOGO URL" value={siteSettings.logoUrl} onChange={v => setSiteSettings({...siteSettings, logoUrl: v})} onFileUpload={f => handleFileUpload(f, 'logo')} />
               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  <h2 className="text-2xl font-black uppercase tracking-tighter font-orbitron mb-6 text-white flex items-center gap-3"><Globe className="w-6 h-6 text-red-600" /> HERO MASTER</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <FieldInput label="HERO TITLE" value={siteSettings.heroTitle} onChange={v => setSiteSettings({...siteSettings, heroTitle: v})} />
                    <FieldInput label="HERO SUBTITLE" value={siteSettings.heroSubtitle} onChange={v => setSiteSettings({...siteSettings, heroSubtitle: v})} />
                  </div>
                  <FieldInput label="HERO VIDEO URL" value={siteSettings.heroVideoUrl} onChange={v => setSiteSettings({...siteSettings, heroVideoUrl: v})} onFileUpload={f => handleFileUpload(f, 'hero-video')} />
                  <FieldInput label="HERO STATIC IMAGE" value={siteSettings.heroImageUrl} onChange={v => setSiteSettings({...siteSettings, heroImageUrl: v})} onFileUpload={f => handleFileUpload(f, 'hero-image')} />
               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  <h2 className="text-2xl font-black uppercase tracking-tighter font-orbitron mb-6 text-white flex items-center gap-3"><LayoutDashboard className="w-6 h-6 text-red-600" /> PLATFORM STATISTICS</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <FieldInput type="number" label="COMPLETED" value={siteSettings.stats?.projectsCompleted} onChange={v => setSiteSettings({...siteSettings, stats: {...siteSettings.stats, projectsCompleted: v}})} />
                    <FieldInput type="number" label="CLIENTS" value={siteSettings.stats?.happyClients} onChange={v => setSiteSettings({...siteSettings, stats: {...siteSettings.stats, happyClients: v}})} />
                    <FieldInput type="number" label="YEARS" value={siteSettings.stats?.yearsExperience} onChange={v => setSiteSettings({...siteSettings, stats: {...siteSettings.stats, yearsExperience: v}})} />
                  </div>
               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  <div className="flex justify-between items-center"><h2 className="text-2xl font-black uppercase tracking-tighter font-orbitron text-white"><Wrench className="w-6 h-6 inline mr-3 text-red-600" /> INDUSTRY TOOLS</h2><button onClick={addTool} className="text-[10px] font-black uppercase bg-[#0a0a0a] border border-zinc-800 px-5 py-2.5 rounded-xl flex items-center gap-2"><Plus className="w-3 h-3" /> ADD TOOL</button></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {siteSettings.tools?.map((tool, i) => (
                      <div key={i} className="bg-[#050505] border border-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-4 relative group">
                        <div className="relative w-12 h-12 bg-[#0a0a0a] border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                          {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-contain" /> : <ImageIcon className="w-5 h-5 text-zinc-800" />}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"><Upload className="w-4 h-4" /><input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'tool-icon', i)} /></label>
                        </div>
                        <span className="text-[10px] font-black uppercase text-center">{tool.name}</span>
                        <button onClick={() => removeTool(i)} className="absolute top-3 right-3 text-zinc-800 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-2xl">
                  <h2 className="text-2xl font-black uppercase tracking-tighter font-orbitron mb-6 text-white"><User className="w-6 h-6 inline mr-3 text-red-600" /> CONTACT</h2>
                  <FieldInput label="EMAIL" value={siteSettings.contact?.email} onChange={v => setSiteSettings({...siteSettings, contact: {...siteSettings.contact, email: v}})} />
                  <FieldInput label="PHONE" value={siteSettings.contact?.phone} onChange={v => setSiteSettings({...siteSettings, contact: {...siteSettings.contact, phone: v}})} />
                  <FieldInput label="INSTAGRAM" value={siteSettings.contact?.instagram} onChange={v => setSiteSettings({...siteSettings, contact: {...siteSettings.contact, instagram: v}})} />
               </div>

               <button onClick={handleSaveSettings} className="w-full bg-red-600 py-8 rounded-[32px] font-black uppercase text-base shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">COMMIT ALL CHANGES TO DATABASE <HardDrive className="inline ml-3" /></button>
            </div>
          </div>
        )}

        {activeTab === AdminTab.MESSAGES && (
          <div className="space-y-12">
            <h1 className="text-5xl font-black font-orbitron uppercase">Inbox</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {messages.map(msg => (
                <div key={msg.id} className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-6 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-lg font-black">{msg.name}</h3><span className="text-[9px] font-black text-red-600 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20 uppercase tracking-widest">{msg.service}</span></div>
                    <button onClick={() => deleteMessage(msg.id)} className="text-zinc-700 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-black/50 p-6 rounded-2xl border border-zinc-900"><p className="text-zinc-400 text-sm font-medium whitespace-pre-wrap">{msg.brief}</p></div>
                  <a href={`mailto:${msg.email}`} className="text-xs font-bold text-zinc-400 hover:text-white"><Mail className="w-3.5 h-3.5 inline mr-2" /> {msg.email}</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/98 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#050505] border border-zinc-900 rounded-[48px] p-10 md:p-14 shadow-2xl my-auto">
            <h2 className="text-5xl font-black font-orbitron mb-12 uppercase tracking-tighter">Project Config</h2>
            <form onSubmit={handleCreateOrUpdateProject} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <FieldInput label="TITLE" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">SECTOR</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ServiceType})} className="w-full bg-[#080808] border border-zinc-900 rounded-xl px-5 py-4 text-sm font-black text-white">{Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">STATUS</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-[#080808] border border-zinc-900 rounded-xl px-5 py-4 text-sm font-black text-white">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
                <FieldInput label="TAGS" placeholder="E.g. Gaming, Montage" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={v => setFormData({...formData, tags: v})} />
                <FieldInput label="THUMBNAIL" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} onFileUpload={f => handleFileUpload(f, 'project-thumb')} />
                <FieldInput label="MEDIA ASSET" value={formData.mainMediaUrl} onChange={v => setFormData({...formData, mainMediaUrl: v})} onFileUpload={f => handleFileUpload(f, 'project-media')} />
                <FieldInput label="WEBSITE LINK" placeholder="https://..." value={formData.websiteLink} onChange={v => setFormData({...formData, websiteLink: v})} />
                <FieldInput label="GOOGLE DRIVE LINK" placeholder="https://drive.google.com/..." value={formData.driveLink} onChange={v => setFormData({...formData, driveLink: v})} />
                <FieldInput label="CLIENT" value={formData.client} onChange={v => setFormData({...formData, client: v})} />
                <FieldInput label="YEAR" value={formData.year} onChange={v => setFormData({...formData, year: v})} />
              </div>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#080808] border border-zinc-900 rounded-xl px-6 py-6 text-sm font-black text-white resize-none" placeholder="Mission Description..." />
              <div className="flex gap-6"><button type="submit" disabled={!!uploading} className="flex-[3] bg-red-600 py-6 rounded-2xl font-black uppercase text-sm">{uploading ? 'UPLOADING...' : (editingProject ? 'UPDATE' : 'CREATE')}</button><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#121212] border border-zinc-900 py-6 rounded-2xl text-[11px] font-black uppercase">CANCEL</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;