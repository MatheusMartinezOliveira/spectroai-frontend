export interface ElectronAPI {
  toggleMode: () => Promise<'expanded' | 'minimized'>;
  getMode: () => Promise<'expanded' | 'minimized'>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  quitApp: () => Promise<void>;
  setVortexActive: (isActive: boolean) => Promise<void>;
  onVortexStateChanged: (callback: (isActive: boolean) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

