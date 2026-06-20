import React, { useState } from 'react';
import {
  Globe, Users, CheckCircle2, Activity, TrendingUp,
  Search, ChevronDown, ChevronRight, Star, Building2,
  FileText, Ticket, ExternalLink, AlertTriangle, Clock, Eye
} from 'lucide-react';

export default function EditorsClients({ editoras, submissions, tickets, setActivePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPorte, setFilterPorte] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedEditor, setExpandedEditor] = useState(null);

  const activeClients = editoras.filter(e => e.status === 'Cliente ativo').length;
  const totalVolume = editoras.reduce((a, e) => a + parseInt(e.volume), 0);
  const avgNps = editoras.filter(e => e.nps !== null).length > 0
    ? Math.round(editoras.filter(e => e.nps !== null).reduce((a, e) => a + e.nps, 0) / editoras.filter(e => e.nps !== null).length)
    : 0;

  const filtered = editoras.filter(ed => {
    if (searchTerm && !ed.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterPorte !== 'all' && ed.porte !== filterPorte) return false;
    if (filterArea !== 'all' && ed.area !== filterArea) return false;
    if (filterStatus !== 'all' && ed.status !== filterStatus) return false;
    return true;
  });

  const getStatusStyle = (status) => {
    const map = {
      'Cliente ativo': 'bg-green-success/10 text-green-success border-green-success/20',
      'Integração API': 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20',
      'Treinamento': 'bg-cyan-brand/10 text-blue-petrol border-cyan-brand/20',
      'Contrato assinado': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Demo realizada': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Lead recebido': 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const getPorteStyle = (porte) => {
    const map = {
      'Grande': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Média': 'bg-cyan-brand/10 text-blue-petrol border-cyan-brand/20',
      'Pequena': 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return map[porte] || '';
  };

  const getPriorityStyle = (p) => {
    const map = {
      'Crítica': 'bg-red-danger/10 text-red-danger border-red-danger/20',
      'Alta': 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20',
      'Média': 'bg-cyan-brand/10 text-blue-petrol border-cyan-brand/20',
      'Baixa': 'bg-green-success/10 text-green-success border-green-success/20',
    };
    return map[p] || '';
  };

  const kpis = [
    { label: 'Total de Editoras', value: editoras.length, icon: Globe, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20' },
    { label: 'Clientes Ativos', value: activeClients, icon: CheckCircle2, color: 'bg-green-success/10 text-green-success border-green-success/20' },
    { label: 'Volume Total', value: `${totalVolume.toLocaleString('pt-BR')}`, suffix: ' art/mês', icon: Activity, color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20' },
    { label: 'NPS Médio', value: avgNps, icon: Star, color: avgNps >= 80 ? 'bg-green-success/10 text-green-success border-green-success/20' : 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Globe size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Editoras Clientes</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Visão consolidada de todas as editoras parceiras</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActivePage('onboarding')}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-brand text-blue-dark font-extrabold text-xs rounded-lg cursor-pointer hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-brand/30"
          >
            <Users size={15} />
            Gerenciar Onboarding
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2 ${kpi.color}`}>
                <Icon size={16} />
              </div>
              <span className="text-xl font-extrabold text-blue-dark block">{kpi.value}{kpi.suffix || ''}</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</span>
            </div>
          );
        })}
      </section>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar editora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
          />
        </div>
        {[
          { value: filterPorte, setter: setFilterPorte, label: 'Porte', options: ['all', 'Pequena', 'Média', 'Grande'] },
          { value: filterArea, setter: setFilterArea, label: 'Área', options: ['all', 'Oncologia', 'Genética', 'Microbiologia', 'Biomédica'] },
          { value: filterStatus, setter: setFilterStatus, label: 'Status', options: ['all', 'Lead recebido', 'Demo realizada', 'Contrato assinado', 'Integração API', 'Treinamento', 'Cliente ativo'] },
        ].map((filter, i) => (
          <select
            key={i}
            value={filter.value}
            onChange={(e) => filter.setter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer focus:outline-none focus:border-cyan-brand transition-all"
          >
            <option value="all">{filter.label}: Todos</option>
            {filter.options.filter(o => o !== 'all').map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <span className="text-[10px] text-slate-400 font-semibold">{filtered.length} de {editoras.length} editoras</span>
      </div>

      {/* Editors Table */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest w-8"></th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Porte</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Volume</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Sistema</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Prioridade</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">NPS</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Responsáveis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ed, idx) => {
                const isExpanded = expandedEditor === ed.id;
                const edSubmissions = submissions.filter(s => s.editor === ed.nome);
                const edTickets = tickets.filter(t => t.editor === ed.nome);
                return (
                  <React.Fragment key={ed.id}>
                    <tr
                      className={`hover:bg-slate-50/70 transition-all cursor-pointer animate-fade-in-up ${isExpanded ? 'bg-cyan-brand/5' : ''}`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                      onClick={() => setExpandedEditor(isExpanded ? null : ed.id)}
                    >
                      <td className="px-4 py-3">
                        <ChevronRight size={12} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-petrol text-xs">{ed.id}</td>
                      <td className="px-4 py-3 text-slate-800 font-semibold text-xs">{ed.nome}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPorteStyle(ed.porte)}`}>{ed.porte}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{ed.area}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">{ed.volume}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{ed.sistemaAtual}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(ed.status)}`}>{ed.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityStyle(ed.prioridade)}`}>{ed.prioridade}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {ed.nps !== null ? (
                          <span className={`font-extrabold ${ed.nps >= 80 ? 'text-green-success' : ed.nps >= 50 ? 'text-yellow-warning' : 'text-red-danger'}`}>{ed.nps}</span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-600">{ed.responsavelComercial} / {ed.responsavelTecnico}</td>
                    </tr>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <tr className="animate-fade-in-up">
                        <td colSpan="11" className="p-0">
                          <div className="bg-slate-50/70 border-t border-b border-cyan-brand/10 px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Info Summary */}
                              <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <h4 className="text-xs font-bold text-blue-dark mb-3 flex items-center gap-2">
                                  <Building2 size={14} className="text-cyan-brand" />
                                  Informações
                                </h4>
                                <div className="flex flex-col gap-2">
                                  {[
                                    { l: 'Sistema', v: ed.sistemaAtual },
                                    { l: 'Prioridade', v: ed.prioridade },
                                    { l: 'Resp. Comercial', v: ed.responsavelComercial },
                                    { l: 'Resp. Técnico', v: ed.responsavelTecnico },
                                  ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 font-medium">{item.l}</span>
                                      <span className="text-[11px] text-slate-700 font-semibold">{item.v}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Submissions */}
                              <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <h4 className="text-xs font-bold text-blue-dark mb-3 flex items-center gap-2">
                                  <FileText size={14} className="text-cyan-brand" />
                                  Submissões ({edSubmissions.length})
                                </h4>
                                {edSubmissions.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {edSubmissions.slice(0, 4).map(sub => (
                                      <div key={sub.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-blue-petrol">{sub.id}</span>
                                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${sub.risk === 'Alto' ? 'bg-red-danger/10 text-red-danger border-red-danger/20' : sub.risk === 'Médio' ? 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20' : 'bg-green-success/10 text-green-success border-green-success/20'}`}>{sub.risk}</span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-600">{sub.score.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Nenhuma submissão registrada</span>
                                )}
                              </div>

                              {/* Tickets */}
                              <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <h4 className="text-xs font-bold text-blue-dark mb-3 flex items-center gap-2">
                                  <Ticket size={14} className="text-cyan-brand" />
                                  Tickets ({edTickets.length})
                                </h4>
                                {edTickets.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {edTickets.map(t => (
                                      <div key={t.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-blue-petrol">{t.id}</span>
                                          <span className="text-[10px] text-slate-600 truncate max-w-[120px]">{t.title}</span>
                                        </div>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                                          t.status === 'Aberto' ? 'bg-red-danger/10 text-red-danger border-red-danger/20' :
                                          t.status === 'Em andamento' ? 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20' :
                                          'bg-green-success/10 text-green-success border-green-success/20'
                                        }`}>{t.status}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Nenhum ticket registrado</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
