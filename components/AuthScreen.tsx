import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Shield, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onLogin: (email: string) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  console.log('AuthScreen: Rendering...');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (!email || !password) {
        setError("CREDENTIALS_MISSING: Input required.");
        return;
      }
      if (password.length < 6) {
        setError("SECURITY_WARNING: Password entropy too low.");
        return;
      }
      onLogin(email);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setError(null);
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      setIsLoading(false);
      onLogin("google_user@gmail.com");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             opacity: 0.3 
           }}>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
        
        <div className="p-8">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#111] border border-[#333] rounded mx-auto flex items-center justify-center mb-4 text-blue-500">
               <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-header text-white tracking-widest uppercase mb-1">
              Predicta <span className="text-blue-500">Secure</span>
            </h1>
            <p className="text-xs font-mono text-slate-500 uppercase">
              Identity Verification Protocol // v2.0
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Identity (Email)</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222] text-slate-200 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  placeholder="agent@predicta.ai"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Access Key (Password)</label>
              <div className="relative group">
                 <div className="absolute left-3 top-3 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080808] border border-[#222] text-slate-200 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                   <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                   {isLogin ? 'Initiate Session' : 'Register Agent'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] bg-[#222] flex-1"></div>
            <span className="text-[10px] font-mono text-slate-600 uppercase">Or Access via Node</span>
            <div className="h-[1px] bg-[#222] flex-1"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-slate-200 font-bold py-2.5 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
             <GoogleIcon /> Continue with Google
          </button>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => { setError(null); setIsLogin(!isLogin); }}
              className="text-xs text-slate-500 hover:text-blue-400 transition-colors font-mono underline decoration-slate-700 underline-offset-4"
            >
              {isLogin ? "Request New Clearance (Sign Up)" : "Have Clearance? Log In"}
            </button>
          </div>

        </div>
        
        {/* Footer info */}
        <div className="p-3 bg-[#080808] border-t border-[#222] text-center">
          <p className="text-[9px] text-slate-700 font-mono">
            SECURE CONNECTION ESTABLISHED :: 256-BIT ENCRYPTION
          </p>
        </div>
      </div>
    </div>
  );
};