import React from 'react';
import { Settings } from 'lucide-react';

export default function EditorsTable({ editoras, selectedEditora, onSelectEditora }) {
  
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Crítica':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-danger/10 text-red-danger border border-red-danger/20">Crítica</span>;
      case 'Alta':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-warning/10 text-amber-800 border border-yellow-warning/20">Alta</span>;
      case 'Média':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 border border-blue-600/20">Média</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Baixa</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lead recebido':
      case 'Demo realizada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{status}</span>;
      case 'Contrato assinado':
      case 'Proposta enviada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-700">{status}</span>;
      case 'Integração API':
      case 'Treinamento':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-warning/10 text-amber-800">{status}</span>;
      case 'Cliente ativo':
      case '30 dias de uso':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-success/10 text-green-success">{status}</span>;
      default:
        return null;
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-md font-bold text-blue-dark">Editoras Clientes</h3>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20">
          {editoras.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Volume/mês</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Sistema Atual</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Responsável</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Prioridade</th>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {editoras.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-400">
                  Nenhuma editora cadastrada corresponde aos filtros aplicados.
                </td>
              </tr>
            ) : (
              editoras.map((editora) => {
                const isSelected = editora.id === selectedEditora.id;
                return (
                  <tr 
                    key={editora.id}
                    onClick={() => onSelectEditora(editora)}
                    className={`cursor-pointer hover:bg-cyan-brand/[0.04] transition-all ${
                      isSelected ? 'bg-cyan-brand/[0.08] border-l-4 border-l-cyan-brand' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">
                      <div className="flex flex-col">
                        <span>{editora.nome}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{editora.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{editora.volume}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 font-medium">{editora.sistemaAtual}</td>
                    <td className="px-4 py-3.5 text-sm">{getStatusBadge(editora.status)}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 font-medium">{editora.responsavelTecnico}</td>
                    <td className="px-4 py-3.5 text-sm">{getPriorityBadge(editora.prioridade)}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEditora(editora);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-cyan-brand rounded-md text-blue-petrol hover:bg-cyan-brand hover:text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Settings size={12} />
                        Gerenciar
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
