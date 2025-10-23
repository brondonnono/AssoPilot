const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

let db;

function initDatabase() {
  const dataDir = path.join(__dirname, '..', 'data');
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
        const hashedPassword = await bcrypt.hash('root123', 10);
        const created_at = new Date().toISOString();
        db.run(`INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)`,
          [id, 'root', hashedPassword, 'admin', created_at]
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

module.exports = { initDatabase, runQuery };
