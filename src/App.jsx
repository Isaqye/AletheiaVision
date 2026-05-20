import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Filters from './components/Filters';
import KPIs from './components/KPIs';
import SubmissionsTable from './components/SubmissionsTable';
import SubmissionDetails from './components/SubmissionDetails';
import ReviewForm from './components/ReviewForm';
import DecisionsGrid from './components/DecisionsGrid';
import Toast from './components/Toast';

// Onboarding imports
import OnboardingFilters from './components/onboarding/OnboardingFilters';
import OnboardingKPIs from './components/onboarding/OnboardingKPIs';
import Pipeline from './components/onboarding/Pipeline';
import EditorsTable from './components/onboarding/EditorsTable';
import EditorOnboardingDetails from './components/onboarding/EditorOnboardingDetails';
import OnboardingDecisions from './components/onboarding/OnboardingDecisions';
import ClientDashboard from './components/client/ClientDashboard';
import TicketsManager from './components/TicketsManager';
import MyTickets from './components/client/MyTickets';

const initialSubmissions = [
  {
    id: "AV-001",
    title: "Expressão celular em tecidos tumorais",
    editor: "Editora BioMed",
    area: "Oncologia",
    risk: "Alto",
    status: "Pendente",
    score: 0.87,
    imageType: "Microscopia",
    submissionDate: "10/05/2026",
    classification: "Alto risco"
  },
  {
    id: "AV-002",
    title: "Análise genética em amostras clínicas",
    editor: "Revista Ciência Viva",
    area: "Genética",
    risk: "Médio",
    status: "Revisado",
    score: 0.64,
    imageType: "Eletroforese",
    submissionDate: "12/05/2026",
    classification: "Médio risco"
  },
  {
    id: "AV-003",
    title: "Resposta imune em cultura celular",
    editor: "Health Research Press",
    area: "Microbiologia",
    risk: "Baixo",
    status: "Finalizado",
    score: 0.22,
    imageType: "Fluorescência",
    submissionDate: "14/05/2026",
    classification: "Baixo risco"
  }
];

const initialEditoras = [
  {
    id: "ED-001",
    nome: "Editora BioMed",
    porte: "Média",
    volume: "180 artigos/mês",
    area: "Oncologia",
    sistemaAtual: "OJS",
    status: "Integração API",
    responsavelComercial: "Anthony",
    responsavelTecnico: "Luan",
    prioridade: "Alta",
    nps: null
  },
  {
    id: "ED-002",
    nome: "Revista Ciência Viva",
    porte: "Pequena",
    volume: "75 artigos/mês",
    area: "Genética",
    sistemaAtual: "Submissão manual",
    status: "Treinamento",
    responsavelComercial: "Gabriel",
    responsavelTecnico: "Isaque",
    prioridade: "Média",
    nps: 82
  },
  {
    id: "ED-003",
    nome: "Health Research Press",
    porte: "Grande",
    volume: "320 artigos/mês",
    area: "Biomédica",
    sistemaAtual: "ScholarOne",
    status: "Contrato assinado",
    responsavelComercial: "Anthony",
    responsavelTecnico: "Luan",
    prioridade: "Crítica",
    nps: null
  }
];

