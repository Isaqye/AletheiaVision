import React from 'react';

export default function DecisionsGrid() {
  const decisions = [
    {
      level: 'Operacional',
      desc: 'Priorizar imagens de alto risco para revisão humana.',
      badgeStyle: 'bg-cyan-brand/10 text-blue-petrol border border-cyan-brand/20',
      borderStyle: 'border-l-4 border-l-cyan-brand'
    },
    {
      level: 'Tático',
      desc: 'Ajustar limiar de risco se falsos positivos aumentarem.',
      badgeStyle: 'bg-yellow-warning/10 text-amber-800 border border-yellow-warning/20',
      borderStyle: 'border-l-4 border-l-yellow-warning'
    },
    {
      level: 'Estratégico',
      desc: 'Avaliar se a IA está pronta para escalar para mais editoras.',
      badgeStyle: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      borderStyle: 'border-l-4 border-l-purple-500'
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-md font-bold text-blue-dark">Decisões Gerenciais Apoiadas</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {decisions.map((d, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-start gap-2 ${d.borderStyle}`}
          >
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.badgeStyle}`}>
              {d.level}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
