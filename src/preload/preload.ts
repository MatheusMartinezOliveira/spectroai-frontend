import { contextBridge, ipcRenderer } from 'electron';

console.log('🔌 Preload script carregado!');

// API exposta para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
  toggleMode: () => ipcRenderer.invoke('toggle-mode'),
  getMode: () => ipcRenderer.invoke('get-mode'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  setVortexActive: (isActive: boolean) => ipcRenderer.invoke('set-vortex-active', isActive),
  onVortexStateChanged: (callback: (isActive: boolean) => void) => {
    ipcRenderer.on('vortex-state-changed', (_, isActive) => callback(isActive));
  }
});

