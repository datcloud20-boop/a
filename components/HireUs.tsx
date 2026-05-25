
import React, { useState } from 'react';
import { ServiceType, Message } from '../types';
import { ChevronDown, MoveRight, CheckCircle } from 'lucide-react';

const HireUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', service: ServiceType.VIDEO_EDITING, brief: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      service: formData.service,
      brief: formData.brief,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    try {
      await fetch('api.php?action=save_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("Transmission failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-black min-h-screen py-32 px-6 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full bg-[#050505] border border-zinc-900 rounded-[40px] p-20 text-center shadow-2xl">
           <CheckCircle className="w-20 h-20 text-red-600 mx-auto mb-8" />
           <h2 className="text-4xl font-black uppercase font-orbitron text-white mb-6">TRANSMISSION RECEIVED</h2>
           <p className="text-zinc-500 text-sm mb-10">Your project brief has been logged in our database. We'll be in touch soon.</p>
           <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase">BACK TO FORM</button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black min-h-screen py-32 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Requested heading and description area */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-orbitron text-white leading-none">
            READY TO <span className="text-red-600">SCALE?</span>
          </h1>
          <p className="mt-6 text-zinc-500 text-sm md:text-base font-medium uppercase tracking-[0.3em]">
            Provide your project parameters below to initialize deployment with DATCLOUD.
          </p>
        </div>

        <div className="bg-[#050505] border border-zinc-900 rounded-[40px] p-8 md:p-20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <input required placeholder="Name" className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <select className="w-full bg-[#080808] border border-zinc-900 rounded-xl p-5 text-white" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value as ServiceType})}>
              {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <textarea required rows={6} placeholder="Brief details..." className="w-full bg-[#080808] border border-zinc-900 rounded-xl p-5 text-white" value={formData.brief} onChange={e => setFormData({...formData, brief: e.target.value})} />
            <button disabled={loading} type="submit" className="w-full py-6 bg-red-600 text-white font-black uppercase rounded-2xl shadow-xl shadow-red-600/20">
              {loading ? 'SENDING...' : 'INITIALIZE PROJECT'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HireUs;
