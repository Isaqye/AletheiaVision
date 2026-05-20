import React, { useState } from 'react';
import { 
  Ticket, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  MessageSquare, 
  CornerDownRight, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  User,
  Check
} from 'lucide-react';

export default function TicketsManager({ tickets, onUpdateTicket, triggerToast }) {
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editorFilter, setEditorFilter] = useState('all');
  
  // Local state for technical reply input
  const [replyText, setReplyText] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Statistics
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Aberto').length;
  const progressCount = tickets.filter(t => t.status === 'Em andamento').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolvido').length;

  // Unique editors list for the filter
  const editors = Array.from(new Set(tickets.map(t => t.editor)));

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesEditor = editorFilter === 'all' || t.editor === editorFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesEditor;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onUpdateTicket(selectedTicket.id, {
      reply: replyText,
      status: selectedTicket.status === 'Aberto' ? 'Em andamento' : selectedTicket.status
    });
    
    triggerToast(`Resposta enviada para o ticket ${selectedTicket.id} com sucesso!`);
    setReplyText('');
  };

  const handleUpdateStatus = (status) => {
    onUpdateTicket(selectedTicket.id, { status });
    triggerToast(`Status do ticket ${selectedTicket.id} alterado para "${status}"!`);
  };

  const handleUpdatePriority = (priority) => {
    onUpdateTicket(selectedTicket.id, { priority });
    triggerToast(`Prioridade do ticket ${selectedTicket.id} alterada para "${priority}"!`);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Alta': 
        return 'bg-red-danger/10 text-red-danger border-red-danger/20';
      case 'Média':
        return 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20';
      default:
        return 'bg-green-success/10 text-green-success border-green-success/20';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aberto':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-danger/10 text-red-danger border border-red-danger/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-danger animate-ping" />
            Aberto
          </span>
        );
      case 'Em andamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-warning/10 text-amber-700 border border-yellow-warning/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-warning animate-pulse" />
            Em andamento
          </span>
        );
      case 'Resolvido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-success/10 text-green-success border border-green-success/20 select-none">
            Resolvido
          </span>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* 1. KPIs Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Chamados', value: totalCount, icon: Ticket, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20' },
          { label: 'Abertos', value: openCount, icon: AlertCircle, color: 'bg-red-danger/10 text-red-danger border-red-danger/20' },
          { label: 'Em Andamento', value: progressCount, icon: Clock, color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20' },
          { label: 'Resolvidos', value: resolvedCount, icon: CheckCircle2, color: 'bg-green-success/10 text-green-success border-green-success/20' }
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 select-none"
            >
              <div className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${kpi.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-blue-dark block leading-none">{kpi.value}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">{kpi.label}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 2. Filters Bar */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, título ou descrição..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-slate-400 shrink-0" />
            <select 
              value={editorFilter} 
              onChange={(e) => setEditorFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/5 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center] pr-7"
            >
              <option value="all">Todas as Editoras</option>
              {editors.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/5 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center] pr-7"
          >
            <option value="all">Todos os Status</option>
            <option value="Aberto">Abertos</option>
            <option value="Em andamento">Em Andamento</option>
            <option value="Resolvido">Resolvidos</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/5 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center] pr-7"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
      </section>

      {/* 3. Main Split View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Tickets List Table (3 columns) */}
        <section className={`bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 ${selectedTicket ? 'lg:col-span-3' : 'lg:col-span-5'} hover:shadow-md transition-all`}>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-md font-bold text-blue-dark">Chamados Técnicos</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20 select-none">
              {filteredTickets.length} exibidos
            </span>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              Nenhum ticket corresponde aos filtros selecionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Ticket</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Editora</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Título</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Prioridade</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((t) => {
                    const isSelected = selectedTicketId === t.id;
                    return (
                      <tr 
                        key={t.id} 
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`hover:bg-slate-50/70 cursor-pointer transition-all ${isSelected ? 'bg-cyan-brand/[0.03] font-medium' : ''}`}
                      >
                        <td className="px-3 py-3 font-extrabold text-blue-petrol">{t.id}</td>
                        <td className="px-3 py-3 font-bold text-slate-700">{t.editor}</td>
                        <td className="px-3 py-3 text-slate-600 max-w-[150px] truncate">{t.title}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityStyle(t.priority)}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-3 py-3">{getStatusBadge(t.status)}</td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicketId(t.id);
                            }}
                            className={`p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-cyan-brand transition-all`}
                          >
                            <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right Side: Ticket Interactive Attending Panel (2 columns) */}
        {selectedTicket && (
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all lg:col-span-2 flex flex-col justify-between self-start min-h-[450px]">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-xs font-extrabold text-blue-petrol">{selectedTicket.id}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{selectedTicket.date} • {selectedTicket.category || 'Suporte Técnico'}</span>
                </div>
                <button
                  onClick={() => setSelectedTicketId(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded transition-all"
                >
                  Fechar Painel
                </button>
              </div>

              {/* Title & Client details */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <User size={13} className="text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-700">{selectedTicket.editor}</span>
                </div>
                <h4 className="text-sm font-bold text-blue-dark leading-tight">{selectedTicket.title}</h4>
              </div>

              {/* Ticket description card */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg mb-4 text-xs leading-relaxed text-slate-600">
                <p className="font-semibold text-slate-400 text-[9px] uppercase tracking-wider mb-1">Descrição do Chamado</p>
                <p className="whitespace-pre-line font-medium text-slate-700">{selectedTicket.description}</p>
              </div>

              {/* Support response display */}
              {selectedTicket.reply && (
                <div className="bg-cyan-brand/[0.02] border border-cyan-brand/10 p-3.5 rounded-lg mb-4 text-xs leading-relaxed text-blue-petrol">
                  <div className="flex items-center gap-1 mb-1">
                    <CornerDownRight size={13} className="text-cyan-brand shrink-0" />
                    <span className="font-bold text-cyan-brand text-[9px] uppercase tracking-widest">Resposta da Equipe Técnica</span>
                  </div>
                  <p className="whitespace-pre-line font-semibold text-slate-700 mt-1">{selectedTicket.reply}</p>
                </div>
              )}

              {/* Control Center: Status and Priority Adjusters */}
              <div className="grid grid-cols-2 gap-3 mb-5 border-t border-slate-100 pt-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Alterar Status</label>
                  <div className="flex flex-col gap-1.5">
                    {['Aberto', 'Em andamento', 'Resolvido'].map(status => {
                      const isActive = selectedTicket.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(status)}
                          className={`w-full py-1.5 px-3 rounded text-left text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                            isActive 
                              ? 'bg-blue-dark text-white border-blue-dark' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-dark/50'
                          }`}
                        >
                          <span>{status}</span>
                          {isActive && <Check size={12} className="text-cyan-brand" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Alterar Prioridade</label>
                  <div className="flex flex-col gap-1.5">
                    {['Baixa', 'Média', 'Alta'].map(priority => {
                      const isActive = selectedTicket.priority === priority;
                      return (
                        <button
                          key={priority}
                          onClick={() => handleUpdatePriority(priority)}
                          className={`w-full py-1.5 px-3 rounded text-left text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                            isActive 
                              ? 'bg-blue-dark text-white border-blue-dark' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-dark/50'
                          }`}
                        >
                          <span>{priority}</span>
                          {isActive && <Check size={12} className="text-cyan-brand" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Input form */}
            <form onSubmit={handleSendReply} className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <div className="relative">
                <textarea
                  rows="3"
                  placeholder="Redigir resposta para a editora parceira..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all resize-none leading-relaxed placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-md shadow-sm active:scale-98 transition-all cursor-pointer ${
                  replyText.trim() 
                    ? 'bg-gradient-to-br from-blue-dark to-blue-petrol text-white hover:shadow hover:from-[#09426d]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <MessageSquare size={13} />
                Enviar Resposta
              </button>
            </form>

          </section>
        )}

      </div>

      {/* 4. Support Warnings */}
      <section className="bg-gradient-to-r from-blue-dark/5 to-cyan-brand/5 border border-cyan-brand/20 p-4 rounded-xl flex items-start gap-3 shadow-inner">
        <div className="w-8 h-8 rounded-full bg-cyan-brand/10 text-cyan-brand flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-blue-dark flex items-center gap-1.5">
            Manual de Atendimento ao Cliente
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-yellow-warning/10 text-amber-800 border border-yellow-warning/20 rounded-full text-[9px] font-extrabold uppercase">
              <Sparkles size={8} /> SLA Prioritário
            </span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-medium">
            Todos os chamados de integração API marcados com prioridade <strong>Alta</strong> possuem SLA de atendimento de até 2 horas. Ao postar uma resposta técnica, ela será exibida em tempo real no portal <strong>Meus Chamados</strong> da respectiva editora. Seja técnico, gentil e prestativo!
          </p>
        </div>
      </section>

    </div>
  );
}
