export interface WindowInfo {
  title: string;
  handle?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
  };
}

export interface WorkspaceApp {
  name: string;
  path: string;
  pid?: number;
  windowCount?: number;
  windows?: WindowInfo[];
}

export interface WorkspaceSetup {
  id: string;
  workspace_name: string;
  apps: WorkspaceApp[];
  created_at: string;
  updated_at: string;
}

export interface RunningApp {
  name: string;
  path: string;
  pid: number;
  windowCount: number;
  windows: WindowInfo[];
}

export interface AppLaunchStatus {
  appName: string;
  status: 'launching' | 'success' | 'error' | 'already_running';
  message: string;
}
