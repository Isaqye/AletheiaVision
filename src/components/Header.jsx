import React from 'react';
import { Download, Plus, UploadCloud } from 'lucide-react';

export default function Header({ activePage, onAction, userRole, setActivePage }) {
  const isClient = userRole === 'client';
  const isOnboarding = activePage === 'onboarding';

  // Determine headers based on user profile and active page
  let subtitle = 'Análise de Imagens Científicas';
  let roleLabel = 'Analista';
  let userName = 'Isaque Severino';
  let initials = 'IS';
  let actionText = 'Exportar relatório';

  if (isClient) {
    subtitle = 'Portal da Editora Cliente';
    roleLabel = 'Editor Científico';
    userName = 'Dr. Anthony Quaresma';
    initials = 'AQ';
    actionText = 'Submeter Artigo';
  } else if (isOnboarding) {
    subtitle = 'Módulo de Onboarding de Editoras';
    roleLabel = 'Gestor';
    userName = 'Anthony Quaresma';
    initials = 'AQ';
    actionText = 'Novo onboarding';
  }

  const handleButtonClick = () => {
    if (isClient) {
      setActivePage('client-submit');
    } else {
      onAction();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-blue-dark via-blue-petrol to-blue-dark/95 border-b border-cyan-brand/20 backdrop-blur-md flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center animate-pulse-glow">
          <img
            src="/logo-aletheia.png"
            alt="AletheiaVision Logo"
            className="w-24 h-24 object-contain rounded-md"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0, 184, 200, 0.4))' }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">AletheiaVision Core</h1>
          <span className="text-[10px] text-cyan-brand font-semibold tracking-wider uppercase mt-1">{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-brand to-cyan-700 flex items-center justify-center font-bold text-xs text-white tracking-wider shadow-inner">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest leading-none">{roleLabel}</span>
            <span className="text-sm text-white font-medium">{userName}</span>
          </div>
        </div>
        <button
          onClick={handleButtonClick}
          className="btn-outline flex items-center gap-2 px-4 py-2 bg-white/5 text-white hover:bg-white/10 hover:border-cyan-brand hover:shadow-cyan-brand/10 border border-white/20 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-95 animate-pulse-glow"
        >
          {isClient ? <UploadCloud size={14} /> : (isOnboarding ? <Plus size={14} /> : <Download size={14} />)}
          {actionText}
        </button>
      </div>
    </header>
  );
}
