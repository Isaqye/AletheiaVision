import React, { useState } from 'react';
import {
  UserCheck, Clock, CheckCircle2, AlertTriangle, FileText,
  ChevronRight, Eye, Activity, Shield, Star, TrendingUp,
  ArrowUpRight, Zap, Filter
} from 'lucide-react';

export default function HumanReview({ submissions, onAction, triggerToast }) {
  const pendingSubs = submissions.filter(s => s.status === 'Pendente').sort((a, b) => b.score - a.score);
  const reviewedSubs = submissions.filter(s => s.status === 'Revisado');
  const finishedSubs = submissions.filter(s => s.status === 'Finalizado');

  const [selectedSub, setSelectedSub] = useState(pendingSubs[0] || submissions[0]);
  const [decision, setDecision] = useState('confirmar');
  const [priority, setPriority] = useState('alta');
  const [justification, setJustification] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const filteredQueue = filterRisk === 'all'
    ? [...pendingSubs, ...reviewedSubs]
    : [...pendingSubs, ...reviewedSubs].filter(s => s.risk === filterRisk);

  const getRiskBadge = (risk) => {
    const styles = {
      Alto: 'bg-red-danger/10 text-red-danger border-red-danger/20',
      Médio: 'bg-yellow-warning/10 text-amber-800 border-yellow-warning/20',
      Baixo: 'bg-green-success/10 text-green-success border-green-success/20'
    };
    return styles[risk] || '';
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pendente: 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20',
      Revisado: 'bg-cyan-brand/10 text-blue-petrol border-cyan-brand/20',
      Finalizado: 'bg-green-success/10 text-green-success border-green-success/20'
    };
    return styles[status] || '';
  };

  const handleSubmitReview = () => {
    const decisionLabels = {
      confirmar: 'Suspeita confirmada',
      descartar: 'Suspeita descartada',
      nova: 'Nova análise solicitada'
    };
    const nextStatus = decision === 'nova' ? 'Pendente' : 'Finalizado';
    onAction(
      `Parecer registrado para ${selectedSub.id}: ${decisionLabels[decision]} — Prioridade: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`,
      nextStatus
    );
    setJustification('');
  };

  // Simulated analyst stats
  const analystStats = [
    { label: 'Revisões este mês', value: 87, icon: FileText, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20' },
    { label: 'Tempo médio', value: '4m12s', icon: Clock, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { label: 'Taxa de confirmação', value: '34%', icon: Shield, color: 'bg-red-danger/10 text-red-danger border-red-danger/20' },
    { label: 'Precisão do analista', value: '96.2%', icon: Star, color: 'bg-green-success/10 text-green-success border-green-success/20' },
  ];

  const renderHeatmapMini = (score) => {
    const intensity = Math.min(score, 1);
    return (
      <div className="w-full h-32 rounded-lg overflow-hidden relative" style={{ background: 'linear-gradient(145deg, #0a0a1a 0%, #111827 50%, #0f172a 100%)' }}>
        {score >= 0.7 && (
          <>
            <div className="absolute w-16 h-14 rounded-full animate-heat-pulse" style={{ top: '15%', left: '20%', background: `radial-gradient(ellipse, rgba(220,38,38,${intensity * 0.7}) 0%, transparent 70%)`, filter: 'blur(8px)' }} />
            <div className="absolute w-12 h-10 rounded-full animate-heat-pulse" style={{ top: '40%', left: '55%', background: `radial-gradient(ellipse, rgba(249,115,22,${intensity * 0.6}) 0%, transparent 70%)`, filter: 'blur(8px)', animationDelay: '0.5s' }} />
            <div className="absolute w-10 h-10 rounded-full animate-heat-pulse" style={{ top: '60%', left: '30%', background: `radial-gradient(ellipse, rgba(234,88,12,${intensity * 0.5}) 0%, transparent 70%)`, filter: 'blur(8px)', animationDelay: '1s' }} />
          </>
        )}
        {score >= 0.4 && score < 0.7 && (
          <>
            <div className="absolute w-12 h-12 rounded-full animate-heat-pulse" style={{ top: '30%', left: '25%', background: `radial-gradient(circle, rgba(245,158,11,${intensity * 0.5}) 0%, transparent 70%)`, filter: 'blur(8px)' }} />
            <div className="absolute w-10 h-10 rounded-full animate-heat-pulse" style={{ top: '50%', left: '60%', background: `radial-gradient(circle, rgba(249,115,22,${intensity * 0.4}) 0%, transparent 70%)`, filter: 'blur(8px)', animationDelay: '0.8s' }} />
          </>
        )}
        {score < 0.4 && (
          <div className="absolute w-10 h-10 rounded-full animate-heat-pulse" style={{ top: '40%', left: '45%', background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)', filter: 'blur(8px)' }} />
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
          <span className={`text-[10px] font-extrabold ${score >= 0.7 ? 'text-red-400' : score >= 0.4 ? 'text-yellow-400' : 'text-green-400'}`}>
            {Math.round(score * 100)}% similaridade
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <UserCheck size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Fila de Revisão Humana</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Parecer técnico do analista sobre detecções da IA</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-center">
            <span className="text-lg font-extrabold block">{pendingSubs.length}</span>
            <span className="text-[9px] text-cyan-brand/70 font-bold uppercase tracking-wider">Na fila</span>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-center">
            <span className="text-lg font-extrabold block">{reviewedSubs.length}</span>
            <span className="text-[9px] text-cyan-brand/70 font-bold uppercase tracking-wider">Revisados</span>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-center">
            <span className="text-lg font-extrabold block">{finishedSubs.length}</span>
            <span className="text-[9px] text-cyan-brand/70 font-bold uppercase tracking-wider">Finalizados</span>
          </div>
        </div>
      </div>

      {/* Analyst Performance Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {analystStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2 ${stat.color}`}>
                <Icon size={16} />
              </div>
              <span className="text-xl font-extrabold text-blue-dark block">{stat.value}</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
          );
        })}
      </section>

      {/* Main Grid: Queue + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Queue */}
        <section className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
              <Clock size={16} className="text-cyan-brand" />
              Fila de Revisão
            </h3>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-slate-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:border-cyan-brand"
              >
                <option value="all">Todos os riscos</option>
                <option value="Alto">Alto risco</option>
                <option value="Médio">Médio risco</option>
                <option value="Baixo">Baixo risco</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredQueue.map((sub, idx) => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all animate-fade-in-up ${
                    isSelected
                      ? 'bg-cyan-brand/5 border-cyan-brand/30 shadow-md'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-petrol">{sub.id}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getRiskBadge(sub.risk)}`}>{sub.risk}</span>
                    </div>
                    <span className={`text-xs font-extrabold ${sub.score >= 0.7 ? 'text-red-danger' : sub.score >= 0.4 ? 'text-amber-600' : 'text-green-success'}`}>
                      {sub.score.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug line-clamp-1">{sub.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] text-slate-400 font-medium">{sub.editor} · {sub.area}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${getStatusBadge(sub.status)}`}>{sub.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detail Panel */}
        <section className="xl:col-span-3 flex flex-col gap-5">
          {selectedSub && (
            <>
              {/* Submission Detail Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                    <Eye size={16} className="text-cyan-brand" />
                    Detalhes — {selectedSub.id}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(selectedSub.risk)}`}>
                    {selectedSub.classification}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Info */}
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Artigo', value: selectedSub.title },
                        { label: 'Editora', value: selectedSub.editor },
                        { label: 'Área', value: selectedSub.area },
                        { label: 'Tipo de imagem', value: selectedSub.imageType },
                        { label: 'Data submissão', value: selectedSub.submissionDate },
                        { label: 'Status atual', value: selectedSub.status },
                      ].map((field, i) => (
                        <div key={i} className={`py-1.5 ${i < 2 ? 'col-span-2' : ''}`}>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{field.label}</div>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-1">{field.value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Score bar */}
                    <div className="mt-1">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score de similaridade</div>
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-extrabold ${selectedSub.score >= 0.7 ? 'text-red-danger' : selectedSub.score >= 0.4 ? 'text-amber-600' : 'text-green-success'}`}>
                          {selectedSub.score.toFixed(2)}
                        </span>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              selectedSub.score >= 0.7 ? 'bg-gradient-to-r from-yellow-warning to-red-danger' :
                              selectedSub.score >= 0.4 ? 'bg-gradient-to-r from-green-success to-yellow-warning' :
                              'bg-gradient-to-r from-blue-400 to-green-success'
                            }`}
                            style={{ width: `${selectedSub.score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap preview */}
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mapa de calor — regiões suspeitas</div>
                    {renderHeatmapMini(selectedSub.score)}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                    <UserCheck size={16} className="text-cyan-brand" />
                    Parecer Técnico do Analista
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Decision */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Decisão</label>
                    <select
                      value={decision}
                      onChange={e => setDecision(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
                    >
                      <option value="confirmar">✅ Confirmar suspeita de fraude</option>
                      <option value="descartar">❌ Descartar suspeita (falso positivo)</option>
                      <option value="nova">🔄 Solicitar nova análise da IA</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Prioridade</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
                    >
                      <option value="critica">🔴 Crítica</option>
                      <option value="alta">🟠 Alta</option>
                      <option value="media">🟡 Média</option>
                      <option value="baixa">🟢 Baixa</option>
                    </select>
                  </div>

                  {/* Analyst */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Analista responsável</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-brand to-cyan-700 flex items-center justify-center text-[9px] font-bold text-white">IS</div>
                      <span className="text-xs font-semibold text-slate-700">Isaque Severino</span>
                    </div>
                  </div>
                </div>

                {/* Justification */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Justificativa técnica</label>
                  <textarea
                    value={justification}
                    onChange={e => setJustification(e.target.value)}
                    placeholder="Descreva sua análise técnica e a justificativa para a decisão..."
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 min-h-[80px] resize-y focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Submissão: <strong className="text-slate-600">{selectedSub.id}</strong> · Score: <strong className={selectedSub.score >= 0.7 ? 'text-red-danger' : 'text-slate-600'}>{selectedSub.score.toFixed(2)}</strong>
                  </span>
                  <button
                    onClick={handleSubmitReview}
                    className="px-6 py-2.5 bg-gradient-to-br from-blue-dark to-blue-petrol text-white text-xs font-extrabold rounded-lg cursor-pointer hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    Registrar Parecer
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
