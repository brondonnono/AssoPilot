const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Garde une référence globale de la fenêtre (évite la fermeture automatique)
let mainWindow;

// Base de données
let db;

// 🔧 Fonction pour créer la fenêtre principale
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'public/assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // sécurité
      nodeIntegration: false,
      sandbox: false
    }
  });

  // En dev → charge Angular via localhost
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    // En prod → charge les fichiers buildés Angular
    mainWindow.loadFile(path.join(__dirname, 'dist/asso-pilot/browser/index.html'));
  }

  // Crée la DB si elle n’existe pas
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const dbPath = path.join(dataDir, 'app_237.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Erreur DB:', err.message);
    console.log('Base SQLite connectée à', dbPath);
    initializeDatabase();
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

// Création table et utilisateur root au premier lancement
async function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Vérifie si un utilisateur root existe
    db.get(`SELECT * FROM users WHERE username = ?`, ['root'], async (err, row) => {
      if (err) return console.error(err);
      if (!row) {
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const hashedPassword = await bcrypt.hash('root_237', 10);

        const stmt = db.prepare(`INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)`);
        stmt.run(id, 'root', hashedPassword, 'root', createdAt, function (err) {
          if (err) console.error('Erreur insertion root:', err);
          else console.log('Utilisateur root créé avec succès');
        });
        stmt.finalize();
      }
    });
  });
}

// 💬 Exemple de communication IPC (Angular → Electron → Angular)
ipcMain.handle('open-dialog', async (_, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result.filePaths;
});

// IPC Handlers pour Angular
ipcMain.handle('run-query', async (_, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

//Login offline

ipcMain.handle('login', async (_, username, password) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) return reject(err);
      if (!user) return resolve({ success: false, message: 'Utilisateur non trouvé' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return resolve({ success: false, message: 'Mot de passe incorrect' });

      resolve({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    });
  });
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

// 🚀 Lancement
app.whenReady().then(createWindow);

// Sur macOS, recrée la fenêtre si l'app est réactivée
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quitter si toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

