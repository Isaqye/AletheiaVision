import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Pipeline() {
  const steps = [
    { label: 'Lead recebido', value: 12 },
    { label: 'Demo realizada', value: 9 },
    { label: 'Proposta enviada', value: 6 },
    { label: 'Contrato assinado', value: 4 },
    { label: 'Integração API', value: 4 },
    { label: 'Treinamento', value: 3 },
    { label: '30 dias de uso', value: 2 },
    { label: 'Cliente ativo', value: 2 }
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-md font-bold text-blue-dark">Pipeline de Onboarding</h3>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20">
          Fluxo de Funil
        </span>
      </div>

      {/* Pipeline Grid (Horizontal on large, vertical stack on small screens) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 py-2">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-600/30 hover:shadow-sm transition-all group">
            {/* Value Badge */}
            <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 font-extrabold flex items-center justify-center text-sm shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              {step.value}
            </div>
            
            {/* Label */}
            <span className="text-[11px] font-bold text-slate-700 mt-2 text-center truncate w-full">
              {step.label}
            </span>

            {/* Step number */}
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-1">
              Etapa 0{idx + 1}
            </span>

            {/* Connection Arrow (Except for the last step, horizontal indicator) */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3 z-10 text-slate-300 group-hover:text-blue-600 transition-all">
                <ChevronRight size={14} className="stroke-[3px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
