import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Armazenar o banco em pasta data/
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'reveste.sqlite');
const db = new DatabaseSync(dbPath);

// Inicializar tabelas
db.exec(`
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

export function insertLead(data) {
  const stmt = db.prepare(`
    INSERT INTO leads (name, email, whatsapp, interest, country, country_code, city, ip, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    data.name?.trim() || '',
    data.email?.trim().toLowerCase() || '',
    data.whatsapp?.trim() || '',
    data.interest || 'Moda Básica & Sustentável',
    data.country || 'Brasil',
    data.country_code || 'BR',
    data.city || '',
    data.ip || '',
    data.userAgent || ''
  );

  // Também registra o evento de conversão
  trackEvent('lead_submitted', {
    country: data.country || 'Brasil',
    country_code: data.country_code || 'BR',
    ip: data.ip || ''
  });

  return { id: result.lastInsertRowid, ...data };
}

export function getAllLeads(search = '') {
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

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

export function deleteLead(id) {
  const stmt = db.prepare(`DELETE FROM leads WHERE id = ?`);
  const result = stmt.run(Number(id));
  return result.changes > 0;
}

export function trackEvent(eventType, metadata = {}) {
  const stmt = db.prepare(`
    INSERT INTO events (event_type, country, country_code, ip)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(
    eventType,
    metadata.country || 'Brasil',
    metadata.country_code || 'BR',
    metadata.ip || ''
  );
}

export function getStats() {
  // Total de leads
  const totalLeadsStmt = db.prepare(`SELECT COUNT(*) as count FROM leads`);
  const totalLeads = totalLeadsStmt.get().count;

  // Total de cliques no botão de enviar formulário
  const submitClicksStmt = db.prepare(`SELECT COUNT(*) as count FROM events WHERE event_type = 'submit_click'`);
  const submitClicks = submitClicksStmt.get().count;

  // Total de visualizações da página
  const pageViewsStmt = db.prepare(`SELECT COUNT(*) as count FROM events WHERE event_type = 'page_view'`);
  const pageViews = pageViewsStmt.get().count;

  // Taxa de conversão: (leads / submitClicks) se submitClicks > 0, ou (leads / pageViews)
  const conversionRate = submitClicks > 0 
    ? ((totalLeads / submitClicks) * 100).toFixed(1) 
    : (pageViews > 0 ? ((totalLeads / pageViews) * 100).toFixed(1) : 0);

  // Distribuição por país dos leads
  const countriesStmt = db.prepare(`
    SELECT country, country_code, COUNT(*) as count 
    FROM leads 
    GROUP BY country, country_code 
    ORDER BY count DESC 
    LIMIT 10
  `);
  const countries = countriesStmt.all();

  // Histórico recente diário (últimos 7 dias)
  const recentTimelineStmt = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM leads 
    GROUP BY DATE(created_at) 
    ORDER BY date DESC 
    LIMIT 7
  `);
  const timeline = recentTimelineStmt.all();

  // Últimos 5 leads
  const recentLeadsStmt = db.prepare(`SELECT * FROM leads ORDER BY id DESC LIMIT 5`);
  const recentLeads = recentLeadsStmt.all();

  return {
    totalLeads,
    submitClicks,
    pageViews,
    conversionRate: Number(conversionRate),
    countries,
    timeline,
    recentLeads
  };
}

export function exportLeadsToCSV() {
  const leads = getAllLeads();
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

export default db;
