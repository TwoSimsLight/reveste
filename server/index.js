import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { 
  initDatabase,
  insertLead, 
  getAllLeads, 
  deleteLead, 
  trackEvent, 
  getStats, 
  exportLeadsToCSV,
  seedDemoData
} from './db.js';
import { detectLocation } from './geo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de registro de Leads (Formulário CTA da Landing Page)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, whatsapp, interest, timezone, locale } = req.body;

    if (!name || (!email && !whatsapp)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome e E-mail ou WhatsApp são obrigatórios.' 
      });
    }

    const location = await detectLocation(req, { timezone, locale });
    const userAgent = req.headers['user-agent'] || '';

    const newLead = await insertLead({
      name,
      email,
      whatsapp,
      interest: interest || 'Desconto 20% - Coleção Básicos Ecológicos',
      country: location.country,
      country_code: location.country_code,
      city: location.city,
      ip: location.ip,
      userAgent
    });

    return res.status(201).json({
      success: true,
      message: 'Parabéns! Seus dados foram salvos e seu cupom foi gerado.',
      coupon: 'REVESTE20',
      discount: '20% OFF',
      lead: newLead
    });
  } catch (error) {
    console.error('Erro ao cadastrar lead:', error);
    return res.status(500).json({ success: false, error: 'Erro interno ao salvar dados.' });
  }
});

// Rota de Rastreamento de Eventos (Cliques no botão, visualizações)
app.post('/api/track', async (req, res) => {
  try {
    const { eventType = 'submit_click', timezone, locale } = req.body;
    const location = await detectLocation(req, { timezone, locale });

    await trackEvent(eventType, {
      country: location.country,
      country_code: location.country_code,
      ip: location.ip
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao rastrear evento:', error);
    return res.status(500).json({ success: false, error: 'Erro no rastreamento.' });
  }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2257mackenzieADS';

function requireAdminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Acesso não autorizado. Senha incorreta.' });
}

// Rota de Verificação de Senha do Admin
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Autenticado com sucesso!' });
  }
  return res.status(401).json({ success: false, error: 'Senha incorreta. Tente novamente.' });
});

// Rota de Estatísticas para o Painel Administrativo (Protegida)
app.get('/api/stats', requireAdminAuth, async (req, res) => {
  try {
    const stats = await getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({ success: false, error: 'Erro ao calcular métricas.' });
  }
});

// Rota de Listagem de Leads (Protegida com filtro de busca)
app.get('/api/leads', requireAdminAuth, async (req, res) => {
  try {
    const { search = '' } = req.query;
    const leads = await getAllLeads(search);
    return res.json({ success: true, leads });
  } catch (error) {
    console.error('Erro ao listar leads:', error);
    return res.status(500).json({ success: false, error: 'Erro ao buscar contatos.' });
  }
});

// Rota para Excluir Lead (Protegida)
app.delete('/api/leads/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteLead(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Contato não encontrado.' });
    }
    return res.json({ success: true, message: 'Contato removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir lead:', error);
    return res.status(500).json({ success: false, error: 'Erro ao excluir contato.' });
  }
});

// Rota para Exportar Leads em CSV (Protegida)
app.get('/api/export', requireAdminAuth, async (req, res) => {
  try {
    const csvData = await exportLeadsToCSV();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reveste-leads.csv"');
    return res.send('\uFEFF' + csvData); // Adiciona BOM para abrir perfeitamente no Excel brasileiro
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return res.status(500).json({ success: false, error: 'Erro ao exportar CSV.' });
  }
});

// Rota para Gerar Dados Demonstrativos para a Apresentação Mackenzie ADS
app.post('/api/admin/seed', requireAdminAuth, async (req, res) => {
  try {
    const result = await seedDemoData();
    const stats = await getStats();
    return res.json({ 
      success: true, 
      message: 'Dados de apresentação gerados com sucesso!', 
      stats 
    });
  } catch (error) {
    console.error('Erro ao gerar dados de demonstração:', error);
    return res.status(500).json({ success: false, error: 'Erro ao gerar dados demonstrativos.' });
  }
});

// Rota para Criar Lead Manualmente pelo Painel Admin (Demonstração ao vivo para supervisão)
app.post('/api/admin/manual-lead', requireAdminAuth, async (req, res) => {
  try {
    const { name, email, whatsapp, interest, country, city } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório.' });
    }
    const countryCode = country === 'Portugal' ? 'PT' : (country === 'Estados Unidos' ? 'US' : 'BR');
    const newLead = await insertLead({
      name,
      email: email || '',
      whatsapp: whatsapp || '',
      interest: interest || 'Demonstração Mackenzie ADS',
      country: country || 'Brasil',
      country_code: countryCode,
      city: city || 'São Paulo',
      ip: 'Painel Admin',
      userAgent: 'Admin Manual'
    });
    return res.json({ success: true, lead: newLead, message: 'Contato inserido com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar lead manual:', error);
    return res.status(500).json({ success: false, error: 'Erro ao inserir lead.' });
  }
});

// Servir Frontend compilado (Vite dist) em produção
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    // Redireciona rotas de frontend (ex: /admin) para o index.html
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h1>API ReVeste está ativa!</h1>
        <p>O servidor está rodando na porta ${PORT}. Execute <code>npm run build</code> para gerar a aplicação estática ou <code>npm run dev</code> para o modo de desenvolvimento.</p>
      </div>
    `);
  });
}

// Inicializar banco de dados e iniciar servidor
async function startServer() {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Servidor ReVeste rodando em: http://localhost:${PORT} e http://127.0.0.1:${PORT}`);
    console.log(`📊 Painel Admin: http://localhost:${PORT}/admin`);
    console.log(`🔌 API: http://localhost:${PORT}/api/stats`);
  });
}

startServer().catch(err => {
  console.error('Falha fatal ao iniciar o servidor:', err);
});
