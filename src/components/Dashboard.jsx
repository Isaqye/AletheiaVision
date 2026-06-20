import React, { useEffect, useState } from 'react';
import {
  FileText, Image, Activity, Users, Ticket, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight,
  Search, ClipboardList, BarChart2, Settings, Zap, Shield, Eye,
  ChevronRight, Star, Bell
} from 'lucide-react';

function AnimatedCounter({ end, duration = 1200, suffix = '', prefix = '' }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const num = parseFloat(end);
    if (isNaN(num)) { setValue(end); return; }
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(num * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  if (typeof end === 'string' && isNaN(parseFloat(end))) return <span>{prefix}{end}{suffix}</span>;
  return <span>{prefix}{Number.isInteger(parseFloat(end)) ? Math.round(value).toLocaleString('pt-BR') : value.toFixed(1)}{suffix}</span>;
}

function MiniSparkline({ data, color = '#00E5CC', width = 72, height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const uid = `spark-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg width={width} height={height} className="shrink-0">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${uid})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard({ submissions, editoras, tickets, setActivePage }) {
  const totalSub = submissions.length;
  const highRisk = submissions.filter(s => s.risk === 'Alto').length;
  const pending = submissions.filter(s => s.status === 'Pendente').length;
  const finished = submissions.filter(s => s.status === 'Finalizado').length;
  const activeClients = editoras.filter(e => e.status === 'Cliente ativo').length;
  const openTickets = tickets.filter(t => t.status !== 'Resolvido').length;
  const avgNps = editoras.filter(e => e.nps !== null).length > 0
    ? Math.round(editoras.filter(e => e.nps !== null).reduce((a, e) => a + e.nps, 0) / editoras.filter(e => e.nps !== null).length)
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const urgentSubmissions = [...submissions].filter(s => s.risk === 'Alto' && s.status === 'Pendente').sort((a, b) => b.score - a.score).slice(0, 3);

  // Pipeline stages
  const stages = ['Lead recebido', 'Demo realizada', 'Contrato assinado', 'Integração API', 'Treinamento', 'Cliente ativo'];
  const pipelineData = stages.map(s => ({ name: s, count: editoras.filter(e => e.status === s).length }));

  // Simulated daily activity
  const dailyActivity = [
    { day: 'Seg', articles: 8, images: 34 },
    { day: 'Ter', articles: 12, images: 52 },
    { day: 'Qua', articles: 6, images: 28 },
    { day: 'Qui', articles: 15, images: 67 },
    { day: 'Sex', articles: 11, images: 48 },
    { day: 'Sáb', articles: 3, images: 14 },
    { day: 'Dom', articles: 1, images: 5 },
  ];
  const maxArticles = Math.max(...dailyActivity.map(d => d.articles));

  const kpis = [
    { label: 'Artigos analisados', value: 412, icon: FileText, color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20', trend: '+18%', up: true, sparkData: [5, 7, 6, 9, 8, 11, 12], sparkColor: '#073B66' },
    { label: 'Imagens processadas', value: 1856, icon: Image, color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20', trend: '+24%', up: true, sparkData: [200, 250, 220, 310, 280, 350, 340], sparkColor: '#00B8C8' },
    { label: 'Precisão da IA', value: '91.3', suffix: '%', icon: Activity, color: 'bg-green-success/10 text-green-success border-green-success/20', trend: '+2.1%', up: true, sparkData: [85, 87, 88, 90, 89, 91, 91.3], sparkColor: '#16A34A' },
    { label: 'Editoras ativas', value: activeClients, icon: Users, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', trend: '+1', up: true, sparkData: [1, 1, 1, 2, 2, 2, activeClients], sparkColor: '#8B5CF6' },
    { label: 'Tickets abertos', value: openTickets, icon: Ticket, color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20', trend: '-2', up: true, sparkData: [5, 4, 6, 3, 4, 3, openTickets], sparkColor: '#F59E0B' },
    { label: 'NPS médio', value: avgNps, icon: Star, color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20', trend: '+3', up: true, sparkData: [72, 78, 75, 80, 85, 87, avgNps], sparkColor: '#00B8C8' },
  ];

  const shortcuts = [
    { label: 'Análise de Imagens', desc: 'Protótipo 1 — Painel principal', icon: Search, page: 'analysis', gradient: 'from-blue-dark to-blue-petrol' },
    { label: 'Onboarding', desc: 'Protótipo 2 — Gestão de editoras', icon: ClipboardList, page: 'onboarding', gradient: 'from-purple-600 to-indigo-600' },
    { label: 'Relatórios', desc: 'Central analítica executiva', icon: BarChart2, page: 'reports', gradient: 'from-cyan-600 to-teal-600' },
    { label: 'Tickets', desc: 'Suporte técnico ativo', icon: Ticket, page: 'tickets', gradient: 'from-amber-500 to-orange-500' },
  ];

  const stageColors = [
    'bg-slate-400', 'bg-blue-400', 'bg-purple-500', 'bg-yellow-500', 'bg-cyan-brand', 'bg-green-500'
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-dark to-blue-petrol rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye size={14} className="text-cyan-brand" />
              <span className="text-[10px] font-bold text-cyan-brand uppercase tracking-widest">Dashboard Executivo — AletheiaVision Core</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mb-1">{greeting}, Isaque!</h2>
            <p className="text-sm text-slate-300 font-medium">
              Monitoramento consolidado do ecossistema. Hoje: <strong className="text-white">{pending} análises pendentes</strong> e <strong className="text-white">{openTickets} tickets abertos</strong>.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
              <span className="text-2xl font-extrabold block"><AnimatedCounter end={totalSub} /></span>
              <span className="text-[9px] text-cyan-brand/70 font-bold uppercase tracking-wider">Submissões totais</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
              <span className={`text-2xl font-extrabold block ${avgNps >= 80 ? 'text-green-400' : 'text-yellow-400'}`}><AnimatedCounter end={avgNps} /></span>
              <span className="text-[9px] text-cyan-brand/70 font-bold uppercase tracking-wider">NPS médio</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default select-none animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${kpi.color}`}>
                  <Icon size={16} />
                </div>
                <MiniSparkline data={kpi.sparkData} color={kpi.sparkColor} width={52} height={20} />
              </div>
              <span className="text-xl font-extrabold text-blue-dark block leading-tight">
                <AnimatedCounter end={kpi.value} suffix={kpi.suffix || ''} />
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider truncate">{kpi.label}</span>
                <span className={`flex items-center gap-0.5 text-[9px] font-bold ${kpi.up ? 'text-green-success' : 'text-red-danger'}`}>
                  {kpi.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Grid: Activity + Urgent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
              <Activity size={16} className="text-cyan-brand" />
              Atividade dos Últimos 7 Dias
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Volume diário de análises</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {dailyActivity.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                  <span className="text-[10px] font-extrabold text-blue-dark">{day.articles}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-dark to-blue-petrol transition-all duration-700 ease-out relative group"
                    style={{ height: `${Math.max((day.articles / maxArticles) * 100, 8)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.images} imagens
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-blue-dark to-blue-petrol" />
              <span className="text-[10px] text-slate-500 font-medium">Artigos analisados</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Hover para ver imagens processadas</span>
          </div>
        </section>

        {/* Urgent Submissions */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-danger" />
              Submissões Urgentes
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-danger/10 text-red-danger border border-red-danger/20 animate-live-pulse">
              {urgentSubmissions.length} pendentes
            </span>
          </div>
          {urgentSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 size={32} className="text-green-success mb-2" />
              <span className="text-sm font-bold text-slate-600">Nenhuma submissão urgente!</span>
              <span className="text-[10px] text-slate-400">Todas as análises de alto risco foram processadas.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {urgentSubmissions.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 hover:shadow-md hover:border-red-200 transition-all cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  onClick={() => setActivePage('analysis')}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-petrol">{sub.id}</span>
                    <span className="text-xs font-extrabold text-red-danger">{sub.score.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug line-clamp-1 mb-2">{sub.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-medium">{sub.editor}</span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-red-danger">
                      <span>Analisar</span>
                      <ChevronRight size={10} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Pipeline + Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Pipeline */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-brand" />
              Pipeline de Onboarding
            </h3>
            <button
              onClick={() => setActivePage('onboarding')}
              className="text-[10px] font-bold text-cyan-brand hover:underline cursor-pointer flex items-center gap-1"
            >
              Ver detalhes <ChevronRight size={10} />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {pipelineData.map((stage, idx) => {
              const maxCount = Math.max(...pipelineData.map(s => s.count), 1);
              const isActive = stage.name === 'Cliente ativo';
              return (
                <div key={idx} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <span className={`w-2 h-2 rounded-full ${stageColors[idx]} shrink-0`} />
                  <span className={`text-[11px] font-medium w-32 shrink-0 truncate ${isActive ? 'text-green-600 font-bold' : 'text-slate-600'}`}>{stage.name}</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${isActive ? 'bg-gradient-to-r from-green-500 to-green-400' : `bg-gradient-to-r ${idx === 0 ? 'from-slate-400 to-slate-300' : idx === 1 ? 'from-blue-400 to-blue-300' : idx === 2 ? 'from-purple-500 to-purple-400' : idx === 3 ? 'from-yellow-500 to-yellow-400' : 'from-cyan-brand to-cyan-400'}`}`}
                      style={{ width: stage.count > 0 ? `${Math.max((stage.count / maxCount) * 100, 12)}%` : '0%' }}
                    />
                  </div>
                  <span className={`text-xs font-extrabold ${isActive ? 'text-green-600' : 'text-blue-dark'} w-6 text-right`}>{stage.count}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Shortcuts */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
              <Zap size={16} className="text-cyan-brand" />
              Acesso Rápido
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map((sc, idx) => {
              const Icon = sc.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePage(sc.page)}
                  className={`bg-gradient-to-br ${sc.gradient} rounded-xl p-4 text-white text-left flex flex-col gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer animate-fade-in-up group`}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">{sc.label}</span>
                    <span className="text-[9px] text-white/70 font-medium">{sc.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recent Submissions Overview */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-blue-dark flex items-center gap-2">
            <FileText size={16} className="text-cyan-brand" />
            Submissões Recentes
          </h3>
          <button
            onClick={() => setActivePage('analysis')}
            className="text-[10px] font-bold text-cyan-brand hover:underline cursor-pointer flex items-center gap-1"
          >
            Ver todas <ChevronRight size={10} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Título</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Editora</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Risco</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Score</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.slice(0, 5).map((sub, idx) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/70 transition-all cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => setActivePage('analysis')}
                >
                  <td className="px-4 py-2.5 font-bold text-blue-petrol text-xs">{sub.id}</td>
                  <td className="px-4 py-2.5 text-slate-800 font-medium text-xs max-w-[250px] truncate">{sub.title}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{sub.editor}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      sub.risk === 'Alto' ? 'bg-red-danger/10 text-red-danger border-red-danger/20' :
                      sub.risk === 'Médio' ? 'bg-yellow-warning/10 text-amber-800 border-yellow-warning/20' :
                      'bg-green-success/10 text-green-success border-green-success/20'
                    }`}>{sub.risk}</span>
                  </td>
                  <td className="px-4 py-2.5 font-extrabold text-xs text-slate-700">{sub.score.toFixed(2)}</td>
                  <td className="px-4 py-2.5">
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
    </div>
  );
}
