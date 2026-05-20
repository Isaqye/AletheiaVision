# 🔬 AletheiaVision Core — Módulo de Onboarding de Editoras

> **Protótipo 2** — Sistema complementar de apoio à decisão gerencial para a disciplina de **Sistemas de Informação Gerenciais (A4)**.

---

## 📋 Contexto do Projeto

O **AletheiaVision Core** é uma plataforma concebida para startups de integridade científica baseada em Inteligência Artificial. 

* **Protótipo 1 (Principal):** Responsável pelo núcleo analítico da empresa, utilizando IA, score de similaridade, classificação de risco, heatmaps e revisão humana para detectar indícios de fraude em imagens científicas biomédicas.
* **Protótipo 2 (Este Módulo):** Atua de forma complementar focado no **Onboarding de Editoras**. O seu papel é gerenciar e organizar a entrada de novas editoras na plataforma, estruturando o pipeline de vendas e implantação, controle de tickets de suporte, treinamentos da equipe editorial, integrações via API e a satisfação do cliente (NPS).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

*   **[React 19](https://react.dev/)** — Biblioteca JavaScript para construção de interfaces SPA eficientes e reativas.
*   **[Vite](https://vite.dev/)** — Build tool ultra-rápida para desenvolvimento frontend moderno.
*   **[Tailwind CSS (v4)](https://tailwindcss.com/)** — Framework utilitário para estilização e design system ágil.
*   **[Lucide React](https://lucide.dev/)** — Biblioteca de ícones modernos e minimalistas.

---

## ✨ Funcionalidades do Protótipo

A aplicação apresenta uma página única (Single Page Application) realista e funcional, simulando um ecossistema SaaS de alto nível:

1.  **Cabeçalho Gerencial:** Identificação clara do sistema com informações do usuário logado (`Gestor: Anthony Quaresma`) e atalhos rápidos.
2.  **Painel de KPIs:** Indicadores gerenciais essenciais atualizados dinamicamente:
    *   *Editoras em implantação* (Carga de trabalho ativa).
    *   *Tempo médio de Onboarding* (Métrica de eficiência do processo).
    *   *Taxa de conversão comercial*.
    *   *Tickets de suporte abertos* (Gargalos de atendimento).
    *   *NPS Médio* (Métrica de satisfação).
    *   *Integrações via API concluídas*.
3.  **Pipeline Visual de Onboarding:** Kanban interativo mostrando a distribuição volumétrica das editoras pelas etapas do processo:
    `Lead Recebido ➔ Demo Realizada ➔ Proposta Enviada ➔ Contrato Assinado ➔ Integração API ➔ Treinamento ➔ 30 dias de uso ➔ Cliente Ativo`.
4.  **Tabela Dinâmica de Clientes:** Exibe o volume de artigos por mês, sistema editorial utilizado (OJS, ScholarOne, Submissão manual), status de progresso, responsável e nível de prioridade (Alta, Média, Crítica).
5.  **Painel de Detalhes da Editora:** Ao selecionar uma editora na tabela, são revelados seus detalhes técnicos e comerciais completos, incluindo:
    *   **Checklist de Implantação:** Itens de qualificação, pendências técnicas e acompanhamento pós-venda.
    *   **Central de Tickets:** Resumo e controle de chamados técnicos abertos específicos daquele cliente.
    *   **Formulário de Ação Rápida:** Atualização em tempo real de status, atribuição de responsáveis e inclusão de observações gerenciais.
6.  **Apoio à Decisão Gerencial:** Mapeamento visual de como o protótipo auxilia as decisões nos três níveis organizacionais:
    *   **Operacional:** Acompanhamento e finalização de checklists e tarefas técnicas pendentes.
    *   **Tático:** Priorização de atendimento para editoras com maior volume e risco de atraso (gargalo de implantação).
    *   **Estratégico:** Identificação de padrões de satisfação e expansão para editoras com maior potencial de receita.

---

## 📂 Estrutura do Código

```text
AletheiaVision/
├── public/                 # Recursos estáticos
├── src/
│   ├── assets/             # Arquivos de mídia e imagens
│   ├── components/         # Componentes React reutilizáveis e modulares
│   │   ├── client/         # Componentes do painel principal e revisão
│   │   └── onboarding/     # Componentes específicos deste módulo de Onboarding
│   │       ├── EditorOnboardingDetails.jsx  # Detalhes, Checklist e Formulário
│   │       ├── EditorsTable.jsx             # Tabela de editoras em onboarding
│   │       ├── OnboardingDecisions.jsx      # Seção de decisões gerenciais
│   │       ├── OnboardingFilters.jsx        # Painel de filtros de pesquisa
│   │       ├── OnboardingKPIs.jsx           # Cards com indicadores-chave
│   │       └── Pipeline.jsx                 # Fluxograma de etapas do Onboarding
│   ├── App.jsx             # Componente central da aplicação (Orquestrador)
│   ├── App.css             # Estilizações globais adicionais
│   ├── index.css           # Configuração de design system e Tailwind CSS
│   └── main.jsx            # Ponto de entrada do React
├── eslint.config.js        # Configuração do Linter para qualidade do código
├── package.json            # Dependências e scripts do NPM
└── vite.config.js          # Configurações do Vite
```

---

## 🚀 Como Executar o Projeto

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

1.  **Navegue até a pasta do projeto:**
    ```bash
    cd AletheiaVision
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acesse a aplicação:**
    Abra o seu navegador e acesse o endereço gerado pelo Vite (normalmente `http://localhost:5173`).

---

## 👥 Equipe de Desenvolvimento

*   **Anthony Quaresma** — Gestão Geral / Responsável Comercial
*   **Luan Assis** — Desenvolvimento / Responsável Técnico
*   **Isaque Severino** — Desenvolvimento / Responsável Técnico
*   **Gabriel Rodrigues** — Desenvolvimento / Apoio Comercial
