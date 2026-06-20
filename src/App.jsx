import React, { useState, useEffect } from 'react';
import { downloadMockPDF } from './utils/exportUtils';
import Login from './components/Login';
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
import Chatbot from './components/client/Chatbot';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import HumanReview from './components/HumanReview';
import EditorsClients from './components/EditorsClients';
import Settings from './components/Settings';
import ClientSubmit from './components/client/ClientSubmit';

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
  },
  {
    id: "AV-004",
    title: "Marcadores moleculares em carcinoma mamário",
    editor: "Editora BioMed",
    area: "Oncologia",
    risk: "Alto",
    status: "Revisado",
    score: 0.91,
    imageType: "Microscopia",
    submissionDate: "08/05/2026",
    classification: "Alto risco"
  },
  {
    id: "AV-005",
    title: "Sequenciamento de nova variante genômica",
    editor: "Revista Ciência Viva",
    area: "Genética",
    risk: "Baixo",
    status: "Finalizado",
    score: 0.18,
    imageType: "Eletroforese",
    submissionDate: "05/05/2026",
    classification: "Baixo risco"
  },
  {
    id: "AV-006",
    title: "Ressonância de proteínas em tecido hepático",
    editor: "Health Research Press",
    area: "Biomédica",
    risk: "Médio",
    status: "Pendente",
    score: 0.53,
    imageType: "Ressonância",
    submissionDate: "14/05/2026",
    classification: "Médio risco"
  },
  {
    id: "AV-007",
    title: "Proliferação bacteriana em meios seletivos",
    editor: "Editora BioMed",
    area: "Microbiologia",
    risk: "Baixo",
    status: "Finalizado",
    score: 0.15,
    imageType: "Fluorescência",
    submissionDate: "02/05/2026",
    classification: "Baixo risco"
  },
  {
    id: "AV-008",
    title: "Citometria de fluxo em linhagem tumoral",
    editor: "Health Research Press",
    area: "Oncologia",
    risk: "Alto",
    status: "Pendente",
    score: 0.82,
    imageType: "Microscopia",
    submissionDate: "16/05/2026",
    classification: "Alto risco"
  },
  {
    id: "AV-009",
    title: "Mapeamento epigenético em células-tronco",
    editor: "Revista Ciência Viva",
    area: "Genética",
    risk: "Alto",
    status: "Pendente",
    score: 0.78,
    imageType: "Eletroforese",
    submissionDate: "18/05/2026",
    classification: "Alto risco"
  },
  {
    id: "AV-010",
    title: "Análise histopatológica de biópsia renal",
    editor: "Editora BioMed",
    area: "Biomédica",
    risk: "Médio",
    status: "Revisado",
    score: 0.57,
    imageType: "Microscopia",
    submissionDate: "20/05/2026",
    classification: "Médio risco"
  },
  {
    id: "AV-011",
    title: "Resistência antimicrobiana em isolados clínicos",
    editor: "Health Research Press",
    area: "Microbiologia",
    risk: "Médio",
    status: "Finalizado",
    score: 0.48,
    imageType: "Fluorescência",
    submissionDate: "22/05/2026",
    classification: "Médio risco"
  },
  {
    id: "AV-012",
    title: "Western blot de expressão proteica PD-L1",
    editor: "Revista Ciência Viva",
    area: "Biomédica",
    risk: "Alto",
    status: "Revisado",
    score: 0.85,
    imageType: "Eletroforese",
    submissionDate: "24/05/2026",
    classification: "Alto risco"
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
  },
  {
    id: "ED-004",
    nome: "Journal MicroSci",
    porte: "Pequena",
    volume: "60 artigos/mês",
    area: "Microbiologia",
    sistemaAtual: "Submissão manual",
    status: "Lead recebido",
    responsavelComercial: "Gabriel",
    responsavelTecnico: "Isaque",
    prioridade: "Baixa",
    nps: null
  },
  {
    id: "ED-005",
    nome: "Editora Genômica Brasil",
    porte: "Média",
    volume: "150 artigos/mês",
    area: "Genética",
    sistemaAtual: "OJS",
    status: "Demo realizada",
    responsavelComercial: "Anthony",
    responsavelTecnico: "Isaque",
    prioridade: "Alta",
    nps: null
  },
  {
    id: "ED-006",
    nome: "Cancer Research Latin America",
    porte: "Grande",
    volume: "410 artigos/mês",
    area: "Oncologia",
    sistemaAtual: "ScholarOne",
    status: "Cliente ativo",
    responsavelComercial: "Anthony",
    responsavelTecnico: "Luan",
    prioridade: "Crítica",
    nps: 91
  },
  {
    id: "ED-007",
    nome: "Revista Patologia Tropical",
    porte: "Pequena",
    volume: "45 artigos/mês",
    area: "Microbiologia",
    sistemaAtual: "Submissão manual",
    status: "Contrato assinado",
    responsavelComercial: "Gabriel",
    responsavelTecnico: "Luan",
    prioridade: "Média",
    nps: null
  },
  {
    id: "ED-008",
    nome: "International Biomedical Journal",
    porte: "Grande",
    volume: "500 artigos/mês",
    area: "Biomédica",
    sistemaAtual: "Editorial Manager",
    status: "Integração API",
    responsavelComercial: "Anthony",
    responsavelTecnico: "Isaque",
    prioridade: "Crítica",
    nps: null
  },
  {
    id: "ED-009",
    nome: "Editora CelTech",
    porte: "Média",
    volume: "200 artigos/mês",
    area: "Genética",
    sistemaAtual: "OJS",
    status: "Cliente ativo",
    responsavelComercial: "Gabriel",
    responsavelTecnico: "Isaque",
    prioridade: "Alta",
    nps: 88
  },
  {
    id: "ED-010",
    nome: "Fronteiras da Oncologia",
    porte: "Média",
    volume: "130 artigos/mês",
    area: "Oncologia",
    sistemaAtual: "OJS",
    status: "Demo realizada",
    responsavelComercial: "Luan",
    responsavelTecnico: "Gabriel",
    prioridade: "Alta",
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem('aletheiaVision_auth');
    return saved === 'true';
  });
  const [activePage, setActivePage] = useState(() => {
    return sessionStorage.getItem('aletheiaVision_page') || 'analysis';
  });
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('aletheiaVision_role') || 'staff';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('aletheiaVision_darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('aletheiaVision_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
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

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    sessionStorage.setItem('aletheiaVision_auth', 'true');
    sessionStorage.setItem('aletheiaVision_role', role);
    
    const defaultPage = role === 'client' ? 'client-dashboard' : 'dashboard';
    setActivePage(defaultPage);
    sessionStorage.setItem('aletheiaVision_page', defaultPage);
    triggerToast(`Conectado com sucesso como ${role === 'client' ? 'Editora Cliente' : 'Equipe Tecnica'}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aletheiaVision_auth');
    sessionStorage.removeItem('aletheiaVision_role');
    sessionStorage.removeItem('aletheiaVision_page');
    triggerToast('Desconectado do sistema.');
  };

  const changePage = (page) => {
    setActivePage(page);
    sessionStorage.setItem('aletheiaVision_page', page);
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
      const lines = [
        `Filtros Aplicados: Periodo: ${filters.period} | Editora: ${filters.editor} | Area: ${filters.area} | Risco: ${filters.risk}`,
        `Total de submissoes filtradas: ${filteredSubmissions.length}`,
        `----------------------------------------------------------------------------------------------------`,
        ...filteredSubmissions.flatMap(sub => [
          `[${sub.id}] Risco: ${sub.risk} | Score: ${sub.score.toFixed(2)} | Status: ${sub.status}`,
          `      Artigo: ${sub.title.substring(0, 60)}`,
          `      Editora: ${sub.editor} | Area: ${sub.area}`,
          `----------------------------------------------------------------------------------------------------`
        ])
      ];
      downloadMockPDF('relatorio_submissoes_aletheiavision.pdf', 'Relatorio Consolidado de Submissoes', lines);
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

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toast 
          message={toastMessage} 
          visible={toastVisible} 
          onClose={() => setToastVisible(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-bg-main text-slate-800 antialiased font-sans ${darkMode ? 'dark' : ''}`}>
      <Header activePage={activePage} onAction={handleHeaderAction} userRole={userRole} setActivePage={changePage} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Sidebar activePage={activePage} setActivePage={changePage} userRole={userRole} onLogout={handleLogout} />

      <main className="ml-60 pt-16 p-6 md:p-8 flex flex-col gap-6 transition-all duration-300">
        
        {/* Page Title & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-dark tracking-tight">
              {{ 
                analysis: 'Painel de Análise de Imagens Científicas',
                onboarding: 'Painel de Onboarding de Novas Editoras',
                dashboard: 'Dashboard Executivo',
                review: 'Revisão Humana — Fila de Análise',
                editors: 'Editoras Clientes',
                tickets: 'Gestão de Tickets de Suporte',
                reports: 'Central de Relatórios Gerenciais',
                settings: 'Configurações do Sistema',
                'client-dashboard': 'Portal da Editora',
                'client-submit': 'Análise de Imagem por IA',
                'client-tickets': 'Meus Chamados de Suporte',
              }[activePage] || activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {{
                analysis: 'Processo 1 — Análise de Imagem de Artigo Submetido',
                onboarding: 'Gestão de Implantação e Integração de Clientes',
                dashboard: 'Visão consolidada do ecossistema AletheiaVision',
                review: 'Parecer técnico do analista sobre detecções da IA',
                editors: 'Visão completa de todas as editoras parceiras',
                tickets: 'Sistema bidirecional de chamados de suporte',
                reports: 'Inteligência de dados para decisões estratégicas',
                settings: 'Preferências da conta, integrações e parâmetros',
                'client-dashboard': 'Painel personalizado da editora parceira',
                'client-submit': 'Submeta artigos para verificação de integridade',
                'client-tickets': 'Acompanhamento dos seus chamados de suporte',
              }[activePage] || 'Módulo do ecossistema AletheiaVision Core'}
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
            setActivePage={changePage} 
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

        {/* RELATÓRIOS */}
        {activePage === 'reports' && (
          <Reports submissions={submissions} editoras={editoras} triggerToast={triggerToast} />
        )}

        {/* DASHBOARD EXECUTIVO */}
        {activePage === 'dashboard' && (
          <Dashboard 
            submissions={submissions} 
            editoras={editoras} 
            tickets={tickets} 
            setActivePage={changePage} 
          />
        )}

        {/* REVISÃO HUMANA */}
        {activePage === 'review' && (
          <HumanReview 
            submissions={submissions} 
            onAction={handleAction} 
            triggerToast={triggerToast} 
          />
        )}

        {/* EDITORAS CLIENTES */}
        {activePage === 'editors' && (
          <EditorsClients 
            editoras={editoras} 
            submissions={submissions} 
            tickets={tickets} 
            setActivePage={changePage} 
          />
        )}

        {/* CONFIGURAÇÕES */}
        {activePage === 'settings' && (
          <Settings userRole={userRole} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}

        {/* PORTAL DO CLIENTE: SUBMISSÃO DE ARTIGO */}
        {activePage === 'client-submit' && (
          <ClientSubmit 
            clientSubmissions={submissions.filter(s => s.editor === 'Editora BioMed')} 
            triggerToast={triggerToast} 
          />
        )}
      </main>

      {/* Notifications */}
      <Toast 
        message={toastMessage} 
        visible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />

      {/* Chatbot for Client Portal */}
      {userRole === 'client' && <Chatbot />}
    </div>
  );
}
