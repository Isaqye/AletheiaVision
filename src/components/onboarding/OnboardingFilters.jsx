import React from 'react';
import { Filter } from 'lucide-react';

export default function OnboardingFilters({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        <Filter size={16} className="text-cyan-brand" />
        <span>Filtros do Onboarding</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-filter-status">Status</label>
          <select 
            id="onboard-filter-status" 
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Status</option>
            <option value="Lead recebido">Lead recebido</option>
            <option value="Demo realizada">Demo realizada</option>
            <option value="Contrato assinado">Contrato assinado</option>
            <option value="Integração API">Integração API</option>
            <option value="Treinamento">Treinamento</option>
            <option value="Cliente ativo">Cliente ativo</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-filter-porte">Porte da Editora</label>
          <select 
            id="onboard-filter-porte" 
            value={filters.porte}
            onChange={(e) => handleChange('porte', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Portes</option>
            <option value="Pequena">Pequena</option>
            <option value="Média">Média</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-filter-area">Área científica</label>
          <select 
            id="onboard-filter-area" 
            value={filters.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todas as Áreas</option>
            <option value="Biomédica">Biomédica</option>
            <option value="Oncologia">Oncologia</option>
            <option value="Genética">Genética</option>
            <option value="Microbiologia">Microbiologia</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-filter-resp">Responsável</label>
          <select 
            id="onboard-filter-resp" 
            value={filters.responsavel}
            onChange={(e) => handleChange('responsavel', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Responsáveis</option>
            <option value="Anthony">Anthony</option>
            <option value="Luan">Luan</option>
            <option value="Isaque">Isaque</option>
            <option value="Gabriel">Gabriel</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="onboard-filter-period">Período</label>
          <select 
            id="onboard-filter-period" 
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="Maio/2026">Maio/2026</option>
            <option value="30-dias">Últimos 30 dias</option>
            <option value="Trimestre atual">Trimestre atual</option>
          </select>
        </div>
      </div>
    </section>
  );
}
