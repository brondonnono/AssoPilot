const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // En mode production, charge le build Angular
  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, 'dist/asso-pilot/browser/index.html'));
  } else {
    // En mode dev, charge le serveur Angular
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  }

  win.on('closed', () => (win = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
