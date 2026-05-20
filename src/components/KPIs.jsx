import React, { useEffect, useState } from 'react';
import { FileText, Image, Activity, AlertTriangle, Clock, Bell } from 'lucide-react';

function AnimatedNumber({ value, isPercent, duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) return;
    
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = end * eased;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value, duration]);

  if (isPercent) {
    return <span>{current.toFixed(1)}%</span>;
  }
  
  return <span>{Math.round(current).toLocaleString('pt-BR')}</span>;
}

export default function KPIs() {
  const kpiData = [
    {
      label: 'Artigos analisados',
      value: '412',
      icon: FileText,
      color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20',
      isAnim: true
    },
    {
      label: 'Imagens processadas',
      value: '1856',
      icon: Image,
      color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20',
      isAnim: true
    },
    {
      label: 'Precisão da IA',
      value: '91.3',
      icon: Activity,
      color: 'bg-green-success/10 text-green-success border-green-success/20',
      isPercent: true,
      isAnim: true
    },
    {
      label: 'Falsos positivos',
      value: '7.8',
      icon: AlertTriangle,
      color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20',
      isPercent: true,
      isAnim: true
    },
    {
      label: 'Tempo médio/artigo',
      value: '3min42s',
      icon: Clock,
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      isAnim: false
    },
    {
      label: 'Casos pendentes',
      value: '61',
      icon: Bell,
      color: 'bg-red-danger/10 text-red-danger border-red-danger/20',
      isAnim: true
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {kpiData.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 cursor-default select-none animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${kpi.color}`}>
              <Icon size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-extrabold text-blue-dark tracking-tight leading-none truncate">
                {kpi.isAnim ? (
                  <AnimatedNumber value={kpi.value} isPercent={kpi.isPercent} />
                ) : (
                  kpi.value
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider truncate leading-tight">
                {kpi.label}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
