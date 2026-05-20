import React, { useEffect, useState } from 'react';

export default function SubmissionDetails({ submission }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const t = setTimeout(() => {
      setAnimatedScore(submission.score);
    }, 150);
    return () => clearTimeout(t);
  }, [submission]);

  const getRiskClass = (risk) => {
    switch (risk) {
      case 'Alto':
        return 'bg-red-danger/10 text-red-danger border-red-danger/20';
      case 'Médio':
        return 'bg-yellow-warning/10 text-amber-800 border-yellow-warning/20';
      case 'Baixo':
        return 'bg-green-success/10 text-green-success border-green-success/20';
      default:
        return '';
    }
  };

  const getScoreFillClass = (score) => {
    if (score >= 0.7) return 'bg-gradient-to-r from-yellow-warning to-red-danger';
    if (score >= 0.4) return 'bg-gradient-to-r from-green-success to-yellow-warning';
    return 'bg-gradient-to-r from-blue-400 to-green-success';
  };

  // Generate cells for microscopy simulator
  const renderMicroscopyCells = () => {
    // Differing configurations to feel unique per article
    let count = 12;
    if (submission.id === 'AV-002') count = 8;
    if (submission.id === 'AV-003') count = 15;

    return Array.from({ length: count }).map((_, idx) => {
      const size = 25 + (idx * 3) % 25;
      const top = (idx * 27) % 85;
      const left = (idx * 31) % 85;
      const delay = (idx * 0.4).toFixed(1);
      
      return (
        <div 
          key={idx}
          className="cell animate-cell-float"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${delay}s`
          }}
        />
      );
    });
  };

  // Generate hot spots for heatmap simulation
  const renderHeatmapSpots = () => {
    if (submission.id === 'AV-003') {
      // Baixo risco - Quase nenhuma mancha, azul/verde suave
      return (
        <div 
          className="heat-spot animate-heat-pulse absolute w-14 h-14 rounded-full"
          style={{
            top: '40%',
            left: '45%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            filter: 'blur(8px)'
          }}
        />
      );
    }

    if (submission.id === 'AV-002') {
      // Médio risco - Manchas menores amarelas/laranjas
      return (
        <>
          <div 
            className="heat-spot animate-heat-pulse absolute w-16 h-16 rounded-full"
            style={{
              top: '30%',
              left: '25%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)',
              animationDelay: '0s'
            }}
          />
          <div 
            className="heat-spot animate-heat-pulse absolute w-12 h-12 rounded-full"
            style={{
              top: '55%',
              left: '60%',
              background: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)',
              animationDelay: '0.8s'
            }}
          />
        </>
      );
    }

    // Alto risco (AV-001) - Manchas intensas vermelhas e laranjas
    return (
      <>
        <div 
          className="heat-spot animate-heat-pulse absolute w-24 h-20 rounded-full"
          style={{
            top: '15%',
            left: '20%',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.7) 0%, rgba(249,115,22,0.3) 50%, transparent 70%)',
            animationDelay: '0s'
          }}
        />
        <div 
          className="heat-spot animate-heat-pulse absolute w-20 h-16 rounded-full"
          style={{
            top: '25%',
            left: '55%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.65) 0%, rgba(245,158,11,0.3) 50%, transparent 70%)',
            animationDelay: '0.5s'
          }}
        />
        <div 
          className="heat-spot animate-heat-pulse absolute w-14 h-14 rounded-full"
          style={{
            top: '55%',
            left: '35%',
            background: 'radial-gradient(ellipse, rgba(234,88,12,0.5) 0%, transparent 70%)',
            animationDelay: '1s'
          }}
        />
        <div 
          className="heat-spot animate-heat-pulse absolute w-16 h-14 rounded-full"
          style={{
            top: '45%',
            left: '65%',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.55) 0%, transparent 70%)',
            animationDelay: '1.5s'
          }}
        />
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Detalhes Técnicos */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Detalhes da Submissão</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskClass(submission.risk)}`}>
            {submission.classification}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ID da Submissão</div>
            <div className="text-sm font-semibold text-slate-800">{submission.id}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Artigo</div>
            <div className="text-sm font-semibold text-slate-800 line-clamp-1">{submission.title}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Editora</div>
            <div className="text-sm font-semibold text-slate-800">{submission.editor}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Área</div>
            <div className="text-sm font-semibold text-slate-800">{submission.area}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipo de imagem</div>
            <div className="text-sm font-semibold text-slate-800">{submission.imageType}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Data de submissão</div>
            <div className="text-sm font-semibold text-slate-800">{submission.submissionDate}</div>
          </div>
          <div className="py-1.5 border-b border-slate-50 sm:col-span-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score de similaridade</div>
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-red-danger">{submission.score.toFixed(2)}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getScoreFillClass(submission.score)}`}
                  style={{ width: `${animatedScore * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Classificação da IA</div>
            <div className="mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskClass(submission.risk)}`}>
                {submission.classification}
              </span>
            </div>
          </div>
          <div className="py-1.5 border-b border-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status da revisão</div>
            <div className="text-sm font-semibold text-slate-800">{submission.status}</div>
          </div>
        </div>
      </section>

      {/* Imagem Original + Heatmap */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-md font-bold text-blue-dark">Análise Visual</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Imagem Original */}
          <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col hover:border-cyan-brand/40 hover:shadow-lg transition-all group">
            <div className="bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              Imagem Original
            </div>
            <div className="h-44 relative overflow-hidden shrink-0">
              <div className="microscopy-simulation w-full h-full">
                {renderMicroscopyCells()}
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200 mt-auto">
              <span className="font-medium">Microscopia - Figura 2A</span>
              <span className="font-mono text-[9px] text-slate-400">fig2a_{submission.id.toLowerCase()}.png</span>
            </div>
          </div>

          {/* Mapa de Calor */}
          <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col hover:border-cyan-brand/40 hover:shadow-lg transition-all group">
            <div className="bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              Mapa de calor
            </div>
            <div className="h-44 relative overflow-hidden shrink-0">
              <div className="heatmap-simulation w-full h-full">
                {renderHeatmapSpots()}
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200 mt-auto">
              <span className="font-medium">Regiões suspeitas detectadas</span>
              <span className="text-[10px] text-slate-500">
                Similaridade: <strong className="text-red-danger font-extrabold">{Math.round(submission.score * 100)}%</strong>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
