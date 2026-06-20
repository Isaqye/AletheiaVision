import React, { useState, useEffect } from 'react';
import { downloadMockPDF } from '../../utils/exportUtils';
import {
  UploadCloud, FileText, CheckCircle2, AlertTriangle, Clock,
  Image, Zap, ChevronRight, Eye, Shield, Activity, XCircle,
  ArrowRight, Sparkles
} from 'lucide-react';

export default function ClientSubmit({ clientSubmissions, triggerToast }) {
  const [step, setStep] = useState('form'); // form, analyzing, result
  const [formData, setFormData] = useState({
    title: '',
    area: 'Oncologia',
    imageType: 'Microscopia',
    fileName: '',
  });
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleExportPDF = () => {
    if (!analysisResult) return;
    const lines = [
      `ALETHEIAVISION IA - LAUDO TECNICO DE INTEGRIDADE`,
      `ID da Submissao: ${analysisResult.id}`,
      `Data do Exame: ${analysisResult.date}`,
      `--------------------------------------------------------------------------------------`,
      `DADOS DO ARTIGO ANALISADO:`,
      `- Titulo do Artigo: ${analysisResult.title}`,
      `- Area Cientifica: ${analysisResult.area}`,
      `- Tipo de Imagem Scaneada: ${analysisResult.imageType}`,
      `--------------------------------------------------------------------------------------`,
      `RESULTADOS DO MAPEAMENTO IA (AletheiaNet v3.1):`,
      `- Score de Similaridade: ${analysisResult.score.toFixed(2)}`,
      `- Nivel de Risco: ${analysisResult.risk.toUpperCase()}`,
      `--------------------------------------------------------------------------------------`,
      `PARECER AUTOMATICO DO SISTEMA:`,
      analysisResult.risk === 'Alto' 
        ? `- Identificada forte suspeita de duplicacao ou adulteracao local de padroes visuais.`
        : analysisResult.risk === 'Médio'
        ? `- Identificadas regioes com alteracoes ou cortes que requerem inspecao manual.`
        : `- Sem indicativos significativos de adulteracao ou anomalias estruturais.`,
      `--------------------------------------------------------------------------------------`,
      `Este documento e um demonstrativo gerado pelo Portal da Editora Cliente.`
    ];
    downloadMockPDF(`laudo_${analysisResult.id.toLowerCase()}.pdf`, 'Laudo de Integridade Cientifica', lines);
    triggerToast('Relatorio da analise exportado em PDF com sucesso!');
  };

  // Simulated analysis steps
  const analysisSteps = [
    { pct: 15, label: 'Recebendo arquivo de imagem...' },
    { pct: 30, label: 'Pré-processando imagem...' },
    { pct: 45, label: 'Executando modelo AletheiaNet v3.1...' },
    { pct: 60, label: 'Analisando padrões de duplicação...' },
    { pct: 75, label: 'Verificando similaridade com banco de dados...' },
    { pct: 90, label: 'Gerando mapa de calor...' },
    { pct: 100, label: 'Análise concluída!' },
  ];

  const handleSubmit = () => {
    if (!formData.title) {
      triggerToast('Por favor, preencha o título do artigo.');
      return;
    }
    setStep('analyzing');
    setProgress(0);

    // Simulate progress
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < analysisSteps.length) {
        setProgress(analysisSteps[stepIdx].pct);
        stepIdx++;
      } else {
        clearInterval(interval);
        // Generate random result
        const score = (Math.random() * 0.7 + 0.15).toFixed(2);
        const risk = parseFloat(score) >= 0.7 ? 'Alto' : parseFloat(score) >= 0.4 ? 'Médio' : 'Baixo';
        setAnalysisResult({
          id: `AV-${(clientSubmissions.length + 13).toString().padStart(3, '0')}`,
          title: formData.title,
          area: formData.area,
          imageType: formData.imageType,
          score: parseFloat(score),
          risk,
          date: new Date().toLocaleDateString('pt-BR'),
        });
        setStep('result');
      }
    }, 800);
  };

  const handleReset = () => {
    setStep('form');
    setFormData({ title: '', area: 'Oncologia', imageType: 'Microscopia', fileName: '' });
    setProgress(0);
    setAnalysisResult(null);
  };

  const currentStepLabel = analysisSteps.find(s => s.pct >= progress)?.label || 'Processando...';

  const renderHeatmapResult = (score) => {
    return (
      <div className="w-full h-48 rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(145deg, #0a0a1a 0%, #111827 50%, #0f172a 100%)' }}>
        {score >= 0.7 && (
          <>
            <div className="absolute w-20 h-16 rounded-full animate-heat-pulse" style={{ top: '10%', left: '15%', background: `radial-gradient(ellipse, rgba(220,38,38,0.7) 0%, rgba(249,115,22,0.3) 50%, transparent 70%)`, filter: 'blur(10px)' }} />
            <div className="absolute w-16 h-14 rounded-full animate-heat-pulse" style={{ top: '30%', left: '55%', background: `radial-gradient(ellipse, rgba(249,115,22,0.6) 0%, transparent 70%)`, filter: 'blur(10px)', animationDelay: '0.5s' }} />
            <div className="absolute w-14 h-12 rounded-full animate-heat-pulse" style={{ top: '55%', left: '35%', background: `radial-gradient(ellipse, rgba(234,88,12,0.5) 0%, transparent 70%)`, filter: 'blur(10px)', animationDelay: '1s' }} />
            <div className="absolute w-12 h-12 rounded-full animate-heat-pulse" style={{ top: '45%', left: '70%', background: `radial-gradient(ellipse, rgba(220,38,38,0.5) 0%, transparent 70%)`, filter: 'blur(10px)', animationDelay: '1.5s' }} />
          </>
        )}
        {score >= 0.4 && score < 0.7 && (
          <>
            <div className="absolute w-16 h-14 rounded-full animate-heat-pulse" style={{ top: '25%', left: '20%', background: `radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)`, filter: 'blur(10px)' }} />
            <div className="absolute w-14 h-12 rounded-full animate-heat-pulse" style={{ top: '50%', left: '55%', background: `radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)`, filter: 'blur(10px)', animationDelay: '0.8s' }} />
          </>
        )}
        {score < 0.4 && (
          <div className="absolute w-12 h-12 rounded-full animate-heat-pulse" style={{ top: '40%', left: '45%', background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)', filter: 'blur(10px)' }} />
        )}
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(0,184,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,200,0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] text-cyan-brand/60 font-mono">AletheiaNet v3.1</span>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${score >= 0.7 ? 'bg-red-900/80 text-red-300' : score >= 0.4 ? 'bg-amber-900/80 text-amber-300' : 'bg-green-900/80 text-green-300'}`}>
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
            <UploadCloud size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Análise de Imagem por IA</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Submeta artigos para verificação de integridade científica</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-brand" />
          <span className="text-[10px] font-bold text-cyan-brand uppercase tracking-wider">Powered by AletheiaNet v3.1</span>
        </div>
      </div>

      {/* ─── STEP 1: FORM ─── */}
      {step === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-all animate-fade-in-up">
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <FileText size={16} className="text-cyan-brand" />
              <h3 className="text-sm font-bold text-blue-dark">Submeter Novo Artigo</h3>
            </div>

            <div className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Título do artigo *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Expressão celular em tecidos tumorais"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Area + Image Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Área científica</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
                  >
                    <option value="Oncologia">Oncologia</option>
                    <option value="Genética">Genética</option>
                    <option value="Microbiologia">Microbiologia</option>
                    <option value="Biomédica">Biomédica</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Tipo de imagem</label>
                  <select
                    value={formData.imageType}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageType: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all"
                  >
                    <option value="Microscopia">Microscopia</option>
                    <option value="Eletroforese">Eletroforese</option>
                    <option value="Fluorescência">Fluorescência</option>
                    <option value="Ressonância">Ressonância</option>
                  </select>
                </div>
              </div>

              {/* File Upload (simulated) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Arquivo de imagem</label>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-cyan-brand/50 hover:bg-cyan-brand/5 transition-all cursor-pointer group"
                  onClick={() => setFormData(prev => ({ ...prev, fileName: `fig_${formData.area.toLowerCase()}_${Date.now()}.png` }))}
                >
                  {formData.fileName ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-green-success/10 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-green-success" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{formData.fileName}</span>
                      <span className="text-[10px] text-slate-400">2.4 MB — PNG</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-cyan-brand/10 transition-all">
                        <UploadCloud size={24} className="text-slate-400 group-hover:text-cyan-brand transition-all" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">Clique para selecionar arquivo</span>
                      <span className="text-[10px] text-slate-400">PNG, TIFF, JPEG — Até 50MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-gradient-to-r from-blue-dark to-blue-petrol text-white text-sm font-extrabold rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-dark/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Iniciar Análise de Integridade
              </button>
            </div>
          </section>

          {/* Recent History */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Clock size={16} className="text-cyan-brand" />
              <h3 className="text-sm font-bold text-blue-dark">Análises Recentes</h3>
            </div>
            <div className="flex flex-col gap-2">
              {clientSubmissions.slice(0, 5).map((sub, idx) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-blue-petrol">{sub.id}</span>
                    <span className="text-[11px] text-slate-600 font-medium truncate">{sub.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-xs font-extrabold ${sub.score >= 0.7 ? 'text-red-danger' : sub.score >= 0.4 ? 'text-amber-600' : 'text-green-success'}`}>
                      {sub.score.toFixed(2)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                      sub.risk === 'Alto' ? 'bg-red-danger/10 text-red-danger border-red-danger/20' :
                      sub.risk === 'Médio' ? 'bg-yellow-warning/10 text-amber-700 border-yellow-warning/20' :
                      'bg-green-success/10 text-green-success border-green-success/20'
                    }`}>{sub.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ─── STEP 2: ANALYZING ─── */}
      {step === 'analyzing' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-brand to-blue-petrol flex items-center justify-center shadow-lg shadow-cyan-brand/20 mb-6 animate-pulse-glow">
            <Activity size={36} className="text-white" />
          </div>
          <h3 className="text-lg font-extrabold text-blue-dark mb-2">Analisando imagem...</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">{currentStepLabel}</p>

          {/* Progress bar */}
          <div className="w-full max-w-md mb-4">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-brand to-blue-petrol transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400 font-medium">Progresso</span>
              <span className="text-xs font-extrabold text-blue-dark">{progress}%</span>
            </div>
          </div>

          {/* Processing steps visualization */}
          <div className="w-full max-w-md flex flex-col gap-2 mt-4">
            {analysisSteps.map((as, idx) => {
              const isDone = progress >= as.pct;
              const isCurrent = progress < as.pct && (idx === 0 || progress >= analysisSteps[idx - 1].pct);
              return (
                <div key={idx} className={`flex items-center gap-3 transition-all duration-300 ${isDone ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-green-success' : isCurrent ? 'bg-cyan-brand animate-live-pulse' : 'bg-slate-200'}`}>
                    {isDone ? <CheckCircle2 size={12} className="text-white" /> : <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-[11px] font-medium ${isDone ? 'text-slate-700' : isCurrent ? 'text-cyan-brand font-bold' : 'text-slate-400'}`}>{as.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── STEP 3: RESULT ─── */}
      {step === 'result' && analysisResult && (
        <div className="flex flex-col gap-6 animate-fade-in-up">
          {/* Result Banner */}
          <div className={`rounded-xl p-6 flex items-center justify-between shadow-lg ${
            analysisResult.risk === 'Alto'
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
              : analysisResult.risk === 'Médio'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
          }`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                {analysisResult.risk === 'Alto' ? <AlertTriangle size={28} /> :
                 analysisResult.risk === 'Médio' ? <Eye size={28} /> :
                 <Shield size={28} />}
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {analysisResult.risk === 'Alto' ? 'Suspeita de manipulação detectada' :
                   analysisResult.risk === 'Médio' ? 'Regiões de atenção identificadas' :
                   'Nenhuma irregularidade significativa'}
                </h3>
                <p className="text-sm font-medium mt-0.5 opacity-80">
                  Score de similaridade: <strong>{analysisResult.score.toFixed(2)}</strong> — Classificação: <strong>{analysisResult.risk} risco</strong>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <span className="text-3xl font-extrabold block">{Math.round(analysisResult.score * 100)}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Similaridade</span>
              </div>
            </div>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Info */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <FileText size={16} className="text-cyan-brand" />
                <h3 className="text-sm font-bold text-blue-dark">Detalhes da Análise</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: 'ID da Submissão', v: analysisResult.id },
                  { l: 'Área', v: analysisResult.area },
                  { l: 'Tipo de imagem', v: analysisResult.imageType },
                  { l: 'Data', v: analysisResult.date },
                ].map((f, i) => (
                  <div key={i} className="py-1.5 border-b border-slate-50">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{f.l}</div>
                    <div className="text-xs font-semibold text-slate-800">{f.v}</div>
                  </div>
                ))}
                <div className="col-span-2 py-1.5">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Título</div>
                  <div className="text-xs font-semibold text-slate-800">{analysisResult.title}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score de similaridade</div>
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-extrabold ${analysisResult.score >= 0.7 ? 'text-red-danger' : analysisResult.score >= 0.4 ? 'text-amber-600' : 'text-green-success'}`}>
                      {analysisResult.score.toFixed(2)}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          analysisResult.score >= 0.7 ? 'bg-gradient-to-r from-yellow-warning to-red-danger' :
                          analysisResult.score >= 0.4 ? 'bg-gradient-to-r from-green-success to-yellow-warning' :
                          'bg-gradient-to-r from-blue-400 to-green-success'
                        }`}
                        style={{ width: `${analysisResult.score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Heatmap */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Eye size={16} className="text-cyan-brand" />
                <h3 className="text-sm font-bold text-blue-dark">Mapa de Calor — Regiões Suspeitas</h3>
              </div>
              {renderHeatmapResult(analysisResult.score)}
            </section>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:border-cyan-brand hover:bg-cyan-brand/5 active:scale-95 transition-all flex items-center gap-2"
            >
              <ArrowRight size={14} className="rotate-180" />
              Nova Submissão
            </button>
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-dark to-blue-petrol text-white text-xs font-extrabold rounded-xl cursor-pointer hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <FileText size={14} />
              Exportar Relatório PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
