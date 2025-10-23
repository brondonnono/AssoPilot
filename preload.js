const { contextBridge, ipcRenderer } = require('electron');

// Expose seulement les fonctions nécessaires au front Angular
contextBridge.exposeInMainWorld('electronAPI', {
  openDialog: (options) => ipcRenderer.invoke('open-dialog', options),
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  runQuery: (query, params) => ipcRenderer.invoke('run-query', query, params),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
