
import React, { useEffect, useState } from 'react';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    if (data.stats) {
      setStats([
        { value: `${data.stats.projectsCompleted}+`, label: 'Projects Completed' },
        { value: `${data.stats.happyClients}+`, label: 'Happy Clients' },
        { value: `${data.stats.yearsExperience}`, label: 'Years of Experience' },
      ]);
    }
  }, []);

  return (
    <section className="border-y border-zinc-900 py-24 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-5xl md:text-7xl font-black text-red-600 font-orbitron italic">
                {stat.value}
              </div>
              <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
