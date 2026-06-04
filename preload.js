const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ArcaneDesktop", {
  platform: process.platform,
  isDesktopWrapper: true
});
