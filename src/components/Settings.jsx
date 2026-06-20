import React, { useState } from 'react';
import {
  Settings as SettingsIcon, User, Shield, Key, Server, Globe,
  Bell, Eye, Sliders, ToggleLeft, ToggleRight, Copy, RefreshCw,
  Check, Cpu, Database, Wifi, Clock, Zap, ChevronRight, Lock,
  Palette, Monitor
} from 'lucide-react';

function Toggle({ enabled, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 ${enabled ? 'bg-cyan-brand' : 'bg-slate-300'}`}>
        <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-300 ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}`} />
      </div>
      <span className="text-xs font-medium text-slate-700 group-hover:text-blue-dark transition-colors">{label}</span>
    </button>
  );
}

export default function Settings({ userRole, darkMode, setDarkMode }) {
  const isClient = userRole === 'client';
  const [copied, setCopied] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: darkMode || false,
    autoAnalysis: true,
    highRiskAlerts: true,
    weeklyReport: true,
    riskThreshold: 70,
    analysisMode: 'hybrid',
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Profile data
  const profile = isClient
    ? { name: 'Dr. Anthony Quaresma', role: 'Editor Científico', email: 'anthony.quaresma@editorabiomed.com.br', org: 'Editora BioMed', initials: 'AQ', plan: 'Profissional' }
    : { name: 'Isaque Severino', role: 'Analista de Integridade Científica', email: 'isaque.severino@aletheiaivision.ai', org: 'AletheiaVision IA', initials: 'IS', plan: 'Enterprise' };

  // API connections
  const apiConnections = [
    { name: 'OJS (Open Journal Systems)', status: 'Conectado', color: 'text-green-success', bg: 'bg-green-success/10 border-green-success/20', icon: Globe },
    { name: 'ScholarOne Manuscripts', status: 'Conectado', color: 'text-green-success', bg: 'bg-green-success/10 border-green-success/20', icon: Globe },
    { name: 'Editorial Manager', status: 'Pendente', color: 'text-yellow-warning', bg: 'bg-yellow-warning/10 border-yellow-warning/20', icon: Globe },
    { name: 'CrossRef DOI Lookup', status: 'Conectado', color: 'text-green-success', bg: 'bg-green-success/10 border-green-success/20', icon: Database },
  ];

  const tokens = [
    { label: 'API Key (Produção)', value: 'av_prod_k8s_7f3d2e1b9a4c...', full: 'av_prod_k8s_7f3d2e1b9a4c56d8e0f1a2b3c4d5e6f7' },
    { label: 'JWT Secret (Homologação)', value: 'eyJhbGciOiJSUzI1NiIs...', full: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhbGV0aGVpYXZpc2lvbiJ9' },
    { label: 'Webhook Token', value: 'whk_live_9x8y7z6w5v4u...', full: 'whk_live_9x8y7z6w5v4u3t2s1r0qponmlkjihgfedcba' },
  ];

  // System info
  const systemInfo = [
    { label: 'Versão', value: 'AletheiaVision Core v2.4.1', icon: Monitor },
    { label: 'Frontend', value: 'React 19.2.6 + Vite 8.0.12', icon: Cpu },
    { label: 'Estilização', value: 'Tailwind CSS v4.3.0', icon: Palette },
    { label: 'Motor IA', value: 'AletheiaNet v3.1 (PyTorch)', icon: Zap },
    { label: 'Último deploy', value: '20/06/2026 às 10:15', icon: Clock },
    { label: 'Uptime', value: '99.97% (30 dias)', icon: Wifi },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <SettingsIcon size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Configurações</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Preferências da conta, integrações e parâmetros do sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-all animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
            <User size={16} className="text-cyan-brand" />
            <h3 className="text-sm font-bold text-blue-dark">Perfil do Usuário</h3>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-brand to-blue-petrol flex items-center justify-center shadow-lg shadow-cyan-brand/20">
              <span className="text-2xl font-extrabold text-white">{profile.initials}</span>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-blue-dark">{profile.name}</h4>
              <span className="text-[10px] text-cyan-brand font-bold uppercase tracking-wider">{profile.role}</span>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              {[
                { l: 'E-mail', v: profile.email },
                { l: 'Organização', v: profile.org },
                { l: 'Plano', v: profile.plan },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-[10px] text-slate-500 font-medium">{item.l}</span>
                  <span className="text-[11px] text-slate-700 font-semibold truncate max-w-[180px]">{item.v}</span>
                </div>
              ))}
            </div>
            <button className="mt-2 w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-all">
              Editar Perfil
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {/* Notifications & Display */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <Bell size={16} className="text-cyan-brand" />
              <h3 className="text-sm font-bold text-blue-dark">Notificações e Exibição</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle enabled={settings.notifications} onToggle={() => toggleSetting('notifications')} label="Notificações no sistema" />
              <Toggle enabled={settings.emailAlerts} onToggle={() => toggleSetting('emailAlerts')} label="Alertas por e-mail" />
              <Toggle enabled={settings.highRiskAlerts} onToggle={() => toggleSetting('highRiskAlerts')} label="Alerta de alto risco imediato" />
              <Toggle enabled={settings.weeklyReport} onToggle={() => toggleSetting('weeklyReport')} label="Relatório semanal automático" />
              <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} label="Modo escuro" />
              <Toggle enabled={settings.autoAnalysis} onToggle={() => toggleSetting('autoAnalysis')} label="Análise automática ao submeter" />
            </div>
          </div>

          {/* AI Parameters */}
          {!isClient && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                <Sliders size={16} className="text-cyan-brand" />
                <h3 className="text-sm font-bold text-blue-dark">Parâmetros da IA</h3>
              </div>

              {/* Risk Threshold */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">Limiar de risco (threshold)</label>
                  <span className={`text-sm font-extrabold ${settings.riskThreshold >= 70 ? 'text-red-danger' : settings.riskThreshold >= 40 ? 'text-yellow-warning' : 'text-green-success'}`}>
                    {settings.riskThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={settings.riskThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, riskThreshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-brand"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-green-success font-medium">Permissivo (menos alertas)</span>
                  <span className="text-[9px] text-red-danger font-medium">Restritivo (mais alertas)</span>
                </div>
              </div>

              {/* Analysis Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Modo de análise</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Automático', desc: 'Somente IA', icon: Cpu },
                    { id: 'hybrid', label: 'Híbrido', desc: 'IA + Humano', icon: Zap },
                    { id: 'manual', label: 'Manual', desc: 'Prioriza humano', icon: User },
                  ].map(mode => {
                    const ModeIcon = mode.icon;
                    const isActive = settings.analysisMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSettings(prev => ({ ...prev, analysisMode: mode.id }))}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                          isActive
                            ? 'bg-cyan-brand/5 border-cyan-brand/30 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <ModeIcon size={16} className={isActive ? 'text-cyan-brand' : 'text-slate-400'} />
                        <span className={`text-[10px] font-bold ${isActive ? 'text-blue-dark' : 'text-slate-600'}`}>{mode.label}</span>
                        <span className="text-[8px] text-slate-400 font-medium">{mode.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* API Integrations & Tokens */}
      {!isClient && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Connections */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <Wifi size={16} className="text-cyan-brand" />
              <h3 className="text-sm font-bold text-blue-dark">Integrações de API</h3>
            </div>
            <div className="flex flex-col gap-3">
              {apiConnections.map((conn, idx) => {
                const ConnIcon = conn.icon;
                return (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${conn.bg} transition-all hover:shadow-sm animate-fade-in-up`} style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <ConnIcon size={14} className="text-slate-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{conn.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${conn.status === 'Conectado' ? 'bg-green-success animate-live-pulse' : 'bg-yellow-warning'}`} />
                      <span className={`text-[10px] font-bold ${conn.color}`}>{conn.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tokens & Credentials */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <Key size={16} className="text-cyan-brand" />
              <h3 className="text-sm font-bold text-blue-dark">Credenciais e Tokens</h3>
            </div>
            <div className="flex flex-col gap-3">
              {tokens.map((token, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl border border-slate-100 p-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Lock size={10} />
                      {token.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] font-mono text-slate-600 bg-white border border-slate-200 rounded-md px-3 py-2 truncate">
                      {token.value}
                    </code>
                    <button
                      onClick={() => handleCopy(token.full, idx)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-cyan-brand/5 hover:border-cyan-brand/30 cursor-pointer transition-all shrink-0"
                      title="Copiar"
                    >
                      {copied === idx ? <Check size={14} className="text-green-success" /> : <Copy size={14} className="text-slate-400" />}
                    </button>
                    <button
                      className="p-2 rounded-lg border border-slate-200 hover:bg-yellow-warning/5 hover:border-yellow-warning/30 cursor-pointer transition-all shrink-0"
                      title="Regenerar"
                    >
                      <RefreshCw size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* System Information */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
          <Server size={16} className="text-cyan-brand" />
          <h3 className="text-sm font-bold text-blue-dark">Informações do Sistema</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {systemInfo.map((info, idx) => {
            const InfoIcon = info.icon;
            return (
              <div key={idx} className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center flex flex-col items-center gap-2 hover:shadow-sm transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.04}s` }}>
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <InfoIcon size={14} className="text-cyan-brand" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{info.label}</span>
                <span className="text-[11px] text-slate-700 font-semibold leading-tight">{info.value}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