const initialTickets = [
  {
    id: "#102",
    editor: "Editora BioMed",
    title: "Erro no formato de arquivo XML",
    status: "Aberto",
    priority: "Alta",
    date: "15/05/2026",
    category: "Integração API",
    description: "Ao tentar enviar o arquivo XML de submissão do artigo, o sistema exibe um erro informando que as tags de metadados de autoria estão mal formatadas. Já tentei limpar a estrutura mas o erro persiste.",
    reply: ""
  },
  {
    id: "#103",
    editor: "Revista Ciência Viva",
    title: "Dúvida sobre relatório PDF",
    status: "Resolvido",
    priority: "Média",
    date: "16/05/2026",
    category: "Treinamento",
    description: "Gostaria de entender melhor como exportar o relatório consolidado de análises de imagem no formato PDF direto para o nosso sistema. O botão está disponível no painel mas precisamos automatizar.",
    reply: "Olá! Atualmente a exportação do relatório PDF pode ser feita de forma manual pelo cabeçalho superior. Para automatização via API, adicionamos a rota GET /api/v1/submissions/{id}/report que retorna o binário do PDF. Consulte a documentação técnica no módulo Configurações."
  },
  {
    id: "#104",
    editor: "Health Research Press",
    title: "Configuração de credenciais da API",
    status: "Em andamento",
    priority: "Alta",
    date: "18/05/2026",
    category: "Integração API",
    description: "Precisamos de auxílio para configurar os tokens de autenticação JWT no ambiente de homologação. O sistema de submissão ScholarOne está recebendo erro 401 Unauthorized.",
    reply: "Olá, equipe! Verificamos que o token enviado expirou após 24 horas. Vamos gerar um token de longa duração (30 dias) para o ambiente de testes e enviar no canal privado da equipe técnica de vocês hoje à tarde."
  }
];

