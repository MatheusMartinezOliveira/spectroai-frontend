import { WorkspaceSetup, WorkspaceApp, RunningApp, AppLaunchStatus } from './workspace';

export interface ElectronAPI {
  toggleMode: () => Promise<'expanded' | 'minimized'>;
  getMode: () => Promise<'expanded' | 'minimized'>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  quitApp: () => Promise<void>;
  setVortexActive: (isActive: boolean) => Promise<void>;
  onVortexStateChanged: (callback: (isActive: boolean) => void) => void;
  
  // Workspace Setup APIs
  getRunningApps: () => Promise<RunningApp[]>;
  isAppRunning: (appPath: string) => Promise<boolean>;
  launchApp: (app: WorkspaceApp) => Promise<AppLaunchStatus>;
  launchWorkspace: (workspaceId: string) => Promise<AppLaunchStatus[]>;
  closeWorkspace: (workspaceId: string) => Promise<AppLaunchStatus[]>;
  cancelWorkspaceLaunch: () => Promise<void>;
  getWorkspaces: () => Promise<WorkspaceSetup[]>;
  createWorkspace: (workspace: Omit<WorkspaceSetup, 'id' | 'created_at' | 'updated_at'>) => Promise<WorkspaceSetup>;
  updateWorkspace: (workspaceId: string, updates: Partial<WorkspaceSetup>) => Promise<WorkspaceSetup>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  onWorkspaceLaunchProgress: (callback: (status: AppLaunchStatus) => void) => void;
  onWorkspaceLaunchComplete: (callback: (summary: { total: number; success: number; alreadyRunning: number; errors: number }) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

