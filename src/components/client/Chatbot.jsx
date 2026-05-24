import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

const FAQ_RESPONSES = {
  'como submeter': {
    answer: 'Para submeter um artigo para análise, acesse o menu "Análise de Imagem (IA)" no painel lateral e clique em "Submeter Artigo para Análise". Você poderá fazer upload das imagens do artigo e a IA analisará automaticamente.',
  },
  'prazo': {
    answer: 'O prazo médio de análise de imagens pela IA é de 24 a 48 horas úteis. Casos com alto risco de manipulação podem levar até 72 horas pois passam por revisão humana adicional.',
  },
  'score': {
    answer: 'O score de integridade varia de 0.00 a 1.00. Valores acima de 0.70 indicam alto risco de manipulação de imagem. Valores entre 0.40 e 0.70 indicam risco médio, e abaixo de 0.40 indicam baixo risco.',
  },
  'chamado': {
    answer: 'Para abrir um chamado de suporte, acesse "Meus Chamados" no menu lateral. Clique em "Novo Chamado", preencha o assunto, categoria, prioridade e descrição. Nossa equipe técnica responderá em até 24 horas.',
  },
  'relatório': {
    answer: 'Você pode exportar relatórios de análise em formato PDF diretamente do painel. Acesse a submissão desejada e clique em "Exportar Relatório". Também disponibilizamos a rota de API GET /api/v1/submissions/{id}/report.',
  },
  'integração': {
    answer: 'A AletheiaVision oferece integração via API REST com os principais sistemas editoriais como OJS, ScholarOne e Editorial Manager. Consulte nossa documentação técnica em Configurações > API para obter as credenciais e endpoints.',
  },
  'api': {
    answer: 'Nossa API REST utiliza autenticação JWT. Os tokens de acesso podem ser gerados em Configurações > API Keys. A documentação completa com exemplos de requisição está disponível em docs.aletheiavision.com.',
  },
  'plano': {
    answer: 'A Editora BioMed possui o Plano Profissional, que inclui até 500 análises/mês, acesso à API REST, relatórios avançados em PDF, suporte prioritário e integração com OJS. Para upgrade, entre em contato com o comercial.',
  },
  'contato': {
    answer: 'Para falar com nossa equipe:\n• Suporte técnico: suporte@aletheiavision.com\n• Comercial: comercial@aletheiavision.com\n• Responsável técnico da sua conta: Luan Assis\n• Ou abra um chamado pelo portal.',
  },
};

const QUICK_QUESTIONS = [
  'Como submeter um artigo?',
  'Qual o prazo de análise?',
  'O que significa o score?',
  'Como abrir um chamado?',
  'Como exportar relatório?',
  'Integração com OJS',
];

function matchResponse(input) {
  const lower = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
    const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lower.includes(normalizedKey)) {
      return value.answer;
    }
  }

  // Keyword-based fallback matching
  if (lower.includes('submeter') || lower.includes('enviar') || lower.includes('upload') || lower.includes('artigo')) {
    return FAQ_RESPONSES['como submeter'].answer;
  }
  if (lower.includes('prazo') || lower.includes('tempo') || lower.includes('demora') || lower.includes('quanto tempo')) {
    return FAQ_RESPONSES['prazo'].answer;
  }
  if (lower.includes('score') || lower.includes('nota') || lower.includes('pontuacao') || lower.includes('risco')) {
    return FAQ_RESPONSES['score'].answer;
  }
  if (lower.includes('chamado') || lower.includes('ticket') || lower.includes('suporte') || lower.includes('ajuda')) {
    return FAQ_RESPONSES['chamado'].answer;
  }
  if (lower.includes('relatorio') || lower.includes('pdf') || lower.includes('exportar')) {
    return FAQ_RESPONSES['relatório'].answer;
  }
  if (lower.includes('integracao') || lower.includes('ojs') || lower.includes('scholarone') || lower.includes('editorial')) {
    return FAQ_RESPONSES['integração'].answer;
  }
  if (lower.includes('api') || lower.includes('token') || lower.includes('jwt') || lower.includes('endpoint')) {
    return FAQ_RESPONSES['api'].answer;
  }
  if (lower.includes('plano') || lower.includes('assinatura') || lower.includes('profissional')) {
    return FAQ_RESPONSES['plano'].answer;
  }
  if (lower.includes('contato') || lower.includes('email') || lower.includes('telefone') || lower.includes('falar')) {
    return FAQ_RESPONSES['contato'].answer;
  }

  return 'Desculpe, não encontrei uma resposta exata para sua dúvida. Tente reformular ou selecione uma das perguntas sugeridas abaixo. Se preferir, abra um chamado de suporte para falar com nossa equipe técnica. 😊';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: 'Olá! 👋 Sou o assistente virtual da AletheiaVision. Como posso ajudar você hoje? Selecione uma das perguntas frequentes ou digite sua dúvida.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      from: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = matchResponse(text);
      const botMsg = {
        id: messages.length + 2,
        from: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const unreadCount = isOpen ? 0 : messages.filter(m => m.from === 'bot').length > 1 ? 1 : 0;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9999] w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-fade-in-up"
          style={{
            boxShadow: '0 20px 60px rgba(7, 59, 102, 0.2), 0 0 0 1px rgba(0, 184, 200, 0.1)',
          }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-dark via-blue-petrol to-blue-dark p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-brand/20 flex items-center justify-center border-2 border-cyan-brand/40">
                <Bot size={20} className="text-cyan-brand" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">Assistente AletheiaVision</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-live-pulse" />
                  <span className="text-[10px] text-cyan-brand/80 font-medium">Online agora</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50" style={{ maxHeight: '340px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
                style={{ animationDuration: '0.3s' }}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.from === 'bot'
                      ? 'bg-gradient-to-br from-cyan-brand/20 to-blue-petrol/20 border border-cyan-brand/30'
                      : 'bg-gradient-to-br from-blue-dark to-blue-petrol'
                  }`}
                >
                  {msg.from === 'bot' ? (
                    <Bot size={14} className="text-cyan-brand" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.from === 'bot'
                      ? 'bg-white text-slate-700 border border-slate-200/80 rounded-tl-sm shadow-sm'
                      : 'bg-gradient-to-br from-blue-dark to-blue-petrol text-white rounded-tr-sm shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[9px] mt-1.5 block ${
                      msg.from === 'bot' ? 'text-slate-400' : 'text-cyan-brand/60'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-cyan-brand/20 to-blue-petrol/20 border border-cyan-brand/30">
                  <Bot size={14} className="text-cyan-brand" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {(
            <div className="px-4 py-2 border-t border-slate-100 bg-white shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Perguntas frequentes</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-2.5 py-1.5 text-[10px] font-semibold text-blue-petrol bg-cyan-brand/8 border border-cyan-brand/20 rounded-full hover:bg-cyan-brand/20 hover:border-cyan-brand/40 cursor-pointer transition-all active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200/80 bg-white flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-brand/30 focus:border-cyan-brand/50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 shrink-0 ${
                inputValue.trim()
                  ? 'bg-gradient-to-br from-cyan-brand to-blue-petrol text-white shadow-lg shadow-cyan-brand/30 hover:shadow-xl'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-cyan-brand to-blue-petrol text-white flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all animate-pulse-glow"
        style={{
          boxShadow: '0 8px 30px rgba(0, 184, 200, 0.35), 0 0 0 3px rgba(0, 184, 200, 0.1)',
        }}
      >
        {isOpen ? (
          <ChevronDown size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
