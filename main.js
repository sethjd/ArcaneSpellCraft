const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let mainWindow = null;

function resolveIconPath() {
  const icoPath = path.join(__dirname, "build", "icon.ico");
  const pngPath = path.join(__dirname, "www", "assets", "ui", "app_icon.png");
  if (fs.existsSync(icoPath)) return icoPath;
  if (fs.existsSync(pngPath)) return pngPath;
  return undefined;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Arcane Spell Craft",
    width: 1600,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    backgroundColor: "#090d18",
    autoHideMenuBar: true,
    fullscreenable: true,
    fullscreen: true,
    show: false,
    icon: resolveIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, "www", "index.html"));
  mainWindow.once("ready-to-show", () => {
    if (mainWindow) mainWindow.show();
  });
}

app.whenReady().then(() => {
  app.setName("Arcane Spell Craft");
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("arcane-toggle-fullscreen", () => {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.on("arcane-set-fullscreen", (_event, enabled) => {
  if (!mainWindow) return;
  mainWindow.setFullScreen(Boolean(enabled));
});

ipcMain.handle("arcane-is-fullscreen", () => mainWindow ? mainWindow.isFullScreen() : false);
ipcMain.on("arcane-quit-game", () => app.quit());
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
