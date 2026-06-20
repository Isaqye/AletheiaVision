import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  UserCheck, 
  ClipboardList, 
  Globe, 
  Ticket, 
  BarChart2, 
  Settings,
  UploadCloud,
  User,
  Users
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, userRole, onLogout }) {
  
  // Menu options for staff members (internal views)
  const staffItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'Análise de Imagens', icon: Search },
    { id: 'review', label: 'Revisão Humana', icon: UserCheck },
    { id: 'onboarding', label: 'Onboarding de Editoras', icon: ClipboardList },
    { id: 'editors', label: 'Editoras Clientes', icon: Globe },
    { id: 'tickets', label: 'Tickets de Suporte', icon: Ticket },
    { id: 'reports', label: 'Relatórios', icon: BarChart2 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  // Menu options for client editors (external portal)
  const clientItems = [
    { id: 'client-dashboard', label: 'Painel da Editora', icon: LayoutDashboard },
    { id: 'client-submit', label: 'Análise de Imagem (IA)', icon: UploadCloud },
    { id: 'client-tickets', label: 'Meus Chamados', icon: Ticket },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const menuItems = userRole === 'client' ? clientItems : staffItems;

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-60 bg-blue-dark/95 border-r border-cyan-brand/10 flex flex-col justify-between z-40 overflow-y-auto">
      <div className="flex flex-col">
        {/* User Info Section */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-brand to-cyan-700 flex items-center justify-center text-white font-extrabold shadow shadow-cyan-brand/20 shrink-0">
            {userRole === 'client' ? 'EC' : 'EQ'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-extrabold text-cyan-brand uppercase tracking-wider">Acesso Autenticado</span>
            <span className="text-xs font-semibold text-white truncate">
              {userRole === 'client' ? 'Editor Científico' : 'Analista Interno'}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col p-4 gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activePage;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                }}
                className={`flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-md transition-all relative ${
                  isActive 
                    ? 'bg-cyan-brand/15 text-cyan-brand font-semibold' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-cyan-brand rounded-r-md" />
                )}
                <Icon size={16} className={isActive ? 'text-cyan-brand' : 'opacity-70'} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 flex flex-col gap-3">
        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair do Sistema
        </button>
        <div className="text-center flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-500 font-medium">AletheiaVision Suite</span>
          <span className="text-[8px] text-cyan-brand/50 font-bold tracking-wide uppercase">Visão: {userRole === 'client' ? 'Editora Parceira' : 'Equipe Técnica'}</span>
        </div>
      </div>
    </aside>
  );
}
