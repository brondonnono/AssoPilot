const { app, BrowserWindow, Menu, screen, ipcMain, dialog } = require('electron');
const { initDatabase, runQuery, importExcel, exportExcel } = require('./db/database');
const path = require('path');

// Garde une référence globale de la fenêtre (évite la fermeture automatique)
let mainWindow;

// 🔧 Fonction pour créer la fenêtre principale
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'public/assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // sécurité
      nodeIntegration: false,
      sandbox: false,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadFile('electron/loader.html');

  setTimeout(() => {
    // En dev → charge Angular via localhost
    if (!app.isPackaged) {
      mainWindow.loadURL('http://localhost:4200');
      mainWindow.webContents.openDevTools();
    } else {
      // En prod → charge les fichiers buildés Angular
      mainWindow.loadFile(path.join(__dirname, 'dist/asso-pilot/browser/index.html'));
    }
  }, 5000);

  // Initialise la base SQLite
  initDatabase();

  mainWindow.on('closed', () => (mainWindow = null));
}

//Login offline

ipcMain.handle('login', async (_, username, password) => {
  const users = await runQuery(`SELECT * FROM users WHERE username=?`, [username]);
  const user = users[0];
  if (!user) return { success: false, message: 'Utilisateur non trouvé' };
  const bcrypt = require('bcrypt');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: 'Mot de passe incorrect' };
  return { success: true, user: { id: user.id, username: user.username, role: user.role } };
});

ipcMain.handle('run-query', async (_, query, params) => {
  return await runQuery(query, params);
});

/*ipcMain.handle('run-exec', async (_, query, params) => {
  return await runExec(query, params);
});*/

ipcMain.handle('import-excel', async (event, table, filePath) => importExcel(table, filePath));
ipcMain.handle('export-excel', async (event, table, filePath) => exportExcel(table, filePath));

ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('open-dialog', (_, options) => dialog.showOpenDialog(options));

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
