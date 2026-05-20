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

export default function Sidebar({ activePage, setActivePage, userRole, setUserRole }) {
  
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
        {/* Profile Switcher Section */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Perfil de Acesso</span>
          <div className="flex bg-white/5 p-1 rounded-md border border-white/10">
            <button
              onClick={() => {
                setUserRole('staff');
                setActivePage('analysis');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                userRole === 'staff' 
                  ? 'bg-cyan-brand text-blue-dark font-extrabold shadow' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={12} />
              Interno
            </button>
            <button
              onClick={() => {
                setUserRole('client');
                setActivePage('client-dashboard');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                userRole === 'client' 
                  ? 'bg-cyan-brand text-blue-dark font-extrabold shadow' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={12} />
              Cliente
            </button>
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

      <div className="p-4 border-t border-white/5 text-center flex flex-col gap-1 items-center justify-center">
        <span className="text-[10px] text-slate-400 font-medium">AletheiaVision Suite</span>
        <span className="text-[8px] text-cyan-brand/60 font-semibold tracking-wide">VISÃO: {userRole === 'client' ? 'EDITORA PARCEIRA' : 'EQUIPE TÉCNICA'}</span>
      </div>
    </aside>
  );
}
