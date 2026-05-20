import React, { useEffect, useState } from 'react';
import { Globe, Clock, BarChart2, AlertCircle, Smile, Link2 } from 'lucide-react';

function AnimatedNumber({ value, suffix = '', duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) return;
    
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = end * eased;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value, duration]);

  return <span>{Math.round(current).toLocaleString('pt-BR')}{suffix}</span>;
}

export default function OnboardingKPIs() {
  const kpis = [
    {
      label: 'Editoras em implantação',
      value: '8',
      icon: Globe,
      color: 'bg-blue-dark/10 text-blue-dark border-blue-dark/20',
      isAnim: true
    },
    {
      label: 'Tempo médio de onboarding',
      value: '6',
      suffix: ' dias',
      icon: Clock,
      color: 'bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20',
      isAnim: true
    },
    {
      label: 'Taxa de conversão',
      value: '42',
      suffix: '%',
      icon: BarChart2,
      color: 'bg-green-success/10 text-green-success border-green-success/20',
      isAnim: true
    },
    {
      label: 'Tickets abertos',
      value: '17',
      icon: AlertCircle,
      color: 'bg-red-danger/10 text-red-danger border-red-danger/20',
      isAnim: true
    },
    {
      label: 'NPS médio',
      value: '74',
      icon: Smile,
      color: 'bg-yellow-warning/10 text-yellow-warning border-yellow-warning/20',
      isAnim: true
    },
    {
      label: 'Integrações concluídas',
      value: '5',
      icon: Link2,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      isAnim: true
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
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
                  <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
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
