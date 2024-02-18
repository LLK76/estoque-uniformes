import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Defina como true se estiver usando o preload script
      // preload: path.join(__dirname, 'preload.js') // Descomente se estiver usando um script de preload
    },
  });

  // Maximiza a janela ao abrir
  mainWindow.maximize();

  // Verifica se está em modo de desenvolvimento
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // URL do servidor de desenvolvimento do Vite
  } else {
    // Caminho para o arquivo index.html construído pelo Vite
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
