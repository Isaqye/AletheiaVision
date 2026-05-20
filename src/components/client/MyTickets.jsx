import React, { useState } from 'react';
import { 
  Ticket, 
  PlusCircle, 
  Clock, 
  CornerDownRight, 
  Sparkles,
  Search
} from 'lucide-react';

export default function MyTickets({ tickets, onAddTicket, clientName = "Editora BioMed", triggerToast }) {
  // Filter tickets that belong to this specific client
  const clientTickets = tickets.filter(t => t.editor === clientName);

  // Form states for creating a new ticket
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Integração API');
  const [priority, setPriority] = useState('Alta');
  const [description, setDescription] = useState('');

  // Filtering states for the ticket list
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      triggerToast("Por favor, preencha todos os campos do chamado!");
      return;
    }

    onAddTicket(clientName, title, priority, description, category);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Integração API');
    setPriority('Alta');
  };

  // Filtered client tickets list
  const filteredClientTickets = clientTickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityStyle = (p) => {
    switch (p) {
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-danger/10 text-red-danger border border-red-danger/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-danger animate-ping" />
            Em fila (Aberto)
          </span>
        );
      case 'Em andamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-warning/10 text-amber-700 border border-yellow-warning/20 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-warning animate-pulse" />
            Em análise técnica
          </span>
        );
      case 'Resolvido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-success/10 text-green-success border border-green-success/20 select-none">
            Resolvido
          </span>
        );
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up">
      
      {/* Left side: Abrir Novo Chamado Form (2 columns) */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all lg:col-span-2 self-start">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-brand/10 text-cyan-brand flex items-center justify-center">
            <PlusCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-dark">Abrir Chamado Técnico</h3>
            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Suporte Direto com Desenvolvedores</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ticket-title">Assunto / Título do Problema</label>
            <input 
              id="ticket-title"
              type="text" 
              placeholder="Ex: Instabilidade no retorno do endpoint POST"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ticket-category">Categoria</label>
              <select 
                id="ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8 font-semibold"
              >
                <option value="Integração API">Integração API</option>
                <option value="Relatórios e PDF">Relatórios e PDF</option>
                <option value="Erro na Análise de Imagem (IA)">Erro na Análise (IA)</option>
                <option value="Dúvidas Editoriais">Dúvidas Editoriais</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ticket-priority">Prioridade</label>
              <select 
                id="ticket-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%2210%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8 font-semibold"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ticket-desc">Descrição Detalhada do Chamado</label>
            <textarea 
              id="ticket-desc"
              rows="5" 
              placeholder="Descreva detalhadamente o comportamento, erros exibidos no console ou dúvidas técnicas para que nossa equipe possa investigar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all resize-none leading-relaxed"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 bg-gradient-to-br from-blue-dark to-blue-petrol hover:from-[#09426d] text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Ticket size={14} />
            Enviar Chamado Técnico
          </button>
        </form>
      </section>

      {/* Right side: Seus Chamados de Suporte Table/List (3 columns) */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all lg:col-span-3">
        
        {/* Header & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-blue-dark">Histórico de Chamados</h3>
            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Acompanhamento e Respostas do Suporte</span>
          </div>

          {/* Inline filters */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar chamado..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 pl-7 py-1 text-[10px] text-slate-600 placeholder-slate-400 focus:outline-none focus:border-cyan-brand focus:ring-1 focus:ring-cyan-brand/10 transition-all"
              />
            </div>

            {/* Filter by status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] text-slate-600 focus:outline-none focus:border-cyan-brand cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%228%22%20height=%228%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222.5%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_6px_center] pr-6"
            >
              <option value="all">Todos</option>
              <option value="Aberto">Abertos</option>
              <option value="Em andamento">Em Análise</option>
              <option value="Resolvido">Resolvidos</option>
            </select>
          </div>
        </div>

        {/* Content list */}
        {filteredClientTickets.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
              <Ticket size={24} />
            </div>
            <p className="text-xs text-slate-400 font-medium">Nenhum chamado de suporte encontrado para esta busca.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredClientTickets.map((t) => (
              <div 
                key={t.id} 
                className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-4 rounded-lg transition-all flex flex-col gap-3.5"
              >
                {/* ID, Status, Priority & Date Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-blue-petrol">{t.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold border border-slate-200 select-none">
                      {t.category || 'Integração API'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border select-none ${getPriorityStyle(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{t.date}</span>
                    {getStatusBadge(t.status)}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-xs font-bold text-blue-dark leading-tight">{t.title}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5 whitespace-pre-line bg-white/40 p-2.5 rounded border border-slate-100/50">
                    {t.description}
                  </p>
                </div>

                {/* Reply Container */}
                {t.reply ? (
                  <div className="bg-cyan-brand/[0.02] border border-cyan-brand/10 p-3 rounded-md text-xs leading-relaxed text-blue-petrol mt-0.5">
                    <div className="flex items-center gap-1.5 border-b border-cyan-brand/5 pb-1 mb-1.5 select-none">
                      <CornerDownRight size={13} className="text-cyan-brand shrink-0" />
                      <span className="font-bold text-cyan-brand text-[9px] uppercase tracking-widest flex items-center gap-0.5">
                        <Sparkles size={8} className="animate-pulse" /> Resposta do Suporte Técnico
                      </span>
                    </div>
                    <p className="font-semibold text-slate-700 whitespace-pre-line">{t.reply}</p>
                  </div>
                ) : (
                  <div className="bg-slate-100/40 border border-slate-200/40 p-3 rounded-md text-xs text-slate-400 flex items-center gap-2 mt-0.5 select-none">
                    <Clock size={12} className="text-slate-300 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
                    <span className="font-semibold text-[10px]">Aguardando análise da equipe técnica da AletheiaVision IA...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
