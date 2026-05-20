import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, UploadCloud, Star } from 'lucide-react';

export default function ClientDashboard({ clientSubmissions, clientTickets, setActivePage }) {
  const resolved = clientTickets.filter(t => t.status === 'Resolvido').length;
  const open = clientTickets.filter(t => t.status === 'Aberto').length;
  const total = clientSubmissions.length;
  const flagged = clientSubmissions.filter(s => s.risk === 'Alto').length;

  const kpis = [
    {
      label: 'Artigos submetidos',
      value: total,
      icon: FileText,
      color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20',
    },
    {
      label: 'Análises concluídas',
      value: clientSubmissions.filter(s => s.status === 'Finalizado').length,
      icon: CheckCircle2,
      color: 'bg-green-success/10 text-green-success border-green-success/20',
    },
    {
      label: 'Em análise',
      value: clientSubmissions.filter(s => s.status === 'Pendente').length,
      icon: Clock,
      color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20',
    },
    {
      label: 'Alertas de integridade',
      value: flagged,
      icon: AlertCircle,
      color: 'bg-red-danger/10 text-red-danger border-red-danger/20',
    },
    {
      label: 'Chamados abertos',
      value: open,
      icon: AlertCircle,
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
    {
      label: 'Chamados resolvidos',
      value: resolved,
      icon: Star,
      color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20',
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendente':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-warning/10 text-amber-700 border border-yellow-warning/20">Em análise</span>;
      case 'Revisado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20">Revisado</span>;
      case 'Finalizado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-success/10 text-green-success border border-green-success/20">Concluído</span>;
      default: return null;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Alto': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-danger/10 text-red-danger border border-red-danger/20">⚠ Alto</span>;
      case 'Médio': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-warning/10 text-amber-800 border border-yellow-warning/20">Médio</span>;
      case 'Baixo': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-success/10 text-green-success border border-green-success/20">Baixo</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">Bem-vindo, Editora BioMed!</h3>
          <p className="text-sm text-cyan-brand/80 mt-1 font-medium">Plano Profissional — OJS — Responsável técnico: Luan Assis</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActivePage('client-submit')}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-brand text-blue-dark font-extrabold text-xs rounded-lg cursor-pointer hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-brand/30"
          >
            <UploadCloud size={15} />
            Submeter Artigo para Análise
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3 cursor-default select-none animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${kpi.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-extrabold text-blue-dark">{kpi.value}</span>
                <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider truncate">{kpi.label}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Submissions History */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Histórico de Submissões</h3>
          <button
            onClick={() => setActivePage('client-submit')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-cyan-brand/10 border border-cyan-brand/20 text-blue-petrol hover:bg-cyan-brand hover:text-white rounded-md cursor-pointer transition-all"
          >
            <UploadCloud size={12} />
            Nova análise
          </button>
        </div>
        {clientSubmissions.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-400">
            Nenhum artigo submetido ainda.{' '}
            <button onClick={() => setActivePage('client-submit')} className="text-cyan-brand underline cursor-pointer">Submeter agora</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Título</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Risco</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Score</th>
                  <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-all">
                    <td className="px-4 py-3 font-bold text-blue-petrol text-xs">{sub.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium text-xs max-w-[200px] truncate">{sub.title}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{sub.area}</td>
                    <td className="px-4 py-3">{getRiskBadge(sub.risk)}</td>
                    <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-3 font-extrabold text-xs text-slate-700">{sub.score.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{sub.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
