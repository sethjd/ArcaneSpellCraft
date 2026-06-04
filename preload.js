const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ArcaneDesktop", {
  isDesktopWrapper: true,
  toggleFullscreen: () => ipcRenderer.send("arcane-toggle-fullscreen"),
  setFullscreen: (enabled) => ipcRenderer.send("arcane-set-fullscreen", Boolean(enabled)),
  isFullscreen: () => ipcRenderer.invoke("arcane-is-fullscreen"),
  quitGame: () => ipcRenderer.send("arcane-quit-game")
});
