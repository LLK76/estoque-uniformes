import { app, BrowserWindow } from "electron";
import path from "path";
import "url";
import __cjs_url__ from "node:url";
import __cjs_path__ from "node:path";
import __cjs_mod__ from "node:module";
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require2 = __cjs_mod__.createRequire(import.meta.url);
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // Defina como true se estiver usando o preload script
      // preload: path.join(__dirname, 'preload.js') // Descomente se estiver usando um script de preload
    }
  });
  mainWindow.maximize();
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => mainWindow = null);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
