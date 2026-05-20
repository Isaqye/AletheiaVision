import React from 'react';
import { Filter } from 'lucide-react';

export default function Filters({ filters, setFilters }) {
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
        <span>Filtros de Consulta</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="filter-period">Período</label>
          <select 
            id="filter-period" 
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Períodos</option>
            <option value="Hoje">Hoje</option>
            <option value="Maio/2026">Maio/2026</option>
            <option value="30-dias">Últimos 30 dias</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="filter-editor">Editora</label>
          <select 
            id="filter-editor" 
            value={filters.editor}
            onChange={(e) => handleChange('editor', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todas as Editoras</option>
            <option value="Editora BioMed">Editora BioMed</option>
            <option value="Revista Ciência Viva">Revista Ciência Viva</option>
            <option value="Health Research Press">Health Research Press</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="filter-area">Área científica</label>
          <select 
            id="filter-area" 
            value={filters.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todas as Áreas</option>
            <option value="Biomédica">Biomédica</option>
            <option value="Genética">Genética</option>
            <option value="Oncologia">Oncologia</option>
            <option value="Microbiologia">Microbiologia</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="filter-risk">Risco</label>
          <select 
            id="filter-risk" 
            value={filters.risk}
            onChange={(e) => handleChange('risk', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Níveis</option>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="filter-status">Status</label>
          <select 
            id="filter-status" 
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-cyan-brand focus:ring-2 focus:ring-cyan-brand/10 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%234B5563%22%20stroke-width=%222%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] pr-8"
          >
            <option value="all">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Revisado">Revisado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>
    </section>
  );
}
