import React, { useState, useEffect } from 'react';
import { downloadMockPDF } from '../utils/exportUtils';
import { Save, FileText, Bell, Check } from 'lucide-react';

export default function ReviewForm({ submission, onAction }) {
  const [decision, setDecision] = useState('');
  const [priority, setPriority] = useState('');
  const [justification, setJustification] = useState(
    'Foram identificadas regiões com padrão visual semelhante na parte superior da imagem, indicando possível duplicação local.'
  );
  const [forwarding, setForwarding] = useState('');

  // Reset or change justification when submission changes to keep it relevant
  useEffect(() => {
    if (submission.id === 'AV-001') {
      setDecision('confirm');
      setPriority('high');
      setForwarding('alert');
      setJustification('Foram identificadas regiões com padrão visual semelhante na parte superior da imagem, indicando possível duplicação local.');
    } else if (submission.id === 'AV-002') {
      setDecision('reanalyze');
      setPriority('medium');
      setForwarding('report');
      setJustification('Há suspeita de corte inadequado e ajuste local de brilho nas faixas centrais do gel.');
    } else {
      setDecision('discard');
      setPriority('low');
      setForwarding('archive');
      setJustification('Nenhum padrão anormal detectado na análise fina da imagem de fluorescência. Casos falso positivo.');
    }
  }, [submission]);

  const handleExportPDF = () => {
    if (!submission) return;
    const lines = [
      `ALETHEIAVISION - RELATORIO DE REVISAO HUMANA`,
      `ID da Submissao: ${submission.id}`,
      `Data da Submissao: ${submission.submissionDate}`,
      `--------------------------------------------------------------------------------------`,
      `INFORMACOES DO ARTIGO:`,
      `- Titulo: ${submission.title}`,
      `- Editora: ${submission.editor}`,
      `- Area: ${submission.area}`,
      `- Tipo de Imagem: ${submission.imageType}`,
      `--------------------------------------------------------------------------------------`,
      `RESULTADOS IA (AletheiaNet):`,
      `- Score de Similaridade: ${submission.score.toFixed(2)}`,
      `- Risco Inicial: ${submission.risk}`,
      `--------------------------------------------------------------------------------------`,
      `DECISAO DA REVISAO HUMANA:`,
      `- Parecer do Analista: ${decision === 'confirm' ? 'Confirmar suspeita' : decision === 'discard' ? 'Descartar suspeita' : decision === 'reanalyze' ? 'Nova analise' : 'Encaminhar ao editor'}`,
      `- Prioridade Definida: ${priority.toUpperCase()}`,
      `- Justificativa Tecnica: ${justification}`,
      `- Encaminhamento: ${forwarding}`,
      `--------------------------------------------------------------------------------------`,
      `Documento gerado para fins de demonstracao gerencial.`
    ];
    downloadMockPDF(`revisao_${submission.id.toLowerCase()}.pdf`, 'Relatorio de Revisao Tecnica', lines);
    onAction('Relatório PDF gerado com sucesso!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Formulário */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Revisão Humana</h3>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
            Formulário de decisão
          </span>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="review-decision">Decisão do analista</label>
            <select 
              id="review-decision" 
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="">Selecione uma decisão...</option>
              <option value="confirm">Confirmar suspeita</option>
              <option value="discard">Descartar suspeita</option>
              <option value="reanalyze">Solicitar nova análise</option>
              <option value="forward">Encaminhar ao editor</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="review-priority">Prioridade</label>
            <select 
              id="review-priority" 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="">Selecione a prioridade...</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="review-justification">Justificativa</label>
            <textarea 
              id="review-justification" 
              rows="3" 
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva a justificativa detalhadamente..."
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="review-forwarding">Encaminhamento</label>
            <select 
              id="review-forwarding" 
              value={forwarding}
              onChange={(e) => setForwarding(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
            >
              <option value="">Selecione o encaminhamento...</option>
              <option value="report">Gerar relatório</option>
              <option value="alert">Enviar alerta ao editor</option>
              <option value="author">Solicitar revisão ao autor</option>
              <option value="archive">Arquivar caso</option>
            </select>
          </div>
        </form>
      </section>

      {/* Botões de Ação */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-wrap gap-4 hover:shadow-md transition-all">
        <button 
          onClick={() => onAction('Revisão salva com sucesso!', 'Pendente')}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-dark to-blue-petrol hover:from-[#08456F] hover:to-[#0C5A80] text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm hover:shadow active:scale-98 transition-all"
        >
          <Save size={14} />
          Salvar revisão
        </button>
        <button 
          onClick={handleExportPDF}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-cyan-brand text-blue-petrol hover:text-cyan-brand font-semibold rounded-md text-xs cursor-pointer shadow-sm active:scale-98 transition-all"
        >
          <FileText size={14} />
          Gerar relatório PDF
        </button>
        <button 
          onClick={() => onAction('Alerta enviado ao editor!', 'Revisado')}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-orange-600 to-yellow-warning hover:shadow-orange-600/30 hover:shadow-lg text-white font-semibold rounded-md text-xs cursor-pointer active:scale-98 transition-all"
        >
          <Bell size={14} />
          Enviar alerta ao editor
        </button>
        <button 
          onClick={() => onAction('Caso marcado como finalizado!', 'Finalizado')}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-green-700 to-green-success hover:shadow-green-success/30 hover:shadow-lg text-white font-semibold rounded-md text-xs cursor-pointer active:scale-98 transition-all"
        >
          <Check size={14} />
          Marcar como finalizado
        </button>
      </section>
    </div>
  );
}
