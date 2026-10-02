import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Identificar se há banco PostgreSQL configurado no ambiente (Neon, Supabase, Render Postgres)
const isPostgres = Boolean(process.env.DATABASE_URL);

let pool = null;
let sqliteDb = null;

if (isPostgres) {
  console.log('🐘 Conectando ao Banco de Dados PostgreSQL na nuvem...');
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  console.log('📁 Utilizando Banco de Dados SQLite local...');
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'reveste.sqlite');
  sqliteDb = new DatabaseSync(dbPath);
}

// Inicializar tabelas de forma assíncrona
export async function initDatabase() {
  if (isPostgres) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          whatsapp TEXT,
          interest TEXT,
          country TEXT DEFAULT 'Brasil',
          country_code TEXT DEFAULT 'BR',
          city TEXT DEFAULT '',
          ip TEXT DEFAULT '',
          user_agent TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          event_type TEXT NOT NULL,
          country TEXT DEFAULT 'Brasil',
          country_code TEXT DEFAULT 'BR',
          ip TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tabelas PostgreSQL verificadas/criadas com sucesso.');
    } catch (err) {
      console.error('❌ Erro ao inicializar tabelas PostgreSQL:', err);
    }
  } else {
    try {
      sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          whatsapp TEXT,
          interest TEXT,
          country TEXT DEFAULT 'Brasil',
          country_code TEXT DEFAULT 'BR',
          city TEXT DEFAULT '',
          ip TEXT DEFAULT '',
          user_agent TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          country TEXT DEFAULT 'Brasil',
          country_code TEXT DEFAULT 'BR',
          ip TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tabelas SQLite verificadas/criadas com sucesso.');
    } catch (err) {
      console.error('❌ Erro ao inicializar tabelas SQLite:', err);
    }
  }

  // Se o banco estiver vazio, adiciona dados iniciais para a apresentação nunca ficar zerada
  try {
    const leads = await getAllLeads();
    if (leads.length === 0) {
      console.log('🌱 Inicializando banco com dados demonstrativos para apresentação...');
      await seedDemoData();
    }
  } catch (e) {
    console.error('Aviso na checagem inicial de dados:', e);
  }
}

