import React, { useState } from 'react';
import { BarChart2, PieChart, TrendingUp, FileText, Users, AlertTriangle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

export default function Reports({ submissions, editoras }) {
  const [activeTab, setActiveTab] = useState('analysis');

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

  const maxBarCount = Math.max(...byArea.map(a => a.count), 1);
  const maxEditorCount = Math.max(...byEditor.map(e => e.count), 1);
  const maxStageCount = Math.max(...byStage.map(s => s.count), 1);

  const areaColors = {
    'Oncologia': { bg: 'bg-red-danger/15', bar: 'bg-gradient-to-r from-red-500 to-red-400', text: 'text-red-600' },
    'Genética': { bg: 'bg-purple-500/15', bar: 'bg-gradient-to-r from-purple-500 to-purple-400', text: 'text-purple-600' },
    'Microbiologia': { bg: 'bg-green-success/15', bar: 'bg-gradient-to-r from-green-500 to-green-400', text: 'text-green-600' },
    'Biomédica': { bg: 'bg-cyan-brand/15', bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400', text: 'text-cyan-600' },
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
    { id: 'analysis', label: 'Análise de Imagens', icon: BarChart2 },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-dark to-blue-petrol rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <BarChart2 size={24} className="text-cyan-brand" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Central de Relatórios</h3>
            <p className="text-sm text-cyan-brand/80 mt-0.5 font-medium">Visão consolidada dos dados do ecossistema AletheiaVision</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-extrabold text-xs rounded-lg cursor-pointer hover:bg-white/20 active:scale-95 transition-all border border-white/20">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="6" height="18" rx="1" />
              <rect x="9" y="8" width="6" height="13" rx="1" />
              <rect x="16" y="5" width="6" height="16" rx="1" />
            </svg>
            Exportar Power BI
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-brand text-blue-dark font-extrabold text-xs rounded-lg cursor-pointer hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-brand/30">
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
                  const porteLabels = ['🏢', '🏬', '🏛️'];
                  return (
                    <div key={idx} className="bg-slate-50 rounded-xl p-4 flex flex-col items-center gap-2 border border-slate-100 hover:shadow-md transition-all">
                      <span className="text-2xl">{porteLabels[idx]}</span>
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
    </div>
  );
}
