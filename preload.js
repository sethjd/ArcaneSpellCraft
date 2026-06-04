const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ArcaneDesktop", {
  platform: process.platform,
  isDesktopWrapper: true,
  build: "pc",
  quitGame: () => ipcRenderer.send("arcane-quit-game")
});
