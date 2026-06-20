import React, { useState } from 'react';
import { Mail, Lock, Shield, Users, User, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const normalizedEmail = email.toLowerCase().trim();
      
      if (normalizedEmail === 'staff@aletheiavision.com' && password === 'admin') {
        onLoginSuccess('staff');
      } else if (normalizedEmail === 'client@aletheiavision.com' && password === 'client') {
        onLoginSuccess('client');
      } else {
        setError('E-mail ou senha incorretos. Dica: use os atalhos de Acesso Rápido abaixo para testar.');
      }
    }, 800);
  };

  const handleFastLogin = (role) => {
    setIsLoading(true);
    setError('');
    
    if (role === 'staff') {
      setEmail('staff@aletheiavision.com');
      setPassword('admin');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('staff');
      }, 500);
    } else {
      setEmail('client@aletheiavision.com');
      setPassword('client');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('client');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic glow circles for high aesthetic value (Aletheia style) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-brand/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid overlay for tech look */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,184,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,200,0.3) 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-brand to-blue-petrol flex items-center justify-center shadow-lg shadow-cyan-brand/20 mb-4 animate-pulse-glow">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">AletheiaVision Core</h2>
          <p className="text-xs text-cyan-brand font-semibold tracking-wider uppercase mt-1">Integridade Científica por IA</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-xs font-semibold leading-relaxed animate-shake">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 text-white placeholder:text-slate-500 rounded-xl text-sm transition-all focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Senha de Acesso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 text-white placeholder:text-slate-500 rounded-xl text-sm transition-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white cursor-pointer transition-all"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-brand to-blue-petrol text-white text-sm font-extrabold rounded-xl cursor-pointer hover:shadow-lg hover:shadow-cyan-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Entrar no Sistema
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acesso Rápido</span>
        </div>

        {/* Fast Login Options */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleFastLogin('staff')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-brand/40 text-white rounded-xl transition-all cursor-pointer text-xs font-bold"
          >
            <Users size={14} className="text-cyan-brand" />
            Acesso Staff
          </button>
          <button
            type="button"
            onClick={() => handleFastLogin('client')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/40 text-white rounded-xl transition-all cursor-pointer text-xs font-bold"
          >
            <User size={14} className="text-purple-400" />
            Portal Cliente
          </button>
        </div>

      </div>

      {/* Footer */}
      <span className="text-[10px] text-slate-500 font-semibold mt-6 relative z-10">
        AletheiaVision Core v3.1 © 2026
      </span>
    </div>
  );
}
