import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Globe, 
  Download, 
  RefreshCw, 
  Search, 
  Trash2, 
  ArrowLeft, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Lock,
  LogOut,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ onNavigateHome }) {
  // Estado de Autenticação com a senha específica
  const [token, setToken] = useState(() => sessionStorage.getItem('reveste_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('reveste_admin_token') === '2257mackenzieADS');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState({
    totalLeads: 0,
    submitClicks: 0,
    pageViews: 0,
    conversionRate: 0,
    countries: [],
    timeline: [],
    recentLeads: []
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Submissão do Formulário de Senha
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (data.success || passwordInput === '2257mackenzieADS') {
        sessionStorage.setItem('reveste_admin_token', passwordInput);
        setToken(passwordInput);
        setIsAuthenticated(true);
      } else {
        setLoginError('Senha incorreta. Acesso não permitido.');
      }
    } catch {
      // Fallback de validação direta
      if (passwordInput === '2257mackenzieADS') {
        sessionStorage.setItem('reveste_admin_token', passwordInput);
        setToken(passwordInput);
        setIsAuthenticated(true);
      } else {
        setLoginError('Senha incorreta. Acesso não permitido.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('reveste_admin_token');
    setToken('');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Carregar estatísticas e leads
  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const authHeader = { 'x-admin-token': token || '2257mackenzieADS' };
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/stats', { headers: authHeader }),
        fetch(`/api/leads?search=${encodeURIComponent(searchTerm)}`, { headers: authHeader })
      ]);

      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (leadsData.success) {
        setLeads(leadsData.leads);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
      setStatusMsg('Erro ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Busca em tempo real com debounce
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      fetch(`/api/leads?search=${encodeURIComponent(searchTerm)}`, {
        headers: { 'x-admin-token': token || '2257mackenzieADS' }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setLeads(data.leads);
        })
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isAuthenticated]);

  const handleDeleteLead = async (id) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token || '2257mackenzieADS' }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter(l => l.id !== id));
        setDeleteConfirmId(null);
        // Atualizar estatísticas após exclusão
        const statsRes = await fetch('/api/stats', {
          headers: { 'x-admin-token': token || '2257mackenzieADS' }
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  // Helper para bandeira de país
  const getFlag = (code) => {
    if (!code || code.length !== 2) return '🌐';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Limpar telefone para link wa.me
  const formatWhatsappLink = (phone) => {
    if (!phone) return null;
    const cleanNumber = phone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    return `https://wa.me/${fullNumber}`;
  };

  // Formatar data em padrão pt-BR amigável
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recente';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // SE NÃO ESTIVER AUTENTICADO: RENDERIZA A TELA DE LOGIN COM A SENHA ESPECÍFICA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-100/80 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-sand-300 shadow-2xl relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nature-800 via-emerald-600 to-terracotta-500" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-nature-900 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-nature-900/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-nature-950 mb-2">
              Acesso Administrativo ReVeste
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Área restrita. Informe a senha de administrador para visualizar as estatísticas e contatos capturados.
            </p>
          </div>

          {/* Erro de Senha */}
          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite a senha..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-3.5 rounded-xl border border-sand-300 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/50 text-slate-800 text-sm transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-nature-900 hover:bg-nature-800 text-white font-bold text-sm shadow-lg shadow-nature-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-sand-200 text-center">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nature-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a Landing Page</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // TELA PRINCIPAL DO ADMIN (QUANDO AUTENTICADO)
  return (
    <div className="min-h-screen bg-sand-100/70 font-sans pb-20">
      
      {/* Top Admin Header */}
      <header className="bg-nature-950 text-white border-b border-nature-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-xl bg-nature-900 hover:bg-nature-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Voltar para a Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </button>

            <div className="h-5 w-px bg-nature-800" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-white">
                  Painel Administrativo ReVeste
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                  AO VIVO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Estatísticas em tempo real, monitoramento de conversão e gestão de leads
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-nature-900 hover:bg-nature-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-nature-800 transition-all cursor-pointer disabled:opacity-50"
              title="Atualizar dados agora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>

            <a
              href={`/api/export?token=${encodeURIComponent(token || '2257mackenzieADS')}`}
              download="reveste-leads.csv"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-nature-950 text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* KPI Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Total Leads */}
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Leads Cadastrados
              </span>
              <div className="font-display text-3xl font-black text-nature-950">
                {stats.totalLeads}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">
                Contatos salvos no banco
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Cliques em Enviar Formulário */}
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Cliques em "Enviar"
              </span>
              <div className="font-display text-3xl font-black text-nature-950">
                {stats.submitClicks}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 inline-block">
                Interações com o botão CTA
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MousePointerClick className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Taxa de Conversão */}
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Taxa de Conversão
              </span>
              <div className="font-display text-3xl font-black text-nature-950">
                {stats.conversionRate}%
              </div>
              <span className="text-[11px] font-semibold text-nature-700 mt-1 inline-block">
                Leads por cliques no botão
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-nature-100 text-nature-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total de Visualizações */}
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Visualizações da Página
              </span>
              <div className="font-display text-3xl font-black text-nature-950">
                {stats.pageViews}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 inline-block">
                Acessos à Landing Page
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Section: Distribuição Geográfica (Países de Acesso) */}
        <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-nature-700" />
              <h2 className="font-bold text-base text-slate-900">
                Origem dos Acessos por País
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Detecção automática via IP e fuso horário
            </span>
          </div>

          {stats.countries && stats.countries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.countries.map((c, i) => {
                const percent = stats.totalLeads > 0 
                  ? ((c.count / stats.totalLeads) * 100).toFixed(0) 
                  : 0;
                return (
                  <div key={i} className="p-4 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={c.country}>
                        {getFlag(c.country_code)}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {c.country || 'Brasil'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.count} {c.count === 1 ? 'contato' : 'contatos'} ({percent}%)
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-nature-800 bg-white px-2 py-1 rounded-lg border border-sand-200">
                      {c.country_code || 'BR'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-sm">
              Nenhum dado geográfico registrado ainda.
            </div>
          )}
        </div>

        {/* Section: Tabela de Leads */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-xs overflow-hidden">
          
          {/* Header da Tabela com Barra de Pesquisa */}
          <div className="p-6 border-b border-sand-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Lista de Contatos Capturados ({leads.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dados armazenados com segurança no banco SQLite
              </p>
            </div>

            {/* Input de Busca */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, e-mail, país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-sand-300 text-xs text-slate-800 focus:ring-2 focus:ring-nature-600 focus:border-nature-600 bg-sand-50/50"
              />
            </div>
          </div>

          {/* Tabela de Dados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-50/80 border-b border-sand-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">#ID</th>
                  <th className="py-3.5 px-4">Nome</th>
                  <th className="py-3.5 px-4">E-mail</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">País de Acesso</th>
                  <th className="py-3.5 px-4">Interesse</th>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-slate-700">
                {leads.length > 0 ? (
                  leads.map((lead) => {
                    const waLink = formatWhatsappLink(lead.whatsapp);
                    return (
                      <tr key={lead.id} className="hover:bg-sand-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                          #{lead.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {lead.name}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {lead.email ? (
                            <a 
                              href={`mailto:${lead.email}`}
                              className="text-nature-800 hover:text-emerald-700 flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{lead.email}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Não informado</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {lead.whatsapp ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition-colors"
                              title="Abrir conversa no WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{lead.whatsapp}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600 ml-0.5 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Não informado</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sand-100 text-slate-800 font-medium">
                            <span>{getFlag(lead.country_code)}</span>
                            <span>{lead.country || 'Brasil'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                          {lead.interest || 'Desconto 20%'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {deleteConfirmId === lead.id ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="px-2 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded-md bg-slate-200 text-slate-700 text-[11px] hover:bg-slate-300 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(lead.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir este contato"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-600">
                          {searchTerm ? 'Nenhum contato encontrado com este filtro.' : 'Nenhum lead cadastrado ainda.'}
                        </span>
                        <p className="text-xs text-slate-400">
                          Abra a Landing Page e envie o formulário de teste para vê-lo aqui em tempo real.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

    </div>
  );
}
