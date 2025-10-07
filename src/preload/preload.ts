import { contextBridge, ipcRenderer } from 'electron';
import { WorkspaceSetup, WorkspaceApp, RunningApp, AppLaunchStatus } from '../types/workspace';

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
  },
  
  // Workspace Setup APIs
  getRunningApps: () => ipcRenderer.invoke('get-running-apps'),
  isAppRunning: (appPath: string) => ipcRenderer.invoke('is-app-running', appPath),
  launchApp: (app: WorkspaceApp) => ipcRenderer.invoke('launch-app', app),
  launchWorkspace: (workspaceId: string) => ipcRenderer.invoke('launch-workspace', workspaceId),
  closeWorkspace: (workspaceId: string) => ipcRenderer.invoke('close-workspace', workspaceId),
  cancelWorkspaceLaunch: () => ipcRenderer.invoke('cancel-workspace-launch'),
  getWorkspaces: () => ipcRenderer.invoke('get-workspaces'),
  createWorkspace: (workspace: Omit<WorkspaceSetup, 'id' | 'created_at' | 'updated_at'>) => 
    ipcRenderer.invoke('create-workspace', workspace),
  updateWorkspace: (workspaceId: string, updates: Partial<WorkspaceSetup>) => 
    ipcRenderer.invoke('update-workspace', workspaceId, updates),
  deleteWorkspace: (workspaceId: string) => ipcRenderer.invoke('delete-workspace', workspaceId),
  onWorkspaceLaunchProgress: (callback: (status: AppLaunchStatus) => void) => {
    ipcRenderer.on('workspace-launch-progress', (_, status) => callback(status));
  },
  onWorkspaceLaunchComplete: (callback: (summary: { total: number; success: number; alreadyRunning: number; errors: number }) => void) => {
    ipcRenderer.on('workspace-launch-complete', (_, summary) => callback(summary));
  }
});

