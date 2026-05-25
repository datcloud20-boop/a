import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveRight, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const action = isLogin ? 'login' : 'register';
      const payload = isLogin ? { email, password } : { username, email, password };
      
      const res = await fetch(`api.php?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Safety check for empty or non-ok responses
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        if (isLogin) {
          if (data.role === 'admin') localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('user', JSON.stringify(data));
          navigate(data.role === 'admin' ? '/admin' : '/');
        } else {
          alert("Registration successful! Please login.");
          setIsLogin(true);
        }
      } else {
        setError(data.error || 'Authentication failed.');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Connection to server failed.');
    } finally {
      // Always ensure loading is false to unlock the button
      setLoading(false);
    }
  };

  return (
    <section className="bg-black min-h-screen pt-32 pb-24 px-6 flex items-center justify-center overflow-hidden text-white">
      <div className="max-w-md w-full relative">
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-[40px] p-10 md:p-14 backdrop-blur-xl shadow-2xl relative">
          <div className="text-center mb-10">
            <div className="font-orbitron text-3xl font-black tracking-tighter text-white mb-2">
              DAT<span className="text-red-600">CLOUD</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              {isLogin ? 'Access Core Systems' : 'Initialize New Account'}
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                  <input 
                    required
                    type="text" 
                    placeholder="Studio Handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 text-sm font-medium focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-800 text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Email Terminal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                <input 
                  required
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 text-sm font-medium focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-800 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Access Key</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-12 py-4 text-sm font-medium focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-800 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl">
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center leading-tight">{error}</div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#f22c2c] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center group hover:bg-[#ff3a3a] transition-all shadow-[0_15px_40px_rgba(242,44,44,0.2)] disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT')} <MoveRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-zinc-900">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have access? Create Account" : "Existing Member? Back to Login"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;