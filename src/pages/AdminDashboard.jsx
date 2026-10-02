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
  AlertCircle,
  Database,
  Sparkles,
  Plus,
  X,
  CheckCircle,
  HelpCircle
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
    recentLeads: [],
    dbEngine: 'SQLite'
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [seeding, setSeeding] = useState(false);

  // Modal para adicionar lead manualmente
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    whatsapp: '',
    interest: 'Trocar roupas usadas por desconto de 20%',
    country: 'Brasil',
    city: 'São Paulo'
  });

  // Modal de ajuda para conectar PostgreSQL
  const [helpOpen, setHelpOpen] = useState(false);

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

  // Gerar dados de demonstração (ADS)
  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token || '2257mackenzieADS'
        }
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('✅ Dados de apresentação gerados com sucesso!');
        await fetchData();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error('Erro ao gerar dados:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Adicionar lead manualmente pelo admin
  const handleCreateLead = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      const res = await fetch('/api/admin/manual-lead', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token || '2257mackenzieADS'
        },
        body: JSON.stringify(newLead)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setNewLead({
          name: '',
          email: '',
          whatsapp: '',
          interest: 'Trocar roupas usadas por desconto de 20%',
          country: 'Brasil',
          city: 'São Paulo'
        });
        setStatusMsg('✅ Contato cadastrado com sucesso!');
        await fetchData();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error('Erro ao adicionar contato manual:', err);
    } finally {
      setModalSubmitting(false);
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
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nature-800 via-emerald-600 to-terracotta-500" />

          <div className="w-16 h-16 rounded-2xl bg-nature-900 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-nature-900/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-nature-950 mb-2">
              Acesso Administrativo ReVeste
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Área restrita para supervisão do projeto. Informe a senha para visualizar as estatísticas e contatos.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                  Painel Administrativo ReVeste
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                  AO VIVO
                </span>
                
                {/* Badge do Motor de Banco de Dados */}
                <span 
                  onClick={() => setHelpOpen(true)}
                  className={`cursor-pointer px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                    stats.dbEngine?.includes('PostgreSQL')
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
                      : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900'
                  }`}
                  title="Clique para saber como conectar a nuvem PostgreSQL"
                >
                  <Database className="w-3 h-3" />
                  <span>{stats.dbEngine || 'SQLite'}</span>
                  <HelpCircle className="w-2.5 h-2.5 opacity-70" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Apresentação Mackenzie ADS • Monitoramento de conversão e gestão de leads
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            
            {/* Botão de Adicionar Lead Manual */}
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-nature-900 hover:bg-nature-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-nature-700/80 transition-all cursor-pointer shadow-xs"
              title="Cadastrar lead de teste na hora"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Contato</span>
            </button>

            {/* Botão de Gerar Dados para Apresentação */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="px-3 py-1.5 rounded-xl bg-nature-900 hover:bg-nature-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Gerar leads e métricas completos para apresentar aos supervisores"
            >
              <Sparkles className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Gerando...' : 'Dados Demonstração (ADS)'}</span>
            </button>

            {/* Atualizar */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-xl bg-nature-900 hover:bg-nature-800 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-nature-800 transition-all cursor-pointer disabled:opacity-50"
              title="Atualizar dados agora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            {/* Exportar CSV */}
            <a
              href={`/api/export?token=${encodeURIComponent(token || '2257mackenzieADS')}`}
              download="reveste-leads.csv"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-nature-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </a>

            {/* Sair */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Encerrar sessão de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Status Toast Message */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Banner de Aviso de Persistência caso ainda esteja em SQLite */}
        {!stats.dbEngine?.includes('PostgreSQL') && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <div>
                <strong className="text-xs font-bold block sm:inline">Dica para sua Apresentação: </strong>
                <span className="text-xs">
                  O plano gratuito do Render desliga containers após 15 min sem acesso. Você pode clicar em <strong>"Dados Demonstração (ADS)"</strong> para preencher o painel a qualquer momento, ou conectar o <strong>PostgreSQL gratuito (Neon.tech)</strong> para manter dados eternamente.
                </span>
              </div>
            </div>
            <button
              onClick={() => setHelpOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              Ver Tutorial de 1 min
            </button>
          </div>
        )}

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
                Dados armazenados no banco • Apresentação Mackenzie ADS
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
                          {searchTerm ? 'Nenhum contato encontrado com este filtro.' : 'Nenhum lead cadastrado no momento.'}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleSeedDemo}
                            className="px-4 py-2 rounded-xl bg-nature-900 text-white text-xs font-bold hover:bg-nature-800 transition-colors cursor-pointer shadow-sm"
                          >
                            🧪 Gerar Dados de Apresentação Agora
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* MODAL: Adicionar Contato Manual (Para apresentação ao vivo) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sand-300 shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200 mb-5">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Cadastrar Lead de Demonstração
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-sand-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@exemplo.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={newLead.whatsapp}
                    onChange={(e) => setNewLead({ ...newLead, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    País
                  </label>
                  <select
                    value={newLead.country}
                    onChange={(e) => setNewLead({ ...newLead, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                  >
                    <option value="Brasil">Brasil 🇧🇷</option>
                    <option value="Portugal">Portugal 🇵🇹</option>
                    <option value="Estados Unidos">Estados Unidos 🇺🇸</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={newLead.city}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Interesse
                </label>
                <select
                  value={newLead.interest}
                  onChange={(e) => setNewLead({ ...newLead, interest: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs focus:ring-2 focus:ring-nature-600"
                >
                  <option value="Trocar roupas usadas por desconto de 20%">Trocar roupas usadas por desconto de 20%</option>
                  <option value="Comprar roupas básicas em algodão orgânico">Comprar roupas básicas em algodão orgânico</option>
                  <option value="Conhecer o projeto de moda circular e ética">Conhecer o projeto de moda circular e ética</option>
                  <option value="Apresentação Mackenzie ADS">Demonstração Mackenzie ADS</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-sand-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 rounded-xl bg-nature-900 hover:bg-nature-800 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {modalSubmitting ? 'Salvando...' : 'Salvar Contato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tutorial Rápido de Conexão com PostgreSQL Neon */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sand-300 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Como ter Banco de Dados 100% Permanente
                </h3>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-1.5 rounded-xl hover:bg-sand-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Por que o Render reseta o SQLite?</strong> O plano gratuito do Render desliga o servidor após 15 minutos sem visitas para economizar energia. Como o SQLite grava em um arquivo de disco temporário, ao religar o arquivo volta ao estado do Git.
              </p>
              
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <h4 className="font-bold text-xs mb-1">Como resolver definitivamente com PostgreSQL Grátis:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 mt-2">
                  <li>Acesse <strong>neon.tech</strong> e faça login com seu GitHub (1 clique).</li>
                  <li>Copie a URL de conexão do PostgreSQL (começa com <code>postgres://...</code>).</li>
                  <li>No painel do Render, vá em <strong>Environment</strong> e adicione a variável:
                    <div className="font-mono text-[11px] bg-white p-1.5 rounded-lg border border-emerald-300 my-1 text-slate-800">
                      DATABASE_URL = postgres://seu-link-do-neon
                    </div>
                  </li>
                  <li>Pronto! O sistema detecta automaticamente e salva tudo na nuvem sem resetar nunca mais.</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-sand-100 border border-sand-300 text-slate-700">
                <strong>💡 Garantia para sua apresentação:</strong>
                <p className="mt-1">
                  Enquanto não configurar o PostgreSQL, você pode usar o botão <strong>"Dados Demonstração (ADS)"</strong> no topo para preencher a tela na hora da apresentação com 1 clique!
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-sand-200 text-right">
              <button
                onClick={() => setHelpOpen(false)}
                className="px-5 py-2 rounded-xl bg-nature-900 text-white text-xs font-bold"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