export default function App() {
  const [activePage, setActivePage] = useState('analysis');
  const [userRole, setUserRole] = useState('staff');
  
  // Prototype 1 states
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState(initialSubmissions[0]);
  const [filters, setFilters] = useState({
    period: 'all',
    editor: 'all',
    area: 'all',
    risk: 'all',
    status: 'all'
  });

  // Prototype 2 (Onboarding) states
  const [editoras, setEditoras] = useState(initialEditoras);
  const [selectedEditora, setSelectedEditora] = useState(initialEditoras[0]);
  const [onboardFilters, setOnboardFilters] = useState({
    status: 'all',
    porte: 'all',
    area: 'all',
    responsavel: 'all',
    period: 'Maio/2026'
  });

  // Client and Internal tickets state
  const [tickets, setTickets] = useState(initialTickets);

  const handleAddTicket = (editorName, title, priority, description = "", category = "Integração API") => {
    const nextNum = Math.max(...tickets.map(t => parseInt(t.id.replace('#', ''), 10) || 100)) + 1;
    const newTicket = {
      id: `#${nextNum}`,
      editor: editorName,
      title: title || "Novo Chamado de Suporte",
      status: "Aberto",
      priority: priority || "Alta",
      date: new Date().toLocaleDateString('pt-BR'),
      category: category,
      description: description || "Chamado de suporte técnico.",
      reply: ""
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket.id;
  };

  const handleUpdateTicket = (id, updatedFields) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Header quick action handler
  const handleHeaderAction = () => {
    if (activePage === 'onboarding') {
      // Simulate adding a new onboarding
      const newId = `ED-00${editoras.length + 1}`;
      const newEditora = {
        id: newId,
        nome: `Nova Editora Científica ${editoras.length + 1}`,
        porte: "Média",
        volume: "120 artigos/mês",
        area: "Biomédica",
        sistemaAtual: "OJS",
        status: "Lead recebido",
        responsavelComercial: "Anthony",
        responsavelTecnico: "Isaque",
        prioridade: "Média",
        nps: null
      };
      setEditoras(prev => [...prev, newEditora]);
      setSelectedEditora(newEditora);
      triggerToast(`Nova editora ${newEditora.nome} inserida no onboarding com sucesso!`);
    } else {
      triggerToast('Relatório completo exportado com sucesso (formato PDF)!');
    }
  };

  // Action handler for Prototype 1
  const handleAction = (message, nextStatus = null) => {
    triggerToast(message);
    if (nextStatus) {
      const updatedSubmissions = submissions.map(sub => {
        if (sub.id === selectedSub.id) {
          return { ...sub, status: nextStatus };
        }
        return sub;
      });
      setSubmissions(updatedSubmissions);
      setSelectedSub(prev => ({ ...prev, status: nextStatus }));
    }
  };

  // Action handler for Prototype 2 editor update
  const handleUpdateEditora = (id, updatedFields) => {
    const updated = editoras.map(ed => {
      if (ed.id === id) {
        return { ...ed, ...updatedFields };
      }
      return ed;
    });
    setEditoras(updated);
    // Sync selected
    const nextSelected = updated.find(ed => ed.id === id);
    if (nextSelected) {
      setSelectedEditora(nextSelected);
    }
  };

  // Filter logic for Prototype 1
  const filteredSubmissions = submissions.filter(sub => {
    if (filters.period !== 'all') {
      if (filters.period === 'Hoje' && sub.submissionDate !== '14/05/2026') return false;
      if (filters.period === 'Maio/2026' && !sub.submissionDate.includes('05/2026')) return false;
    }
    if (filters.editor !== 'all' && sub.editor !== filters.editor) return false;
    if (filters.area !== 'all' && sub.area !== filters.area) return false;
    if (filters.risk !== 'all' && sub.risk !== filters.risk) return false;
    if (filters.status !== 'all' && sub.status !== filters.status) return false;
    return true;
  });

  // Filter logic for Prototype 2 (Onboarding)
  const filteredEditoras = editoras.filter(ed => {
    if (onboardFilters.status !== 'all' && ed.status !== onboardFilters.status) return false;
    if (onboardFilters.porte !== 'all' && ed.porte !== onboardFilters.porte) return false;
    if (onboardFilters.area !== 'all' && ed.area !== onboardFilters.area) return false;
    if (onboardFilters.responsavel !== 'all') {
      if (ed.responsavelComercial !== onboardFilters.responsavel && ed.responsavelTecnico !== onboardFilters.responsavel) {
        return false;
      }
    }
    // Período filter logic (Maio/2026 matches our mocked data)
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-main text-slate-800 antialiased font-sans">
      <Header activePage={activePage} onAction={handleHeaderAction} userRole={userRole} setActivePage={setActivePage} />
      <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={userRole} setUserRole={setUserRole} />

      <main className="ml-60 pt-16 p-6 md:p-8 flex flex-col gap-6 transition-all duration-300">
        
        {/* Page Title & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-dark tracking-tight">
              {activePage === 'analysis' && 'Painel de Análise de Imagens Científicas'}
              {activePage === 'onboarding' && 'Painel de Onboarding de Novas Editoras'}
              {activePage !== 'analysis' && activePage !== 'onboarding' && activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {activePage === 'analysis' && 'Processo 1 — Análise de Imagem de Artigo Submetido'}
              {activePage === 'onboarding' && 'Gestão de Implantação e Integração de Clientes'}
              {activePage !== 'analysis' && activePage !== 'onboarding' && 'Módulo de simulação do ecossistema AletheiaVision Core'}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-brand/10 border border-cyan-brand/20 rounded-full text-xs font-semibold text-blue-petrol select-none">
              <span className="w-1.5 h-1.5 bg-cyan-brand rounded-full animate-live-pulse" />
              Monitoramento IA Ativo
            </span>
          </div>
        </div>

        {/* MÓDULO 1: ANÁLISE DE IMAGENS */}
        {activePage === 'analysis' && (
          <>
            {/* Filters */}
            <Filters filters={filters} setFilters={setFilters} />

            {/* KPIs */}
            <KPIs />

            {/* Submissions List */}
            <SubmissionsTable 
              submissions={filteredSubmissions} 
              selectedSub={selectedSub}
              onSelectSub={(sub) => setSelectedSub(sub)} 
            />

            {/* Details and Heatmap */}
            <SubmissionDetails submission={selectedSub} />

            {/* Review Form & Actions */}
            <ReviewForm 
              submission={selectedSub} 
              onAction={handleAction} 
            />

            {/* Managerial Decisions */}
            <DecisionsGrid />
          </>
        )}

        {/* MÓDULO 2: ONBOARDING DE EDITORAS (PROTÓTIPO 2) */}
        {activePage === 'onboarding' && (
          <>
            {/* Aviso de Contexto (Item 7.2) */}
            <div className="bg-gradient-to-r from-blue-dark/5 to-cyan-brand/5 border border-cyan-brand/20 p-4 rounded-xl flex items-start gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-cyan-brand/10 text-cyan-brand flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-dark">Aviso de Contexto Gerencial</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  Este módulo é complementar ao Painel de Análise de Imagens Científicas. Enquanto o Protótipo 1 representa o núcleo principal da AletheiaVision IA, este módulo apoia a implantação, treinamento, suporte e acompanhamento das editoras clientes.
                </p>
              </div>
            </div>

            {/* Onboarding Filters */}
            <OnboardingFilters filters={onboardFilters} setFilters={setOnboardFilters} />

            {/* Onboarding KPIs */}
            <OnboardingKPIs />

            {/* Onboarding Pipeline */}
            <Pipeline />

            {/* Editors Table */}
            <EditorsTable 
              editoras={filteredEditoras}
              selectedEditora={selectedEditora}
              onSelectEditora={(ed) => setSelectedEditora(ed)}
            />

            {/* Editor Details, Checklist, Tickets & Quick Update Form */}
            <EditorOnboardingDetails 
              editora={selectedEditora}
              onUpdateEditora={handleUpdateEditora}
              triggerToast={triggerToast}
              onOpenTicket={(editorName) => {
                const id = handleAddTicket(
                  editorName,
                  "Validação de integração de onboarding",
                  "Alta",
                  "Chamado de suporte aberto automaticamente a partir do painel de onboarding para acompanhamento da implantação da editora.",
                  "Integração API"
                );
                triggerToast(`Ticket ${id} aberto para ${editorName} com sucesso!`);
              }}
            />

            {/* Decisions Grid for Onboarding */}
            <OnboardingDecisions />
          </>
        )}

        {/* PORTAL DO CLIENTE: DASHBOARD */}
        {activePage === 'client-dashboard' && (
          <ClientDashboard 
            clientSubmissions={submissions.filter(s => s.editor === 'Editora BioMed')} 
            clientTickets={tickets.filter(t => t.editor === 'Editora BioMed')} 
            setActivePage={setActivePage} 
          />
        )}

        {/* TELA DE SUPORTE: STAFF PERSPECTIVE */}
        {activePage === 'tickets' && (
          <TicketsManager 
            tickets={tickets} 
            onUpdateTicket={handleUpdateTicket} 
            triggerToast={triggerToast} 
          />
        )}

        {/* PORTAL DO CLIENTE: MEUS CHAMADOS */}
        {activePage === 'client-tickets' && (
          <MyTickets 
            tickets={tickets} 
            onAddTicket={handleAddTicket} 
            clientName="Editora BioMed" 
            triggerToast={triggerToast} 
          />
        )}

        {/* OUTRAS TELAS SIMULADAS */}
        {activePage !== 'analysis' && 
         activePage !== 'onboarding' && 
         activePage !== 'client-dashboard' && 
         activePage !== 'tickets' && 
         activePage !== 'client-tickets' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center min-h-[350px] animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-cyan-brand/10 text-cyan-brand flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            </div>
            <h3 className="text-lg font-bold text-blue-dark mb-1">Módulo Simulado</h3>
            <p className="text-sm text-slate-500 max-w-md">
              A tela de <strong>"{activePage.charAt(0).toUpperCase() + activePage.slice(1)}"</strong> está mapeada no ecossistema global do protótipo e é simulada. As duas funcionalidades centrais e interativas integradas são <strong>Análise de Imagens</strong> (Protótipo 1) e <strong>Onboarding de Editoras</strong> (Protótipo 2).
            </p>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setActivePage('analysis')}
                className="px-5 py-2.5 bg-gradient-to-br from-blue-dark to-blue-petrol text-white text-xs font-bold rounded-md cursor-pointer hover:shadow active:scale-95 transition-all"
              >
                Análise de Imagens (Protótipo 1)
              </button>
              <button 
                onClick={() => setActivePage('onboarding')}
                className="px-5 py-2.5 bg-white border border-slate-200 text-blue-petrol text-xs font-bold rounded-md cursor-pointer hover:border-cyan-brand active:scale-95 transition-all"
              >
                Onboarding de Editoras (Protótipo 2)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Notifications */}
      <Toast 
        message={toastMessage} 
        visible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />
    </div>
  );
}