export async function insertLead(data) {
  const name = data.name?.trim() || '';
  const email = data.email?.trim().toLowerCase() || '';
  const whatsapp = data.whatsapp?.trim() || '';
  const interest = data.interest || 'Moda Básica & Sustentável';
  const country = data.country || 'Brasil';
  const country_code = data.country_code || 'BR';
  const city = data.city || '';
  const ip = data.ip || '';
  const userAgent = data.userAgent || '';

  let newId;

  if (isPostgres) {
    const res = await pool.query(
      `INSERT INTO leads (name, email, whatsapp, interest, country, country_code, city, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [name, email, whatsapp, interest, country, country_code, city, ip, userAgent]
    );
    newId = res.rows[0].id;
  } else {
    const stmt = sqliteDb.prepare(`
      INSERT INTO leads (name, email, whatsapp, interest, country, country_code, city, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(name, email, whatsapp, interest, country, country_code, city, ip, userAgent);
    newId = res.lastInsertRowid;
  }

  // Também registra o evento de conversão
  await trackEvent('lead_submitted', { country, country_code, ip });

  return { id: newId, ...data };
}

export async function getAllLeads(search = '') {
  if (isPostgres) {
    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      const res = await pool.query(
        `SELECT * FROM leads 
         WHERE name ILIKE $1 OR email ILIKE $1 OR whatsapp ILIKE $1 OR country ILIKE $1 
         ORDER BY id DESC`,
        [term]
      );
      return res.rows;
    }
    const res = await pool.query(`SELECT * FROM leads ORDER BY id DESC`);
    return res.rows;
  } else {
    let query = `SELECT * FROM leads ORDER BY id DESC`;
    const params = [];
    if (search && search.trim() !== '') {
      query = `
        SELECT * FROM leads 
        WHERE name LIKE ? OR email LIKE ? OR whatsapp LIKE ? OR country LIKE ?
        ORDER BY id DESC
      `;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }
    const stmt = sqliteDb.prepare(query);
    return stmt.all(...params);
  }
}

export async function deleteLead(id) {
  if (isPostgres) {
    const res = await pool.query(`DELETE FROM leads WHERE id = $1`, [Number(id)]);
    return res.rowCount > 0;
  } else {
    const stmt = sqliteDb.prepare(`DELETE FROM leads WHERE id = ?`);
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }
}

export async function trackEvent(eventType, metadata = {}) {
  const country = metadata.country || 'Brasil';
  const country_code = metadata.country_code || 'BR';
  const ip = metadata.ip || '';

  if (isPostgres) {
    await pool.query(
      `INSERT INTO events (event_type, country, country_code, ip) VALUES ($1, $2, $3, $4)`,
      [eventType, country, country_code, ip]
    );
  } else {
    const stmt = sqliteDb.prepare(`
      INSERT INTO events (event_type, country, country_code, ip) VALUES (?, ?, ?, ?)
    `);
    stmt.run(eventType, country, country_code, ip);
  }
}

export async function getStats() {
  let totalLeads = 0;
  let submitClicks = 0;
  let pageViews = 0;
  let countries = [];
  let timeline = [];
  let recentLeads = [];

  if (isPostgres) {
    const leadsCountRes = await pool.query(`SELECT COUNT(*)::int as count FROM leads`);
    totalLeads = leadsCountRes.rows[0].count;

    const clicksRes = await pool.query(`SELECT COUNT(*)::int as count FROM events WHERE event_type = 'submit_click'`);
    submitClicks = clicksRes.rows[0].count;

    const viewsRes = await pool.query(`SELECT COUNT(*)::int as count FROM events WHERE event_type = 'page_view'`);
    pageViews = viewsRes.rows[0].count;

    const countriesRes = await pool.query(`
      SELECT country, country_code, COUNT(*)::int as count 
      FROM leads 
      GROUP BY country, country_code 
      ORDER BY count DESC 
      LIMIT 10
    `);
    countries = countriesRes.rows;

    const timelineRes = await pool.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*)::int as count 
      FROM leads 
      GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD') 
      ORDER BY date DESC 
      LIMIT 7
    `);
    timeline = timelineRes.rows;

    const recentRes = await pool.query(`SELECT * FROM leads ORDER BY id DESC LIMIT 5`);
    recentLeads = recentRes.rows;
  } else {
    const totalLeadsStmt = sqliteDb.prepare(`SELECT COUNT(*) as count FROM leads`);
    totalLeads = totalLeadsStmt.get().count;

    const submitClicksStmt = sqliteDb.prepare(`SELECT COUNT(*) as count FROM events WHERE event_type = 'submit_click'`);
    submitClicks = submitClicksStmt.get().count;

    const pageViewsStmt = sqliteDb.prepare(`SELECT COUNT(*) as count FROM events WHERE event_type = 'page_view'`);
    pageViews = pageViewsStmt.get().count;

    const countriesStmt = sqliteDb.prepare(`
      SELECT country, country_code, COUNT(*) as count 
      FROM leads 
      GROUP BY country, country_code 
      ORDER BY count DESC 
      LIMIT 10
    `);
    countries = countriesStmt.all();

    const recentTimelineStmt = sqliteDb.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM leads 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT 7
    `);
    timeline = recentTimelineStmt.all();

    const recentLeadsStmt = sqliteDb.prepare(`SELECT * FROM leads ORDER BY id DESC LIMIT 5`);
    recentLeads = recentLeadsStmt.all();
  }

  // Taxa de conversão: (leads / submitClicks) se submitClicks > 0, ou (leads / pageViews)
  const conversionRate = submitClicks > 0 
    ? ((totalLeads / submitClicks) * 100).toFixed(1) 
    : (pageViews > 0 ? ((totalLeads / pageViews) * 100).toFixed(1) : 0);

  return {
    totalLeads,
    submitClicks,
    pageViews,
    conversionRate: Number(conversionRate),
    countries,
    timeline,
    recentLeads,
    dbEngine: isPostgres ? 'PostgreSQL (Nuvem Conectada)' : 'SQLite (Armazenamento Local)'
  };
}

