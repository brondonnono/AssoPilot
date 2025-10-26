const { app, BrowserWindow, Menu, screen, ipcMain, dialog } = require('electron');
const { initDatabase, runQuery, importExcel, exportExcel } = require('./db/database');
const path = require('path');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  splash = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    minWidth: 1000,
    minHeight: 700,
    alwaysOnTop: true,
    transparent: true,
  });
  splash.loadFile(path.join(__dirname, 'loader.html'));

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  Menu.setApplicationMenu(null);

  const productionPath = path.join(__dirname, 'dist', 'asso-pilot', 'browser', 'index.html');

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(productionPath);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (splash) {
      splash.close();
    }
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadFile(productionPath);
  });

  initDatabase();

  mainWindow.on('closed', () => (mainWindow = null));
}

ipcMain.handle('login', async (_, username, password) => {
  const users = await runQuery(`SELECT * FROM users WHERE username=?`, [username]);
  const user = users[0];
  if (!user) return { success: false, message: 'Utilisateur non trouvé' };
  const bcrypt = require('bcryptjs');
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

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
