import React, { useState } from 'react';
import { downloadMockPDF, downloadMockCSV } from '../utils/exportUtils';
import { BarChart2, PieChart, TrendingUp, FileText, Users, AlertTriangle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Download, Target, DollarSign, Activity, Zap, Shield, Lightbulb, Award, Layers, Eye, BriefcaseBusiness, ChevronRight, ArrowRight, Mail, Crosshair, FileSignature, Plug, GraduationCap, CircleCheckBig, Building, Building2, Landmark, ShieldCheck, Rocket, OctagonAlert } from 'lucide-react';

// Mini sparkline component for trend visualization
function Sparkline({ data, color = '#00E5CC', height = 32, width = 80 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="shrink-0">
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#','')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Gauge component for percentages
function GaugeChart({ value, maxValue = 100, label, color = '#00E5CC', size = 100 }) {
  const pct = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="38" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="38" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-blue-dark">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 font-semibold text-center leading-tight">{label}</span>
    </div>
  );
}

export default function Reports({ submissions, editoras, triggerToast }) {
  const [activeTab, setActiveTab] = useState('executive');

  // ─── Submission Metrics ───
  const totalSubmissions = submissions.length;
  const highRisk = submissions.filter(s => s.risk === 'Alto').length;
  const mediumRisk = submissions.filter(s => s.risk === 'Médio').length;
  const lowRisk = submissions.filter(s => s.risk === 'Baixo').length;
  const pending = submissions.filter(s => s.status === 'Pendente').length;
  const reviewed = submissions.filter(s => s.status === 'Revisado').length;
  const finished = submissions.filter(s => s.status === 'Finalizado').length;
  const avgScore = (submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions).toFixed(2);

  // By area
  const areas = ['Oncologia', 'Genética', 'Microbiologia', 'Biomédica'];
  const byArea = areas.map(area => ({
    name: area,
    count: submissions.filter(s => s.area === area).length,
    avgScore: submissions.filter(s => s.area === area).length > 0
      ? (submissions.filter(s => s.area === area).reduce((acc, s) => acc + s.score, 0) / submissions.filter(s => s.area === area).length).toFixed(2)
      : '0.00'
  }));

  // By editor
  const editors = [...new Set(submissions.map(s => s.editor))];
  const byEditor = editors.map(editor => ({
    name: editor,
    count: submissions.filter(s => s.editor === editor).length,
    highRisk: submissions.filter(s => s.editor === editor && s.risk === 'Alto').length
  }));

  // By image type
  const imageTypes = [...new Set(submissions.map(s => s.imageType))];
  const byImageType = imageTypes.map(type => ({
    name: type,
    count: submissions.filter(s => s.imageType === type).length
  }));

  // ─── Onboarding Metrics ───
  const totalEditoras = editoras.length;
  const pipelineStages = ['Lead recebido', 'Demo realizada', 'Contrato assinado', 'Integração API', 'Treinamento', 'Cliente ativo'];
  const byStage = pipelineStages.map(stage => ({
    name: stage,
    count: editoras.filter(e => e.status === stage).length
  }));
  const activeClients = editoras.filter(e => e.status === 'Cliente ativo').length;
  const avgNps = editoras.filter(e => e.nps !== null).length > 0
    ? Math.round(editoras.filter(e => e.nps !== null).reduce((acc, e) => acc + e.nps, 0) / editoras.filter(e => e.nps !== null).length)
    : 0;

  const byPorte = ['Pequena', 'Média', 'Grande'].map(porte => ({
    name: porte,
    count: editoras.filter(e => e.porte === porte).length
  }));

  const byAreaEditora = areas.map(area => ({
    name: area,
    count: editoras.filter(e => e.area === area).length
  }));

  // ─── Derived Executive Metrics ───
  const conversionRate = totalEditoras > 0 ? ((activeClients / totalEditoras) * 100).toFixed(0) : 0;
  const totalVolume = editoras.reduce((acc, e) => acc + parseInt(e.volume), 0);
  const activeVolume = editoras.filter(e => e.status === 'Cliente ativo').reduce((acc, e) => acc + parseInt(e.volume), 0);
  const pipelineVolume = totalVolume - activeVolume;
  const revenuePerArticle = 2.50; // R$ per analysis
  const currentMRR = (activeVolume * revenuePerArticle).toFixed(0);
  const projectedMRR = (totalVolume * revenuePerArticle).toFixed(0);
  const efficiencyRate = totalSubmissions > 0 ? ((finished / totalSubmissions) * 100).toFixed(0) : 0;
  const avgProcessingDays = 2.3; // simulated
  const slaCompliance = 94; // simulated %
  const riskDetectionRate = totalSubmissions > 0 ? ((highRisk / totalSubmissions) * 100).toFixed(0) : 0;
  const churnRisk = editoras.filter(e => e.nps !== null && e.nps < 50).length;

  // ─── Fake trend data for sparklines ───
  const submissionTrend = [5, 7, 6, 9, 8, 11, 12];
  const revenueTrend = [800, 1100, 950, 1300, 1500, 1700, 1525];
  const efficiencyTrend = [65, 70, 68, 75, 78, 82, 83];
  const riskTrend = [40, 35, 38, 30, 33, 28, 25];
  const npsTrend = [72, 78, 75, 80, 85, 87, 87];

  const maxBarCount = Math.max(...byArea.map(a => a.count), 1);
  const maxEditorCount = Math.max(...byEditor.map(e => e.count), 1);
  const maxStageCount = Math.max(...byStage.map(s => s.count), 1);

  const areaColors = {
    'Oncologia': { bg: 'bg-red-danger/15', bar: 'bg-gradient-to-r from-red-500 to-red-400', text: 'text-red-600', hex: '#DC2626' },
    'Genética': { bg: 'bg-purple-500/15', bar: 'bg-gradient-to-r from-purple-500 to-purple-400', text: 'text-purple-600', hex: '#8B5CF6' },
    'Microbiologia': { bg: 'bg-green-success/15', bar: 'bg-gradient-to-r from-green-500 to-green-400', text: 'text-green-600', hex: '#16A34A' },
    'Biomédica': { bg: 'bg-cyan-brand/15', bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400', text: 'text-cyan-600', hex: '#00E5CC' },
  };

  const stageColors = [
    'bg-gradient-to-r from-slate-400 to-slate-300',
    'bg-gradient-to-r from-blue-400 to-blue-300',
    'bg-gradient-to-r from-purple-500 to-purple-400',
    'bg-gradient-to-r from-yellow-500 to-yellow-400',
    'bg-gradient-to-r from-cyan-brand to-cyan-400',
    'bg-gradient-to-r from-green-500 to-green-400',
  ];

  const tabs = [
    { id: 'executive', label: 'Visão Executiva', icon: BriefcaseBusiness },
    { id: 'analysis', label: 'Análise de Imagens', icon: BarChart2 },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'insights', label: 'Insights Estratégicos', icon: Lightbulb },
  ];

  const handleExportPDF = () => {
    const lines = [
      `ALETHEIAVISION - RELATORIO GERENCIAL CONSOLIDADO`,
      `Foco de Analise: Performance e Onboarding`,
      `--------------------------------------------------------------------------------------`,
      `METRICAS DE ANALISE DE IMAGEM:`,
      `- Total de submissoes no sistema: ${totalSubmissions}`,
      `- Score medio de risco de fraude: ${avgScore}`,
      `- Submissoes pendentes de analise: ${pending}`,
      `- Submissoes ja revisadas: ${reviewed}`,
      `- Submissoes finalizadas: ${finished}`,
      `- Taxa de deteccao de alto risco: ${riskDetectionRate}%`,
      `--------------------------------------------------------------------------------------`,
      `DISTRIBUICAO DE RISCOS IDENTIFICADOS:`,
      `- Casos de ALTO RISCO: ${highRisk} (${((highRisk / totalSubmissions) * 100).toFixed(0)}%)`,
      `- Casos de MEDIO RISCO: ${mediumRisk} (${((mediumRisk / totalSubmissions) * 100).toFixed(0)}%)`,
      `- Casos de BAIXO RISCO: ${lowRisk} (${((lowRisk / totalSubmissions) * 100).toFixed(0)}%)`,
      `--------------------------------------------------------------------------------------`,
      `METRICAS DE ONBOARDING COMERCIAL:`,
      `- Total de editoras parceiras: ${totalEditoras}`,
      `- Clientes com onboarding ativo: ${activeClients}`,
      `- Volume mensal processado: ${activeVolume} artigos`,
      `- MRR recorrente estimado: R$ ${Number(currentMRR).toLocaleString('pt-BR')}`,
      `- NPS medio geral das editoras: ${avgNps} / 100`,
      `- SLA de cumprimento de prazos: ${slaCompliance}%`,
      `--------------------------------------------------------------------------------------`,
      `AletheiaVision Core v3.1 - Relatorio demonstrativo oficial.`
    ];
    downloadMockPDF('relatorio_central_gerencial.pdf', 'Central de Relatorios Gerenciais', lines);
    if (triggerToast) {
      triggerToast('Relatorio PDF gerado e baixado com sucesso!');
    }
  };

  const handleExportPowerBI = () => {
    const headers = ['ID Editora', 'Nome Editora', 'Porte', 'Volume', 'Area Cientifica', 'Sistema Atual', 'Status Onboarding', 'Responsavel Comercial', 'Responsavel Tecnico', 'NPS'];
    const rows = editoras.map(ed => [
      ed.id,
      ed.nome,
      ed.porte,
      ed.volume,
      ed.area,
      ed.sistemaAtual,
      ed.status,
      ed.responsavelComercial,
      ed.responsavelTecnico,
      ed.nps !== null ? ed.nps : 'N/A'
    ]);
    downloadMockCSV('onboarding_dataset_powerbi.csv', headers, rows);
    if (triggerToast) {
      triggerToast('Dataset exportado no formato CSV para ingestao no Power BI!');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <BarChart2 size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Central de Relatórios Gerenciais</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Inteligência de dados para decisões estratégicas da AletheiaVision</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={handleExportPowerBI}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-extrabold text-xs rounded-lg cursor-pointer hover:bg-white/20 active:scale-95 transition-all border border-white/20"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="6" height="18" rx="1" />
              <rect x="9" y="8" width="6" height="13" rx="1" />
              <rect x="16" y="5" width="6" height="16" rx="1" />
            </svg>
            Exportar Power BI
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-brand text-blue-dark font-extrabold text-xs rounded-lg cursor-pointer hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-brand/30"
          >
            <Download size={15} />
            Exportar PDF
          </button>
        </div>
      </div>


      {/* Tab Switcher */}
      <div className="flex bg-white rounded-xl border border-slate-200/80 p-1.5 shadow-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-dark to-blue-petrol text-white shadow-md'
                  : 'text-slate-500 hover:text-blue-petrol hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════ TAB: VISÃO EXECUTIVA ═══════════ */}
      {activeTab === 'executive' && (
        <>
          {/* Executive Summary Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-dark to-blue-petrol rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Eye size={16} className="text-cyan-brand" />
                <span className="text-[10px] font-bold text-cyan-brand uppercase tracking-widest">Resumo Executivo — Junho 2026</span>
              </div>
              <h2 className="text-lg font-extrabold mb-4">Visão Consolidada do Negócio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-cyan-brand/70 font-semibold uppercase tracking-wider">Receita Recorrente (MRR)</span>
                    <Sparkline data={revenueTrend} color="#00E5CC" width={60} height={24} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold">R$ {Number(currentMRR).toLocaleString('pt-BR')}</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-400">
                      <ArrowUpRight size={10} />+23%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Potencial total: R$ {Number(projectedMRR).toLocaleString('pt-BR')}/mês</span>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-cyan-brand/70 font-semibold uppercase tracking-wider">Volume Processado</span>
                    <Sparkline data={submissionTrend} color="#8B5CF6" width={60} height={24} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold">{activeVolume.toLocaleString('pt-BR')}</span>
                    <span className="text-xs text-slate-400">análises/mês</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Pipeline potencial: +{pipelineVolume.toLocaleString('pt-BR')} análises/mês</span>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-cyan-brand/70 font-semibold uppercase tracking-wider">Satisfação (NPS)</span>
                    <Sparkline data={npsTrend} color="#16A34A" width={60} height={24} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold ${avgNps >= 80 ? 'text-green-400' : avgNps >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{avgNps}</span>
                    <span className="text-xs text-slate-400">NPS médio</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{avgNps >= 80 ? 'Zona de Excelência' : avgNps >= 50 ? 'Zona de Melhoria' : 'Zona Crítica'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic KPIs Row */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: Target, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', trend: '+5pp', up: true, desc: 'Lead → Cliente ativo' },
              { label: 'Eficiência Operacional', value: `${efficiencyRate}%`, icon: Activity, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20', trend: '+12%', up: true, desc: 'Análises finalizadas' },
              { label: 'SLA de Entrega', value: `${slaCompliance}%`, icon: Shield, color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20', trend: '+2%', up: true, desc: 'Dentro do prazo' },
              { label: 'Tempo Médio', value: `${avgProcessingDays}d`, icon: Clock, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', trend: '-0.5d', up: true, desc: 'Processamento' },
              { label: 'Exposição a Risco', value: `${riskDetectionRate}%`, icon: AlertTriangle, color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20', trend: '-3%', up: true, desc: 'Detecção alto risco' },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${kpi.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className={`flex items-center gap-0.5 text-[9px] font-bold ${kpi.up ? 'text-green-success' : 'text-red-danger'}`}>
                      {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {kpi.trend}
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-blue-dark block">{kpi.value}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{kpi.label}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{kpi.desc}</span>
                </div>
              );
            })}
          </section>

          {/* Performance Gauges + Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Gauges */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <Award size={16} className="text-cyan-brand" />
                  Indicadores de Performance
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">Metas trimestrais</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <GaugeChart value={parseInt(conversionRate)} label="Conversão Pipeline" color="#16A34A" size={90} />
                <GaugeChart value={parseInt(efficiencyRate)} label="Eficiência Análise" color="#00E5CC" size={90} />
                <GaugeChart value={slaCompliance} label="Compliance SLA" color="#8B5CF6" size={90} />
                <GaugeChart value={avgNps} label="Satisfação NPS" color={avgNps >= 80 ? '#16A34A' : '#F59E0B'} size={90} />
              </div>
            </section>

            {/* Revenue by Client Size */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <DollarSign size={16} className="text-cyan-brand" />
                  Receita Potencial por Porte
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">Projeção mensal</span>
              </div>
              <div className="flex flex-col gap-4">
                {['Grande', 'Média', 'Pequena'].map((porte, idx) => {
                  const eds = editoras.filter(e => e.porte === porte);
                  const vol = eds.reduce((acc, e) => acc + parseInt(e.volume), 0);
                  const rev = vol * revenuePerArticle;
                  const pctOfTotal = totalVolume > 0 ? ((vol / totalVolume) * 100).toFixed(0) : 0;
                  const barColors = ['bg-gradient-to-r from-purple-600 to-purple-400', 'bg-gradient-to-r from-cyan-brand to-cyan-400', 'bg-gradient-to-r from-blue-400 to-blue-300'];
                  return (
                    <div key={porte} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">{porte}</span>
                          <span className="text-[9px] text-slate-400 font-medium">({eds.length} editora{eds.length !== 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-medium">{vol.toLocaleString('pt-BR')} análises</span>
                          <span className="text-xs font-extrabold text-blue-dark">R$ {rev.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[idx]}`}
                          style={{ width: `${pctOfTotal}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium mt-0.5 block text-right">{pctOfTotal}% do volume total</span>
                    </div>
                  );
                })}
                <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Receita Total Projetada</span>
                  <span className="text-lg font-extrabold text-blue-dark">R$ {Number(projectedMRR).toLocaleString('pt-BR')}<span className="text-[10px] text-slate-400 font-medium">/mês</span></span>
                </div>
              </div>
            </section>
          </div>

          {/* Pipeline Health & Risk Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Health */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <Layers size={16} className="text-cyan-brand" />
                  Saúde do Pipeline Comercial
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {byStage.map((stage, idx) => {
                  const isActive = stage.name === 'Cliente ativo';
                  const StageIcons = [Mail, Crosshair, FileSignature, Plug, GraduationCap, CircleCheckBig];
                  const stageIconColors = ['text-slate-500', 'text-blue-500', 'text-purple-500', 'text-yellow-600', 'text-cyan-brand', 'text-green-500'];
                  const StageIcon = StageIcons[idx];
                  return (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
                      <div className={`w-8 h-8 rounded-lg ${isActive ? 'bg-green-100' : 'bg-white'} border ${isActive ? 'border-green-200' : 'border-slate-200'} flex items-center justify-center shrink-0`}>
                        <StageIcon size={16} className={isActive ? 'text-green-600' : stageIconColors[idx]} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isActive ? 'text-green-700' : 'text-slate-700'}`}>{stage.name}</span>
                          <span className={`text-sm font-extrabold ${isActive ? 'text-green-600' : 'text-blue-dark'}`}>{stage.count}</span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${stageColors[idx]}`}
                            style={{ width: stage.count > 0 ? `${Math.max((stage.count / maxStageCount) * 100, 12)}%` : '0%' }}
                          />
                        </div>
                      </div>
                      {idx < pipelineStages.length - 1 && (
                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Cross-Area Performance Matrix */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <Target size={16} className="text-cyan-brand" />
                  Matriz de Performance por Área
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">Submissões × Editoras</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      <th className="px-3 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
                      <th className="px-3 py-2.5 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Submissões</th>
                      <th className="px-3 py-2.5 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editoras</th>
                      <th className="px-3 py-2.5 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Score Médio</th>
                      <th className="px-3 py-2.5 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Índice Risco</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {areas.map((area, idx) => {
                      const areaSubs = submissions.filter(s => s.area === area);
                      const areaEds = editoras.filter(e => e.area === area);
                      const areaHighRisk = areaSubs.filter(s => s.risk === 'Alto').length;
                      const areaRiskIdx = areaSubs.length > 0 ? ((areaHighRisk / areaSubs.length) * 100).toFixed(0) : 0;
                      const areaAvg = areaSubs.length > 0
                        ? (areaSubs.reduce((acc, s) => acc + s.score, 0) / areaSubs.length).toFixed(2)
                        : '0.00';
                      return (
                        <tr key={area} className="hover:bg-slate-50/70 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${areaColors[area]?.bar}`} />
                              <span className="text-xs font-semibold text-slate-700">{area}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center text-xs font-extrabold text-blue-dark">{areaSubs.length}</td>
                          <td className="px-3 py-3 text-center text-xs font-bold text-slate-600">{areaEds.length}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-extrabold ${parseFloat(areaAvg) >= 0.7 ? 'text-red-danger' : parseFloat(areaAvg) >= 0.4 ? 'text-amber-600' : 'text-green-success'}`}>{areaAvg}</span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              parseInt(areaRiskIdx) >= 50 ? 'bg-red-danger/10 text-red-danger' :
                              parseInt(areaRiskIdx) >= 25 ? 'bg-yellow-warning/10 text-amber-700' :
                              'bg-green-success/10 text-green-success'
                            }`}>{areaRiskIdx}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Team Workload & Accountability */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <Users size={16} className="text-cyan-brand" />
                Carga de Trabalho por Responsável
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Distribuição de contas</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Anthony', 'Gabriel', 'Luan', 'Isaque'].map((person, idx) => {
                const comercial = editoras.filter(e => e.responsavelComercial === person);
                const tecnico = editoras.filter(e => e.responsavelTecnico === person);
                const total = new Set([...comercial.map(e => e.id), ...tecnico.map(e => e.id)]).size;
                const activeCount = [...new Set([...comercial, ...tecnico].filter(e => e.status === 'Cliente ativo'))].length;
                const personColors = ['from-blue-500 to-indigo-500', 'from-emerald-500 to-green-500', 'from-purple-500 to-violet-500', 'from-amber-500 to-orange-500'];
                return (
                  <div key={person} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${personColors[idx]} flex items-center justify-center shadow-md`}>
                        <span className="text-sm font-extrabold text-white">{person.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">{person}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{total} editora{total !== 1 ? 's' : ''} sob responsabilidade</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                        <span className="text-lg font-extrabold text-blue-dark block">{comercial.length}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Comercial</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                        <span className="text-lg font-extrabold text-blue-dark block">{tecnico.length}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Técnico</span>
                      </div>
                    </div>
                    {activeCount > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-green-success" />
                        <span className="text-[9px] text-green-600 font-semibold">{activeCount} cliente{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ═══════════ TAB: ANÁLISE DE IMAGENS ═══════════ */}
      {activeTab === 'analysis' && (
        <>
          {/* KPIs Row */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total de Submissões', value: totalSubmissions, icon: FileText, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20', trend: '+18%', up: true },
              { label: 'Score Médio de Risco', value: avgScore, icon: AlertTriangle, color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20', trend: '-5%', up: false },
              { label: 'Análises Concluídas', value: finished, icon: CheckCircle2, color: 'bg-green-success/10 text-green-success border-green-success/20', trend: '+12%', up: true },
              { label: 'Em Revisão', value: pending + reviewed, icon: Clock, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', trend: '+8%', up: true },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${kpi.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${kpi.up ? 'text-green-success' : 'text-red-danger'}`}>
                      {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {kpi.trend}
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-blue-dark block">{kpi.value}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
              );
            })}
          </section>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution by Area */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <PieChart size={16} className="text-cyan-brand" />
                  Distribuição por Área Científica
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">{totalSubmissions} submissões</span>
              </div>
              <div className="flex flex-col gap-4">
                {byArea.map((area, idx) => (
                  <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${areaColors[area.name]?.bar || 'bg-slate-400'}`} />
                        <span className="text-xs font-semibold text-slate-700">{area.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-medium">Score médio: {area.avgScore}</span>
                        <span className="text-xs font-extrabold text-blue-dark">{area.count}</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${areaColors[area.name]?.bar || 'bg-slate-400'}`}
                        style={{ width: `${(area.count / maxBarCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Risk Distribution */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <AlertTriangle size={16} className="text-cyan-brand" />
                  Distribuição por Nível de Risco
                </h3>
              </div>
              <div className="flex flex-col gap-5">
                {/* Donut-style visual */}
                <div className="flex items-center justify-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke="#DC2626" strokeWidth="4"
                        strokeDasharray={`${(highRisk / totalSubmissions) * 88} 88`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke="#F59E0B" strokeWidth="4"
                        strokeDasharray={`${(mediumRisk / totalSubmissions) * 88} 88`}
                        strokeDashoffset={`-${(highRisk / totalSubmissions) * 88}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke="#16A34A" strokeWidth="4"
                        strokeDasharray={`${(lowRisk / totalSubmissions) * 88} 88`}
                        strokeDashoffset={`-${((highRisk + mediumRisk) / totalSubmissions) * 88}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-blue-dark">{totalSubmissions}</span>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase">Total</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Alto Risco', value: highRisk, pct: ((highRisk / totalSubmissions) * 100).toFixed(0), color: 'bg-red-danger', textColor: 'text-red-danger' },
                      { label: 'Médio Risco', value: mediumRisk, pct: ((mediumRisk / totalSubmissions) * 100).toFixed(0), color: 'bg-yellow-warning', textColor: 'text-amber-600' },
                      { label: 'Baixo Risco', value: lowRisk, pct: ((lowRisk / totalSubmissions) * 100).toFixed(0), color: 'bg-green-success', textColor: 'text-green-success' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                          <span className={`text-lg font-extrabold ${item.textColor}`}>{item.value} <span className="text-[10px] font-semibold text-slate-400">({item.pct}%)</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Status & Editor Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-brand" />
                  Status das Análises
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pendente', value: pending, color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-warning/10', border: 'border-yellow-warning/20' },
                  { label: 'Revisado', value: reviewed, color: 'from-cyan-brand to-blue-petrol', bg: 'bg-cyan-brand/10', border: 'border-cyan-brand/20' },
                  { label: 'Finalizado', value: finished, color: 'from-green-400 to-green-600', bg: 'bg-green-success/10', border: 'border-green-success/20' },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-xl border ${item.border} ${item.bg} p-4 text-center flex flex-col items-center gap-2 hover:shadow-md transition-all`}>
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-lg font-extrabold text-white">{item.value}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{((item.value / totalSubmissions) * 100).toFixed(0)}% do total</span>
                  </div>
                ))}
              </div>
            </section>

            {/* By Editor */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <Users size={16} className="text-cyan-brand" />
                  Volume por Editora
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {byEditor.map((editor, idx) => {
                  const barColors = ['bg-gradient-to-r from-blue-dark to-blue-petrol', 'bg-gradient-to-r from-purple-500 to-purple-400', 'bg-gradient-to-r from-cyan-brand to-cyan-400'];
                  return (
                    <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{editor.name}</span>
                        <div className="flex items-center gap-2">
                          {editor.highRisk > 0 && (
                            <span className="text-[9px] font-bold text-red-danger bg-red-danger/10 px-1.5 py-0.5 rounded-full">{editor.highRisk} alto risco</span>
                          )}
                          <span className="text-xs font-extrabold text-blue-dark">{editor.count}</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[idx % barColors.length]}`}
                          style={{ width: `${(editor.count / maxEditorCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Image Type Distribution */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-brand" />
                Tipo de Imagem Analisada
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {byImageType.map((type, idx) => {
                const typeColors = ['from-blue-500 to-indigo-500', 'from-emerald-500 to-green-500', 'from-amber-500 to-orange-500', 'from-pink-500 to-rose-500'];
                return (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 flex flex-col items-center gap-2 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${typeColors[idx % typeColors.length]} flex items-center justify-center shadow-md`}>
                      <span className="text-lg font-extrabold text-white">{type.count}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{type.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{((type.count / totalSubmissions) * 100).toFixed(0)}% do total</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Top Risk Submissions Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-danger" />
                Submissões com Maior Risco
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Top 5 por score</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Título</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Score</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...submissions].sort((a, b) => b.score - a.score).slice(0, 5).map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td className="px-4 py-3 font-bold text-blue-petrol text-xs">{sub.id}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium text-xs max-w-[250px] truncate">{sub.title}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{sub.editor}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${areaColors[sub.area]?.bg} ${areaColors[sub.area]?.text} border`}>{sub.area}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${sub.score >= 0.7 ? 'bg-red-danger' : sub.score >= 0.4 ? 'bg-yellow-warning' : 'bg-green-success'}`}
                              style={{ width: `${sub.score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-extrabold text-slate-700">{sub.score.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sub.status === 'Pendente' ? 'bg-yellow-warning/10 text-amber-700 border border-yellow-warning/20' :
                          sub.status === 'Revisado' ? 'bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20' :
                          'bg-green-success/10 text-green-success border border-green-success/20'
                        }`}>{sub.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ═══════════ TAB: ONBOARDING ═══════════ */}
      {activeTab === 'onboarding' && (
        <>
          {/* KPIs */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total de Editoras', value: totalEditoras, icon: Users, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20' },
              { label: 'Clientes Ativos', value: activeClients, icon: CheckCircle2, color: 'bg-green-success/10 text-green-success border-green-success/20' },
              { label: 'Em Pipeline', value: totalEditoras - activeClients, icon: Clock, color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20' },
              { label: 'NPS Médio', value: avgNps, icon: TrendingUp, color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20' },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-3 ${kpi.color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-2xl font-extrabold text-blue-dark block">{kpi.value}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
              );
            })}
          </section>

          {/* Pipeline Funnel */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-brand" />
                Funil do Pipeline de Onboarding
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">{totalEditoras} editoras no pipeline</span>
            </div>
            <div className="flex flex-col gap-4">
              {byStage.map((stage, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <span className="text-xs font-semibold text-slate-700">{stage.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-dark">{stage.count} editora{stage.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${stageColors[idx]}`}
                      style={{ width: stage.count > 0 ? `${Math.max((stage.count / maxStageCount) * 100, 8)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Porte & Área Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Porte */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <BarChart2 size={16} className="text-cyan-brand" />
                  Distribuição por Porte
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {byPorte.map((item, idx) => {
                  const porteColors = ['from-blue-400 to-blue-300', 'from-cyan-brand to-cyan-400', 'from-purple-500 to-purple-400'];
                  const PorteIcons = [Building, Building2, Landmark];
                  const porteIconBg = ['bg-blue-100 text-blue-500', 'bg-cyan-brand/15 text-cyan-brand', 'bg-purple-100 text-purple-500'];
                  const PorteIcon = PorteIcons[idx];
                  return (
                    <div key={idx} className="bg-slate-50 rounded-xl p-4 flex flex-col items-center gap-2 border border-slate-100 hover:shadow-md transition-all">
                      <div className={`w-10 h-10 rounded-lg ${porteIconBg[idx]} flex items-center justify-center`}>
                        <PorteIcon size={20} />
                      </div>
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${porteColors[idx]} flex items-center justify-center shadow-lg`}>
                        <span className="text-lg font-extrabold text-white">{item.count}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{((item.count / totalEditoras) * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* By Área */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                  <PieChart size={16} className="text-cyan-brand" />
                  Editoras por Área Científica
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {byAreaEditora.map((area, idx) => (
                  <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${areaColors[area.name]?.bar || 'bg-slate-400'}`} />
                        <span className="text-xs font-semibold text-slate-700">{area.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-dark">{area.count}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${areaColors[area.name]?.bar || 'bg-slate-400'}`}
                        style={{ width: `${(area.count / Math.max(...byAreaEditora.map(a => a.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* NPS & Editoras Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <FileText size={16} className="text-cyan-brand" />
                Detalhamento das Editoras
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Porte</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Área</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Volume</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">NPS</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {editoras.map((ed, idx) => (
                    <tr key={ed.id} className="hover:bg-slate-50/70 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.04}s` }}>
                      <td className="px-4 py-3 font-bold text-blue-petrol text-xs">{ed.id}</td>
                      <td className="px-4 py-3 text-slate-800 font-semibold text-xs">{ed.nome}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ed.porte === 'Grande' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' :
                          ed.porte === 'Média' ? 'bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>{ed.porte}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{ed.area}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ed.status === 'Cliente ativo' ? 'bg-green-success/10 text-green-success border border-green-success/20' :
                          ed.status === 'Integração API' ? 'bg-yellow-warning/10 text-amber-700 border border-yellow-warning/20' :
                          ed.status === 'Treinamento' ? 'bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>{ed.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">{ed.volume}</td>
                      <td className="px-4 py-3 text-xs">
                        {ed.nps !== null ? (
                          <span className={`font-extrabold ${ed.nps >= 80 ? 'text-green-success' : ed.nps >= 50 ? 'text-yellow-warning' : 'text-red-danger'}`}>{ed.nps}</span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{ed.responsavelComercial} / {ed.responsavelTecnico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ═══════════ TAB: INSIGHTS ESTRATÉGICOS ═══════════ */}
      {activeTab === 'insights' && (
        <>
          {/* Insight Cards Header */}
          <div className="bg-gradient-to-br from-indigo-900 via-blue-dark to-blue-petrol rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/15 flex items-center justify-center border border-yellow-400/25 shrink-0">
                <Lightbulb size={24} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold mb-1">Insights para Tomada de Decisão</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Recomendações estratégicas baseadas nos dados atuais do ecossistema. Use esses insights para orientar investimentos, priorizar recursos e definir o roadmap da AletheiaVision.
                </p>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Growth Opportunity */}
            <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Oportunidade de Crescimento</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Expansão para editoras de grande porte</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Editoras de grande porte representam <strong className="text-slate-700">{((editoras.filter(e => e.porte === 'Grande').reduce((a,e) => a + parseInt(e.volume), 0) / totalVolume) * 100).toFixed(0)}% do volume</strong> total de análises. 
                  Focar na conversão de leads desse segmento pode multiplicar a receita em até 3x.
                </p>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="text-[10px] font-bold">Impacto estimado: +R$ {(editoras.filter(e => e.porte === 'Grande' && e.status !== 'Cliente ativo').reduce((a,e) => a + parseInt(e.volume), 0) * revenuePerArticle).toLocaleString('pt-BR')}/mês</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>

            {/* Risk Alert */}
            <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Alerta de Risco</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">Concentração elevada em Oncologia</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                <strong className="text-slate-700">{((submissions.filter(s => s.area === 'Oncologia' && s.risk === 'Alto').length / Math.max(highRisk, 1)) * 100).toFixed(0)}% dos casos de alto risco</strong> são da área de Oncologia. 
                Recomenda-se investir em treinamento especializado e revisores dedicados para reduzir o backlog.
              </p>
              <div className="flex items-center gap-1.5 text-amber-600">
                <span className="text-[10px] font-bold">Ação recomendada: especializar equipe de revisão</span>
                <ArrowRight size={12} />
              </div>
            </div>

            {/* Efficiency Insight */}
            <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.16s' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Zap size={16} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Eficiência Operacional</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">Gargalo no processo de revisão</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                <strong className="text-slate-700">{pending} submissões pendentes</strong> ({((pending / totalSubmissions) * 100).toFixed(0)}% do total) indicam possível gargalo no pipeline de revisão humana. 
                A automação do pré-screening com IA pode reduzir o tempo médio em 40%.
              </p>
              <div className="flex items-center gap-1.5 text-blue-600">
                <span className="text-[10px] font-bold">Economia estimada: -0.9 dias no tempo médio</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </section>

          {/* Strategic Recommendations */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <Target size={16} className="text-cyan-brand" />
                Recomendações Estratégicas para o Trimestre
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Baseado nos dados de Jun/2026</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  priority: 'Crítica',
                  priorityColor: 'bg-red-danger/10 text-red-danger border-red-danger/20',
                  title: 'Acelerar conversão de editoras em pipeline',
                  description: `${totalEditoras - activeClients} editoras estão em fases intermediárias do pipeline. A receita potencial não capturada é de R$ ${((totalVolume - activeVolume) * revenuePerArticle).toLocaleString('pt-BR')}/mês.`,
                  metric: `${totalEditoras - activeClients} editoras`,
                  metricLabel: 'em conversão'
                },
                {
                  priority: 'Alta',
                  priorityColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
                  title: 'Reduzir tempo de processamento das análises',
                  description: `O tempo médio de ${avgProcessingDays} dias pode ser otimizado. Meta sugerida: reduzir para 1.5 dias com automação de pré-triagem por IA.`,
                  metric: `${avgProcessingDays}d`,
                  metricLabel: 'tempo médio atual'
                },
                {
                  priority: 'Alta',
                  priorityColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
                  title: 'Expandir cobertura NPS para todas as editoras',
                  description: `Apenas ${editoras.filter(e => e.nps !== null).length} de ${totalEditoras} editoras possuem NPS registrado. Sem dados de satisfação, é impossível prever churn.`,
                  metric: `${((editoras.filter(e => e.nps !== null).length / totalEditoras) * 100).toFixed(0)}%`,
                  metricLabel: 'cobertura NPS'
                },
                {
                  priority: 'Média',
                  priorityColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                  title: 'Diversificar base de clientes por área científica',
                  description: `Oncologia e Genética concentram ${((editoras.filter(e => e.area === 'Oncologia' || e.area === 'Genética').length / totalEditoras) * 100).toFixed(0)}% da base. Diversificar reduz risco de concentração setorial.`,
                  metric: `${editoras.filter(e => e.area === 'Oncologia' || e.area === 'Genética').length}/${totalEditoras}`,
                  metricLabel: 'concentração atual'
                },
              ].map((rec, idx) => (
                <div key={idx} className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 hover:shadow-md hover:border-slate-200 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${rec.priorityColor}`}>{rec.priority}</span>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-blue-dark block leading-tight">{rec.metric}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{rec.metricLabel}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trend Comparison */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
                <Activity size={16} className="text-cyan-brand" />
                Tendências dos Últimos 7 Períodos
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Evolução mensal</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Submissões', data: submissionTrend, color: '#0E2A47', current: submissionTrend[submissionTrend.length - 1], prev: submissionTrend[submissionTrend.length - 2] },
                { label: 'Receita (R$)', data: revenueTrend, color: '#00E5CC', current: revenueTrend[revenueTrend.length - 1], prev: revenueTrend[revenueTrend.length - 2] },
                { label: 'Eficiência (%)', data: efficiencyTrend, color: '#8B5CF6', current: efficiencyTrend[efficiencyTrend.length - 1], prev: efficiencyTrend[efficiencyTrend.length - 2] },
                { label: 'Risco (%)', data: riskTrend, color: '#DC2626', current: riskTrend[riskTrend.length - 1], prev: riskTrend[riskTrend.length - 2] },
                { label: 'NPS', data: npsTrend, color: '#16A34A', current: npsTrend[npsTrend.length - 1], prev: npsTrend[npsTrend.length - 2] },
              ].map((trend, idx) => {
                const diff = trend.current - trend.prev;
                const isUp = diff >= 0;
                const isRisk = trend.label === 'Risco (%)';
                const isPositive = isRisk ? !isUp : isUp;
                return (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center gap-2 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <Sparkline data={trend.data} color={trend.color} width={70} height={28} />
                    <span className="text-lg font-extrabold text-blue-dark">{trend.current.toLocaleString('pt-BR')}</span>
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-green-success' : 'text-red-danger'}`}>
                      {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {isUp ? '+' : ''}{diff}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold text-center">{trend.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SWOT-style Quick Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Forças',
                icon: ShieldCheck,
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                color: 'border-green-200 bg-green-50/50',
                titleColor: 'text-green-700',
                items: [
                  `NPS médio de ${avgNps} (${avgNps >= 80 ? 'excelente' : 'bom'})`,
                  `${activeClients} clientes ativos estáveis`,
                  `Taxa de detecção de risco: ${riskDetectionRate}%`
                ]
              },
              {
                title: 'Fraquezas',
                icon: AlertTriangle,
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-600',
                color: 'border-amber-200 bg-amber-50/50',
                titleColor: 'text-amber-700',
                items: [
                  `${pending} análises pendentes acumuladas`,
                  `Cobertura NPS de apenas ${((editoras.filter(e => e.nps !== null).length / totalEditoras) * 100).toFixed(0)}%`,
                  `Tempo de processamento: ${avgProcessingDays}d`
                ]
              },
              {
                title: 'Oportunidades',
                icon: Rocket,
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                color: 'border-blue-200 bg-blue-50/50',
                titleColor: 'text-blue-700',
                items: [
                  `${totalEditoras - activeClients} editoras no pipeline`,
                  `R$ ${((totalVolume - activeVolume) * revenuePerArticle).toLocaleString('pt-BR')}/mês potencial`,
                  'Automação do pré-screening IA'
                ]
              },
              {
                title: 'Ameaças',
                icon: OctagonAlert,
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                color: 'border-red-200 bg-red-50/50',
                titleColor: 'text-red-700',
                items: [
                  `${highRisk} submissões de alto risco`,
                  'Concentração setorial em Oncologia',
                  `${churnRisk} editora${churnRisk !== 1 ? 's' : ''} com risco de churn`
                ]
              },
            ].map((section, idx) => {
              const SectionIcon = section.icon;
              return (
              <div key={idx} className={`rounded-xl border ${section.color} p-4 animate-fade-in-up`} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg ${section.iconBg} flex items-center justify-center`}>
                    <SectionIcon size={14} className={section.iconColor} />
                  </div>
                  <span className={`text-xs font-bold ${section.titleColor}`}>{section.title}</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-[11px] text-slate-600 leading-relaxed flex items-start gap-1.5">
                      <span className="text-[8px] mt-1 text-slate-400">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