export async function exportLeadsToCSV() {
  const leads = await getAllLeads();
  const headers = ['ID', 'Nome', 'Email', 'WhatsApp', 'Interesse', 'Pais', 'Codigo Pais', 'Cidade', 'Data de Cadastro'];
  
  const rows = leads.map(l => [
    l.id,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.whatsapp || '').replace(/"/g, '""')}"`,
    `"${(l.interest || '').replace(/"/g, '""')}"`,
    `"${(l.country || '').replace(/"/g, '""')}"`,
    `"${(l.country_code || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    `"${(l.created_at || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Inserir dados demonstrativos ricos para apresentação
export async function seedDemoData() {
  const demoLeads = [
    {
      name: 'Maria Clara da Silva',
      email: 'maria.clara@emailteste.com.br',
      whatsapp: '(11) 98765-4321',
      interest: 'Trocar roupas usadas por desconto de 20%',
      country: 'Brasil',
      country_code: 'BR',
      city: 'São Paulo'
    },
    {
      name: 'Lucas Ferreira Lima',
      email: 'lucas.ferreira@gmail.com',
      whatsapp: '(21) 99123-4567',
      interest: 'Comprar roupas básicas em algodão orgânico',
      country: 'Brasil',
      country_code: 'BR',
      city: 'Rio de Janeiro'
    },
    {
      name: 'Beatriz Albuquerque',
      email: 'bia.albuquerque@outlook.com',
      whatsapp: '(11) 97654-3210',
      interest: 'Conhecer o projeto de moda circular e ética',
      country: 'Brasil',
      country_code: 'BR',
      city: 'Campinas'
    },
    {
      name: 'Gabriel Mendonça',
      email: 'gabriel.m@gmail.com',
      whatsapp: '(41) 98877-6655',
      interest: 'Trocar roupas usadas por desconto de 20%',
      country: 'Brasil',
      country_code: 'BR',
      city: 'Curitiba'
    },
    {
      name: 'Mariana Costa Ribeiro',
      email: 'mariana.costa@uol.com.br',
      whatsapp: '(31) 99455-1122',
      interest: 'Comprar roupas básicas em algodão orgânico',
      country: 'Brasil',
      country_code: 'BR',
      city: 'Belo Horizonte'
    },
    {
      name: 'João Pedro Duarte',
      email: 'jp.duarte@sapo.pt',
      whatsapp: '+351 912 345 678',
      interest: 'Conhecer o projeto de moda circular e ética',
      country: 'Portugal',
      country_code: 'PT',
      city: 'Lisboa'
    }
  ];

  for (const lead of demoLeads) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO leads (name, email, whatsapp, interest, country, country_code, city, ip, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [lead.name, lead.email, lead.whatsapp, lead.interest, lead.country, lead.country_code, lead.city, '127.0.0.1', 'Demo']
      );
    } else {
      const stmt = sqliteDb.prepare(`
        INSERT INTO leads (name, email, whatsapp, interest, country, country_code, city, ip, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(lead.name, lead.email, lead.whatsapp, lead.interest, lead.country, lead.country_code, lead.city, '127.0.0.1', 'Demo');
    }
  }

  // Inserir eventos de cliques e visitas correspondentes
  for (let i = 0; i < 18; i++) {
    await trackEvent('page_view', { country: 'Brasil', country_code: 'BR' });
  }
  for (let i = 0; i < 10; i++) {
    await trackEvent('submit_click', { country: 'Brasil', country_code: 'BR' });
  }

  return { success: true, count: demoLeads.length };
}

export default {
  initDatabase,
  insertLead,
  getAllLeads,
  deleteLead,
  trackEvent,
  getStats,
  exportLeadsToCSV,
  seedDemoData
};
