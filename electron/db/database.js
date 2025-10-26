const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { count } = require('console');

let db;

function initDatabase() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const dbPath = path.join(dataDir, 'app.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error(err.message);
    console.log('SQLite DB ready at', dbPath);
    initializeTables();
  });
}

function initializeTables() {
  db.serialize(() => {
    // --- USERS ---
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    db.get(`SELECT * FROM users WHERE username=?`, ['root'], async (err, row) => {
      if (err) console.error(err);
      if (!row) {
        const id = uuidv4();
        const hashedPassword = await bcrypt.hashSync('root123', 10);
        const created_at = new Date().toISOString();
        db.run(
          `INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)`,
          [id, 'root', hashedPassword, 'root', created_at],
        );
        console.log('Root admin created');
      }
    });

    // --- MEMBERS ---
    db.run(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        cni TEXT,
        status TEXT,
        joined_date TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    // --- COTISATIONS ---
    db.run(`
      CREATE TABLE IF NOT EXISTS cotisations (
        id TEXT PRIMARY KEY,
        title TEXT,
        amount REAL,
        frequency TEXT,
        start_date TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS cotisation_members (
        cotisation_id TEXT,
        member_id TEXT,
        PRIMARY KEY(cotisation_id, member_id)
      )
    `);

    // --- EVENTS ---
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        label TEXT,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        location TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS event_members (
        event_id TEXT,
        member_id TEXT,
        PRIMARY KEY(event_id, member_id)
      )
    `);

    // --- LOGS ---
    db.run(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        action TEXT,
        user_id TEXT,
        target_id TEXT,
        created_at TEXT
      )
    `);
  });
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function runExec(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// --- IMPORT EXCEL GÉNÉRIQUE ---
async function importExcel(table, filePath) {
  if (!fs.existsSync(filePath)) throw new Error('File does not exist');
  /*
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  if (!data.length) return { success: false, count: 0 };

  // Préparer la requête SQL
  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => '?').join(',');
  const insertQuery = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

  for (const row of data) {
    const values = columns.map(col => row[col] ?? (col === 'id' ? uuidv4() : null));
    await runQuery(insertQuery, values);
  }

  return { success: true, count: data.length };
*/
  return { success: false, count: 0 };
}

// --- EXPORT EXCEL GÉNÉRIQUE ---
async function exportExcel(table, filePath) {
  /*  const rows = await runQuery(`SELECT * FROM ${table}`);
  if (!rows.length) return { success: true, count: 0 };

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, table);

  XLSX.writeFile(workbook, filePath);
  return { success: true, count: rows.length };
*/
  return { success: false, count: 0 };
}

module.exports = { initDatabase, runQuery, runExec, importExcel, exportExcel };
