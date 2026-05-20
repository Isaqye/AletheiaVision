import React from 'react';
import { Search } from 'lucide-react';

export default function SubmissionsTable({ submissions, selectedSub, onSelectSub }) {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Alto':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-danger/10 text-red-danger border border-red-danger/20">Alto</span>;
      case 'Médio':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-warning/10 text-yellow-warning border border-yellow-warning/20">Médio</span>;
      case 'Baixo':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-success/10 text-green-success border border-green-success/20">Baixo</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-warning/10 text-amber-800">Pendente</span>;
      case 'Revisado':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-brand/10 text-blue-petrol">Revisado</span>;
      case 'Finalizado':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-success/10 text-green-success">Finalizado</span>;
      default:
        return null;
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-md font-bold text-blue-dark">Submissões Recentes</h3>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20">
          {submissions.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Artigo</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Risco</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Score</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-400">
                  Nenhum registro corresponde aos filtros aplicados.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => {
                const isSelected = sub.id === selectedSub.id;
                return (
                  <tr 
                    key={sub.id}
                    onClick={() => onSelectSub(sub)}
                    className={`cursor-pointer hover:bg-cyan-brand/[0.04] transition-all ${
                      isSelected ? 'bg-cyan-brand/[0.08] border-l-4 border-l-cyan-brand' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 text-sm"><strong className="text-blue-petrol">{sub.id}</strong></td>
                    <td className="px-4 py-3.5 text-sm text-slate-800 font-medium">{sub.title}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{sub.editor}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{sub.area}</td>
                    <td className="px-4 py-3.5 text-sm">{getRiskBadge(sub.risk)}</td>
                    <td className="px-4 py-3.5 text-sm">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-3.5 text-sm font-extrabold text-slate-700">{sub.score.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSub(sub);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-cyan-brand rounded-md text-blue-petrol hover:bg-cyan-brand hover:text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Search size={12} />
                        Analisar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
