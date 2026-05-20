import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Play, Send, Plus, Check } from 'lucide-react';

export default function EditorOnboardingDetails({ editora, onUpdateEditora, triggerToast, onOpenTicket }) {
  // Local state for the update form
  const [newStatus, setNewStatus] = useState('');
  const [nextAction, setNextAction] = useState('Agendar treinamento');
  const [responsible, setResponsible] = useState('Luan Assis');
  const [notes, setNotes] = useState(
    'Cliente já assinou contrato e enviou credenciais iniciais. Equipe técnica precisa validar integração com OJS antes do treinamento.'
  );

  useEffect(() => {
    if (editora) {
      setNewStatus(editora.status);
      // Auto adjust fields based on selected editor for realistic display
      if (editora.id === 'ED-001') {
        setResponsible('Luan Assis');
        setNextAction('Concluir integração API');
        setNotes('Cliente já assinou contrato e enviou credenciais iniciais. Equipe técnica precisa validar integração com OJS antes do treinamento.');
      } else if (editora.id === 'ED-002') {
        setResponsible('Isaque Severino');
        setNextAction('Agendar treinamento');
        setNotes('Integração com sistema de submissão manual concluída. Treinamento agendado com a equipe editorial para a próxima terça.');
      } else if (editora.id === 'ED-003') {
        setResponsible('Luan Assis');
        setNextAction('Solicitar credenciais');
        setNotes('Contrato assinado recentemente. Aguardando envio das credenciais do ScholarOne para iniciar testes de integração.');
      }
    }
  }, [editora]);

  if (!editora) return null;

  // Determine checklist values dynamically based on status for realistic visual feedback
  const getChecklistState = () => {
    const statusOrder = [
      'Lead recebido', 
      'Demo realizada', 
      'Proposta enviada', 
      'Contrato assinado', 
      'Integração API', 
      'Treinamento', 
      '30 dias de uso', 
      'Cliente ativo'
    ];
    const currentIndex = statusOrder.indexOf(editora.status);

    return {
      qualification: true, // Lead recebido / qualificacao is always done
      demo: currentIndex >= 1,
      proposal: currentIndex >= 2,
      contract: currentIndex >= 3,
      api: currentIndex >= 5, // Done after Integration API phase
      training: currentIndex >= 6, // Done after Training phase
      firstArticle: currentIndex >= 6,
      nps: currentIndex >= 7 // Done in Active phase
    };
  };

  const checklist = getChecklistState();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onUpdateEditora(editora.id, {
      status: newStatus,
      responsavelTecnico: responsible.split(' ')[0] // Keep first name for table compatibility
    });
    triggerToast(`Status da editora ${editora.nome} atualizado para "${newStatus}"!`);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Detalhes Técnicos da Editora */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-md font-bold text-blue-dark">Dados da Editora</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/10 text-blue-700 border border-blue-600/20">
              Plano Profissional
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID da Editora</div>
              <div className="text-sm font-semibold text-slate-800">{editora.id}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome da Editora</div>
              <div className="text-sm font-semibold text-slate-800">{editora.nome}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Porte</div>
              <div className="text-sm font-semibold text-slate-800">{editora.porte}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Área Científica</div>
              <div className="text-sm font-semibold text-slate-800">{editora.area}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Estimado</div>
              <div className="text-sm font-semibold text-slate-800">{editora.volume}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sistema Editorial</div>
              <div className="text-sm font-semibold text-slate-800">{editora.sistemaAtual}</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Responsável Comercial</div>
              <div className="text-sm font-semibold text-slate-800">
                {editora.responsavelComercial === 'Anthony' ? 'Anthony Quaresma' : 
                 editora.responsavelComercial === 'Gabriel' ? 'Gabriel Rodrigues' : editora.responsavelComercial}
              </div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Responsável Técnico</div>
              <div className="text-sm font-semibold text-slate-800">
                {editora.responsavelTecnico === 'Luan' ? 'Luan Assis' : 
                 editora.responsavelTecnico === 'Isaque' ? 'Isaque Severino' : editora.responsavelTecnico}
              </div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data de Entrada</div>
              <div className="text-sm font-semibold text-slate-800">03/05/2026</div>
            </div>
            <div className="py-1 border-b border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Previsão de Ativação</div>
              <div className="text-sm font-semibold text-slate-800">12/05/2026</div>
            </div>
          </div>
        </div>

        {/* NPS Info if available */}
        {editora.nps && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-green-800">Satisfação Pesquisa NPS:</span>
            <span className="text-sm font-extrabold text-green-700 bg-white px-2 py-0.5 rounded border border-green-200">{editora.nps} (Excelente)</span>
          </div>
        )}
      </section>

      {/* 2. Checklist de Implantação */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Checklist de Implantação</h3>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20">
            Acompanhamento Técnico
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 1, label: 'Formulário de qualificação', checked: checklist.qualification },
            { id: 2, label: 'Demonstração realizada', checked: checklist.demo },
            { id: 3, label: 'Proposta comercial enviada', checked: checklist.proposal },
            { id: 4, label: 'Contrato assinado', checked: checklist.contract },
            { id: 5, label: 'Integração via API concluída', checked: checklist.api },
            { id: 6, label: 'Treinamento da equipe', checked: checklist.training },
            { id: 7, label: 'Primeiro artigo analisado', checked: checklist.firstArticle },
            { id: 8, label: 'Pesquisa NPS 30 dias', checked: checklist.nps }
          ].map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                item.checked 
                  ? 'border-green-success/20 bg-green-success/[0.02] text-green-success' 
                  : 'border-slate-100 bg-slate-50/50 text-slate-500'
              }`}
            >
              {item.checked ? (
                <CheckCircle2 size={16} className="text-green-success shrink-0" />
              ) : (
                <Circle size={16} className="text-slate-300 shrink-0" />
              )}
              <span className="text-xs font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>


      {/* 4. Formulário Rápido de Atualização */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all lg:col-span-2">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Atualização do Onboarding</h3>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
            Formulário Gerencial
          </span>
        </div>
        
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-new-status">Novo status</label>
            <select 
              id="onboard-new-status" 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="Lead recebido">Lead recebido</option>
              <option value="Demo realizada">Demo realizada</option>
              <option value="Proposta enviada">Proposta enviada</option>
              <option value="Contrato assinado">Contrato assinado</option>
              <option value="Integração API">Integração API</option>
              <option value="Treinamento">Treinamento</option>
              <option value="30 dias de uso">30 dias de uso</option>
              <option value="Cliente ativo">Cliente ativo</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-next-action">Próxima ação</label>
            <select 
              id="onboard-next-action" 
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="Agendar treinamento">Agendar treinamento</option>
              <option value="Solicitar credenciais">Solicitar credenciais</option>
              <option value="Concluir integração API">Concluir integração API</option>
              <option value="Enviar pesquisa NPS">Enviar pesquisa NPS</option>
              <option value="Ativar cliente">Ativar cliente</option>
              <option value="Abrir ticket técnico">Abrir ticket técnico</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-responsible">Responsável</label>
            <select 
              id="onboard-responsible" 
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="Anthony Quaresma">Anthony Quaresma</option>
              <option value="Luan Assis">Luan Assis</option>
              <option value="Isaque Severino">Isaque Severino</option>
              <option value="Gabriel Rodrigues">Gabriel Rodrigues</option>
            </select>
          </div>

          <div className="flex flex-col md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-notes">Observação interna</label>
            <textarea 
              id="onboard-notes" 
              rows="3" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva observações sobre o andamento do processo..."
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-3 mt-2 border-t border-slate-100 pt-4">
            <button 
              type="submit"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-dark to-blue-petrol hover:from-[#08456F] hover:to-[#0C5A80] text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Check size={14} />
              Atualizar status
            </button>
            <button 
              type="button"
              onClick={() => onOpenTicket ? onOpenTicket(editora.nome) : triggerToast('Ticket de suporte aberto com sucesso!')}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-red-danger text-slate-600 hover:text-red-danger font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Plus size={14} />
              Abrir ticket
            </button>
            <button 
              type="button"
              onClick={() => triggerToast('Treinamento com equipe editorial agendado!')}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-cyan-brand text-slate-600 hover:text-cyan-brand font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Play size={14} />
              Agendar treinamento
            </button>
            <button 
              type="button"
              onClick={() => triggerToast('Pesquisa NPS enviada com sucesso!')}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-purple-500 text-slate-600 hover:text-purple-600 font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Send size={14} />
              Enviar pesquisa NPS
            </button>
            <button 
              type="button"
              onClick={() => {
                onUpdateEditora(editora.id, { status: 'Cliente ativo' });
                triggerToast(`Editora ${editora.nome} ativada como cliente!`);
              }}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-green-700 to-green-success text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Check size={14} />
              Ativar cliente
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
