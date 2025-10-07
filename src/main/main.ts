import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { WorkspaceSetup, WorkspaceApp, RunningApp, AppLaunchStatus } from '../types/workspace';

// Debug logs
console.log('🚀 Elarix AI iniciando...');
console.log('📁 Diretório:', __dirname);
console.log('🖥️ Plataforma:', process.platform);

let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;
let currentMode: 'expanded' | 'minimized' = 'expanded';
let cancelWorkspaceLaunch = false;

function createMainWindow() {
  console.log('📱 Criando janela principal...');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    frame: false,
    transparent: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload/preload.js'),
      devTools: true
    }
  });

  const htmlPath = path.join(__dirname, '../renderer/index.html');
  console.log('📄 Carregando HTML:', htmlPath);
  
  mainWindow.loadFile(htmlPath);

  // DevTools podem ser abertos com F12 ou Ctrl+Shift+I
  // if (process.env.NODE_ENV !== 'production') {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.once('ready-to-show', () => {
    console.log('✅ Janela principal pronta!');
    if (currentMode === 'expanded' && mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    console.log('❌ Janela principal fechada');
    mainWindow = null;
  });

  // Log de erros
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Erro ao carregar:', errorCode, errorDescription);
  });
}

function createMiniWindow() {
  console.log('🔷 Criando janela minimizada...');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  miniWindow = new BrowserWindow({
    width: 80,
    height: 80,
    x: width - 100,
    y: height - 100,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload/preload.js'),
      devTools: true
    }
  });

  const htmlPath = path.join(__dirname, '../renderer/index.html');
  miniWindow.loadFile(htmlPath);

  miniWindow.setIgnoreMouseEvents(false);

  miniWindow.once('ready-to-show', () => {
    console.log('✅ Janela minimizada pronta!');
    if (currentMode === 'minimized' && miniWindow) {
      miniWindow.show();
    }
  });

  miniWindow.on('closed', () => {
    console.log('❌ Janela minimizada fechada');
    miniWindow = null;
  });

  // Log de erros
  miniWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Erro ao carregar mini:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  console.log('✨ Electron app pronto!');
  console.log('🎯 Criando janelas...');
  
  createMainWindow();
  createMiniWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log('🔄 Reativando janelas...');
      createMainWindow();
      createMiniWindow();
    }
  });
});

console.log('⏳ Aguardando Electron ficar pronto...');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('toggle-mode', () => {
  if (currentMode === 'minimized') {
    currentMode = 'expanded';
    if (miniWindow) miniWindow.hide();
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  } else {
    currentMode = 'minimized';
    if (mainWindow) mainWindow.hide();
    if (miniWindow) {
      miniWindow.show();
      miniWindow.focus();
    }
  }
  return currentMode;
});

ipcMain.handle('get-mode', () => {
  return currentMode;
});

ipcMain.handle('minimize-window', () => {
  console.log('Minimizando janela principal...');
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  console.log('Maximizando janela principal...');
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', async () => {
  console.log('Fechando janela principal...');
  if (mainWindow) {
    mainWindow.hide();
    currentMode = 'minimized';
    
    // Aguarda um pouco antes de mostrar a mini window
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (miniWindow) {
      miniWindow.show();
      miniWindow.focus();
    }
  }
});

ipcMain.handle('quit-app', () => {
  app.quit();
});

// Vortex animation state
ipcMain.handle('set-vortex-active', (event, isActive: boolean) => {
  if (miniWindow) {
    miniWindow.webContents.send('vortex-state-changed', isActive);
  }
});

// ===== WORKSPACE SETUP FUNCTIONS =====

// Caminho para salvar os setups localmente
const getWorkspacesPath = (): string => {
  const userDataPath = app.getPath('userData');
  const workspacesDir = path.join(userDataPath, 'workspaces');
  
  // Criar diretório se não existir
  if (!fs.existsSync(workspacesDir)) {
    fs.mkdirSync(workspacesDir, { recursive: true });
  }
  
  return path.join(workspacesDir, 'setups.json');
};

// Carregar todos os setups salvos
const loadWorkspaces = (): WorkspaceSetup[] => {
  try {
    const workspacesPath = getWorkspacesPath();
    if (fs.existsSync(workspacesPath)) {
      const data = fs.readFileSync(workspacesPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar workspaces:', error);
    return [];
  }
};

// Salvar setups
const saveWorkspaces = (workspaces: WorkspaceSetup[]): void => {
  try {
    const workspacesPath = getWorkspacesPath();
    fs.writeFileSync(workspacesPath, JSON.stringify(workspaces, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar workspaces:', error);
    throw error;
  }
};

// Listar processos/aplicativos abertos no Windows com informações de janelas
ipcMain.handle('get-running-apps', async (): Promise<RunningApp[]> => {
  return new Promise((resolve) => {
    console.log('🔍 Iniciando busca de aplicativos abertos com janelas...');
    
    // Script PowerShell para obter janelas por processo
    const psScript = `
Add-Type @"
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)]
public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}

public class WindowHelper {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);
    
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    
    [DllImport("user32.dll")]
    public static extern int GetWindowTextLength(IntPtr hWnd);
    
    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);
    
    [DllImport("user32.dll")]
    public static extern IntPtr GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
    
    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    
    [DllImport("user32.dll")]
    public static extern bool IsZoomed(IntPtr hWnd);
    
    public static List<WindowInfo> GetAllWindows() {
        List<WindowInfo> windows = new List<WindowInfo>();
        
        EnumWindows(delegate(IntPtr hWnd, IntPtr lParam) {
            if (IsWindowVisible(hWnd)) {
                int length = GetWindowTextLength(hWnd);
                if (length > 0) {
                    StringBuilder title = new StringBuilder(length + 1);
                    GetWindowText(hWnd, title, title.Capacity);
                    
                    uint processId;
                    GetWindowThreadProcessId(hWnd, out processId);
                    
                    if (title.Length > 0) {
                        RECT rect;
                        GetWindowRect(hWnd, out rect);
                        bool isMaximized = IsZoomed(hWnd);
                        
                        windows.Add(new WindowInfo { 
                            Title = title.ToString(), 
                            ProcessId = (int)processId,
                            Handle = hWnd.ToString(),
                            X = rect.Left,
                            Y = rect.Top,
                            Width = rect.Right - rect.Left,
                            Height = rect.Bottom - rect.Top,
                            IsMaximized = isMaximized
                        });
                    }
                }
            }
            return true;
        }, IntPtr.Zero);
        
        return windows;
    }
}

public class WindowInfo {
    public string Title { get; set; }
    public int ProcessId { get; set; }
    public string Handle { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public bool IsMaximized { get; set; }
}
"@

$allWindows = [WindowHelper]::GetAllWindows()
$processInfo = @{}
Get-Process | Where-Object { $_.Id -ne $null -and $_.Path -ne $null } | ForEach-Object {
    $processInfo[$_.Id] = @{
        ProcessName = $_.ProcessName
        Path = $_.Path
    }
}

$windowGroups = $allWindows | 
    Where-Object { $processInfo.ContainsKey($_.ProcessId) } |
    Group-Object -Property { $processInfo[$_.ProcessId].ProcessName }

$result = $windowGroups | ForEach-Object {
    $processName = $_.Name
    $firstProcess = $_.Group[0]
    $path = $processInfo[$firstProcess.ProcessId].Path
    
    $windows = $_.Group | ForEach-Object {
        [PSCustomObject]@{
            title = $_.Title
            handle = $_.Handle
            position = [PSCustomObject]@{
                x = $_.X
                y = $_.Y
                width = $_.Width
                height = $_.Height
                isMaximized = $_.IsMaximized
            }
        }
    }
    
    [PSCustomObject]@{
        ProcessName = $processName
        Path = $path
        WindowCount = $_.Count
        Windows = $windows
    }
} | Where-Object { 
    $_.Path -and 
    -not $_.Path.ToLower().Contains('windows\\\\system32') -and 
    -not $_.Path.ToLower().Contains('windows\\\\systemapps') -and
    -not $_.Path.ToLower().Contains('windowsapps')
}

$result | ConvertTo-Json -Depth 4 -Compress
`;
    
    // Salvar script em arquivo temporário
    const tmpFile = path.join(os.tmpdir(), `spectro-windows-${Date.now()}.ps1`);
    fs.writeFileSync(tmpFile, psScript, 'utf8');
    
    // Executar script
    exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${tmpFile}"`, 
      { 
        maxBuffer: 1024 * 1024 * 10,
        encoding: 'utf8',
        timeout: 30000
      }, 
      (error, stdout, stderr) => {
        // Limpar arquivo temporário
        try {
          fs.unlinkSync(tmpFile);
        } catch (e) {
          console.warn('Não foi possível deletar arquivo temporário:', e);
        }
        
        if (error) {
          console.error('❌ Erro ao executar PowerShell:', error.message);
          resolve([]);
          return;
        }
        
        const trimmedOutput = stdout.trim();
        if (!trimmedOutput) {
          console.log('⚠️ Output vazio do PowerShell');
          resolve([]);
          return;
        }
        
        try {
          const processes = JSON.parse(trimmedOutput);
          const apps: RunningApp[] = [];
          
          const processList = Array.isArray(processes) ? processes : [processes];
          console.log(`📊 Total de processos com janelas: ${processList.length}`);
          
          for (const proc of processList) {
            if (proc.Path && proc.ProcessName && proc.Windows) {
              apps.push({
                name: proc.ProcessName,
                path: proc.Path,
                pid: 0,
                windowCount: proc.WindowCount || 1,
                windows: Array.isArray(proc.Windows) ? proc.Windows : [proc.Windows]
              });
            }
          }
          
          console.log(`✅ ${apps.length} aplicativos com ${apps.reduce((sum, a) => sum + a.windowCount, 0)} janelas`);
          apps.forEach(app => console.log(`  - ${app.name}: ${app.windowCount} janela(s)`));
          
          resolve(apps);
        } catch (parseError) {
          console.error('❌ Erro ao parsear JSON:', parseError);
          console.error('📄 Output:', trimmedOutput.substring(0, 500));
          resolve([]);
        }
      }
    );
  });
});

// Função auxiliar para verificar se app está rodando usando múltiplos métodos
async function checkAppRunning(appPath: string): Promise<boolean> {
  console.log(`    [checkAppRunning] Verificando: ${appPath}`);
  
  // Escapar aspas simples no caminho e usar aspas simples do PowerShell
  const escapedPath = appPath.replace(/'/g, "''");
  
  // Método 1: Get-Process padrão
  console.log(`    [Método 1] Get-Process...`);
  const method1 = await new Promise<boolean>((resolve) => {
    // Usar aspas simples do PowerShell ao redor do caminho
    const psScript = `Get-Process | Where-Object {$_.Path -ieq '${escapedPath}'} | Select-Object -First 1`;
    exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${psScript}"`, 
      { timeout: 5000 },
      (error, stdout, stderr) => {
        const found = !error && stdout.trim().length > 0;
        console.log(`    [Método 1] Resultado: ${found}`);
        if (error) console.log(`    [Método 1] Erro: ${error.message}`);
        if (stderr) console.log(`    [Método 1] Stderr: ${stderr}`);
        resolve(found);
      }
    );
  });
  
  if (method1) {
    console.log(`    [checkAppRunning] ✓ Encontrado pelo Método 1`);
    return true;
  }
  
  // Método 2: WMI (mais abrangente, acessa processos de outras sessões)
  console.log(`    [Método 2] WMI Win32_Process...`);
  const method2 = await new Promise<boolean>((resolve) => {
    // Usar aspas simples do PowerShell ao redor do caminho
    const psScript = `Get-WmiObject Win32_Process | Where-Object {$_.ExecutablePath -ieq '${escapedPath}'} | Select-Object -First 1`;
    exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${psScript}"`, 
      { timeout: 10000 },
      (error, stdout, stderr) => {
        const found = !error && stdout.trim().length > 0;
        console.log(`    [Método 2] Resultado: ${found}`);
        if (error) console.log(`    [Método 2] Erro: ${error.message}`);
        if (stderr) console.log(`    [Método 2] Stderr: ${stderr}`);
        resolve(found);
      }
    );
  });
  
  if (method2) {
    console.log(`    [checkAppRunning] ✓ Encontrado pelo Método 2`);
  } else {
    console.log(`    [checkAppRunning] ✗ NÃO encontrado por nenhum método`);
  }
  
  return method2;
}

// Verificar se um app está rodando
ipcMain.handle('is-app-running', async (event, appPath: string): Promise<boolean> => {
  return checkAppRunning(appPath);
});

// Iniciar um aplicativo
ipcMain.handle('launch-app', async (event, app: WorkspaceApp): Promise<AppLaunchStatus> => {
  try {
    // Verificar se já está rodando usando função auxiliar
    const checkRunning = await checkAppRunning(app.path);
    
    if (checkRunning) {
      return {
        appName: app.name,
        status: 'already_running',
        message: `${app.name} já está em execução`
      };
    }
    
    // Iniciar o app
    return new Promise((resolve) => {
      exec(`start "" "${app.path}"`, (error) => {
        if (error) {
          console.error(`Erro ao abrir ${app.name}:`, error);
          resolve({
            appName: app.name,
            status: 'error',
            message: `Erro ao iniciar ${app.name}: ${error.message}`
          });
        } else {
          resolve({
            appName: app.name,
            status: 'success',
            message: `${app.name} iniciado com sucesso`
          });
        }
      });
    });
  } catch (error) {
    return {
      appName: app.name,
      status: 'error',
      message: `Erro ao iniciar ${app.name}: ${error}`
    };
  }
});

// Função para posicionar e redimensionar janela
async function setWindowPosition(processName: string, windowInfo: any, attemptNumber: number = 0): Promise<void> {
  return new Promise((resolve) => {
    if (attemptNumber > 10) {
      console.log(`    ⚠️ Timeout ao tentar posicionar janela de ${processName}`);
      resolve();
      return;
    }

    const psScript = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        
        public class WindowManager {
            [DllImport("user32.dll")]
            public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
            
            [DllImport("user32.dll")]
            public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
            
            [DllImport("user32.dll")]
            public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
            
            [DllImport("user32.dll", CharSet = CharSet.Auto)]
            public static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter, string lpszClass, string lpszWindow);
            
            public const uint SWP_NOZORDER = 0x0004;
            public const uint SWP_SHOWWINDOW = 0x0040;
            public const int SW_RESTORE = 9;
            public const int SW_MAXIMIZE = 3;
        }
"@
      
      $process = Get-Process | Where-Object { $_.ProcessName -eq '${processName}' -and $_.MainWindowTitle -ne '' } | Select-Object -First 1
      
      if ($process -and $process.MainWindowHandle -ne 0) {
        $handle = $process.MainWindowHandle
        
        if (${windowInfo.position?.isMaximized ? 'true' : 'false'}) {
          [WindowManager]::ShowWindow($handle, [WindowManager]::SW_MAXIMIZE)
        } else {
          [WindowManager]::ShowWindow($handle, [WindowManager]::SW_RESTORE)
          [WindowManager]::SetWindowPos($handle, [IntPtr]::Zero, ${windowInfo.position?.x || 0}, ${windowInfo.position?.y || 0}, ${windowInfo.position?.width || 800}, ${windowInfo.position?.height || 600}, [WindowManager]::SWP_NOZORDER -bor [WindowManager]::SWP_SHOWWINDOW)
        }
        Write-Output "SUCCESS"
      } else {
        Write-Output "NOT_FOUND"
      }
    `;

    exec(`powershell.exe -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, 
      { timeout: 5000 },
      (error, stdout) => {
        if (stdout.includes('SUCCESS')) {
          console.log(`    ✓ Janela posicionada: ${windowInfo.position?.width}x${windowInfo.position?.height} em (${windowInfo.position?.x}, ${windowInfo.position?.y})`);
          resolve();
        } else if (stdout.includes('NOT_FOUND')) {
          // Janela ainda não existe, tentar novamente
          setTimeout(() => {
            setWindowPosition(processName, windowInfo, attemptNumber + 1).then(resolve);
          }, 500);
        } else {
          resolve();
        }
      }
    );
  });
}

// Iniciar um workspace completo
ipcMain.handle('launch-workspace', async (event, workspaceId: string): Promise<AppLaunchStatus[]> => {
  try {
    const workspaces = loadWorkspaces();
    const workspace = workspaces.find(w => w.id === workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace não encontrado');
    }
    
    const results: AppLaunchStatus[] = [];
    cancelWorkspaceLaunch = false; // Reset do cancelamento
    
    console.log(`🚀 Iniciando workspace: ${workspace.workspace_name} com ${workspace.apps.length} apps`);
    
    // Iniciar cada app sequencialmente com delay
    for (const app of workspace.apps) {
      // Verificar se foi cancelado
      if (cancelWorkspaceLaunch) {
        console.log('⏹️ Lançamento cancelado pelo usuário');
        if (mainWindow) {
          mainWindow.webContents.send('workspace-launch-progress', {
            appName: 'Cancelado',
            status: 'error',
            message: 'Lançamento cancelado pelo usuário'
          });
        }
        break;
      }
      
      console.log(`📱 Processando: ${app.name} (${app.windowCount || 1} janela(s))`);
      
      // Verificar se já está rodando usando função auxiliar
      const isRunning = await checkAppRunning(app.path);

      if (isRunning) {
        console.log(`  ⚠️ ${app.name} já está em execução`);
        const result: AppLaunchStatus = {
          appName: app.name,
          status: 'already_running',
          message: `${app.name} já está em execução`
        };
        results.push(result);
        if (mainWindow) {
          mainWindow.webContents.send('workspace-launch-progress', result);
        }
        continue;
      }

      // Iniciar múltiplas janelas se necessário
      const windowCount = app.windowCount || 1;
      const windows = app.windows || [];
      
      console.log(`  🔄 Iniciando ${windowCount} janela(s) de ${app.name}...`);
      
      // Iniciar primeira janela
      const firstLaunch = await new Promise<boolean>((resolve) => {
        exec(`cmd /c start /B "" "${app.path}"`, { timeout: 3000 }, (error) => {
          if (error && error.code !== null) {
            console.log(`  ❌ Erro ao iniciar ${app.name}:`, error.message);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!firstLaunch) {
        const result: AppLaunchStatus = {
          appName: app.name,
          status: 'error',
          message: `Erro ao iniciar ${app.name}`
        };
        results.push(result);
        if (mainWindow) {
          mainWindow.webContents.send('workspace-launch-progress', result);
        }
        continue;
      }

      // Aguardar app abrir
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Posicionar primeira janela
      if (windows[0]?.position) {
        console.log(`  📐 Posicionando janela 1...`);
        await setWindowPosition(app.name, windows[0]);
      }

      // Abrir janelas adicionais
      if (windowCount > 1) {
        for (let i = 1; i < windowCount; i++) {
          if (cancelWorkspaceLaunch) break;
          
          console.log(`  🔄 Abrindo janela ${i + 1}/${windowCount}...`);
          exec(`cmd /c start /B "" "${app.path}"`, { timeout: 3000 }, () => {});
          
          // Aguardar janela abrir
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Posicionar janela
          if (windows[i]?.position) {
            console.log(`  📐 Posicionando janela ${i + 1}...`);
            await setWindowPosition(app.name, windows[i]);
          }
        }
      }

      const result: AppLaunchStatus = {
        appName: app.name,
        status: 'success',
        message: `${app.name} iniciado com ${windowCount} janela(s)`
      };
      
      results.push(result);
      
      // Notificar resultado
      if (mainWindow) {
        mainWindow.webContents.send('workspace-launch-progress', result);
      }
      
      // Delay entre apps para não sobrecarregar o sistema
      console.log(`  ⏳ Aguardando 1.5s antes do próximo app...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`✅ Workspace finalizado: ${results.length} apps processados`);
    
    // Enviar mensagem final de resumo
    const successCount = results.filter(r => r.status === 'success').length;
    const alreadyRunningCount = results.filter(r => r.status === 'already_running').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (mainWindow && !cancelWorkspaceLaunch) {
      mainWindow.webContents.send('workspace-launch-complete', {
        total: results.length,
        success: successCount,
        alreadyRunning: alreadyRunningCount,
        errors: errorCount
      });
    }
    
    return results;
  } catch (error) {
    console.error('❌ Erro ao iniciar workspace:', error);
    throw error;
  }
});

// Cancelar lançamento de workspace
ipcMain.handle('cancel-workspace-launch', async (): Promise<void> => {
  console.log('🛑 Solicitação de cancelamento recebida');
  cancelWorkspaceLaunch = true;
});

// Fechar um workspace completo
ipcMain.handle('close-workspace', async (event, workspaceId: string): Promise<AppLaunchStatus[]> => {
  try {
    cancelWorkspaceLaunch = false;
    
    const workspaces = loadWorkspaces();
    const workspace = workspaces.find(w => w.id === workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace não encontrado');
    }
    
    const results: AppLaunchStatus[] = [];
    
    console.log(`🛑 Fechando workspace: ${workspace.workspace_name} com ${workspace.apps.length} apps`);
    
    // Fechar cada app sequencialmente
    for (const app of workspace.apps) {
      // Verificar se foi cancelado
      if (cancelWorkspaceLaunch) {
        console.log('⏹️ Fechamento cancelado pelo usuário');
        if (mainWindow) {
          mainWindow.webContents.send('workspace-launch-progress', {
            appName: 'Cancelado',
            status: 'error',
            message: 'Fechamento cancelado pelo usuário'
          });
        }
        break;
      }
      
      console.log(`📱 Processando: ${app.name}`);
      
      // Verificar se está rodando usando função auxiliar com múltiplos métodos
      console.log(`  Verificando: ${app.path}`);
      const isRunning = await checkAppRunning(app.path);
      console.log(`  Resultado: ${isRunning ? 'RODANDO' : 'NÃO RODANDO'}`);

      if (!isRunning) {
        console.log(`  ⚠️ ${app.name} não está em execução`);
        const result: AppLaunchStatus = {
          appName: app.name,
          status: 'error',
          message: `${app.name} não está em execução`
        };
        results.push(result);
        if (mainWindow) {
          mainWindow.webContents.send('workspace-launch-progress', result);
        }
        continue;
      }

      // Fechar o app
      console.log(`  🔄 Fechando ${app.name}...`);
      
      const closeResult = await new Promise<AppLaunchStatus>((resolve) => {
        // Script PowerShell para fechar processo gracefully
        // Escapar aspas simples no caminho
        const escapedPath = app.path.replace(/'/g, "''");
        // Script compacto em uma linha com ponto-e-vírgula
        const psScript = `$processes = Get-Process | Where-Object {$_.Path -ieq '${escapedPath}'}; if ($processes) { $processes | ForEach-Object { try { $_.CloseMainWindow() | Out-Null; Start-Sleep -Milliseconds 500; if (!$_.HasExited) { Stop-Process -Id $_.Id -Force } } catch { Stop-Process -Id $_.Id -Force } }; Write-Output 'SUCCESS' } else { Write-Output 'NOT_RUNNING' }`;
        
        exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${psScript}"`, 
          { timeout: 10000 },
          (error, stdout) => {
            if (stdout.includes('SUCCESS')) {
              console.log(`  ✅ ${app.name} fechado com sucesso`);
              resolve({
                appName: app.name,
                status: 'success',
                message: `${app.name} fechado com sucesso`
              });
            } else if (stdout.includes('NOT_RUNNING')) {
              console.log(`  ⚠️ ${app.name} não estava rodando`);
              resolve({
                appName: app.name,
                status: 'error',
                message: `${app.name} não estava rodando`
              });
            } else if (error) {
              console.log(`  ❌ Erro ao fechar ${app.name}:`, error.message);
              resolve({
                appName: app.name,
                status: 'error',
                message: `Erro ao fechar ${app.name}: ${error.message}`
              });
            } else {
              resolve({
                appName: app.name,
                status: 'success',
                message: `${app.name} fechado`
              });
            }
          }
        );
      });
      
      results.push(closeResult);
      
      // Notificar resultado
      if (mainWindow) {
        mainWindow.webContents.send('workspace-launch-progress', closeResult);
      }
      
      // Delay entre apps
      console.log(`  ⏳ Aguardando 0.5s antes do próximo app...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`✅ Workspace fechado: ${results.length} apps processados`);
    
    // Enviar mensagem final de resumo
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (mainWindow && !cancelWorkspaceLaunch) {
      mainWindow.webContents.send('workspace-launch-complete', {
        total: results.length,
        success: successCount,
        alreadyRunning: 0,
        errors: errorCount
      });
    }
    
    return results;
  } catch (error) {
    console.error('❌ Erro ao fechar workspace:', error);
    throw error;
  }
});

// Obter todos os workspaces
ipcMain.handle('get-workspaces', async (): Promise<WorkspaceSetup[]> => {
  return loadWorkspaces();
});

// Criar novo workspace
ipcMain.handle('create-workspace', async (event, workspace: Omit<WorkspaceSetup, 'id' | 'created_at' | 'updated_at'>): Promise<WorkspaceSetup> => {
  try {
    const workspaces = loadWorkspaces();
    
    const newWorkspace: WorkspaceSetup = {
      ...workspace,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    workspaces.push(newWorkspace);
    saveWorkspaces(workspaces);
    
    return newWorkspace;
  } catch (error) {
    console.error('Erro ao criar workspace:', error);
    throw error;
  }
});

// Atualizar workspace
ipcMain.handle('update-workspace', async (event, workspaceId: string, updates: Partial<WorkspaceSetup>): Promise<WorkspaceSetup> => {
  try {
    const workspaces = loadWorkspaces();
    const index = workspaces.findIndex(w => w.id === workspaceId);
    
    if (index === -1) {
      throw new Error('Workspace não encontrado');
    }
    
    workspaces[index] = {
      ...workspaces[index],
      ...updates,
      id: workspaceId, // Garantir que o ID não mude
      updated_at: new Date().toISOString()
    };
    
    saveWorkspaces(workspaces);
    return workspaces[index];
  } catch (error) {
    console.error('Erro ao atualizar workspace:', error);
    throw error;
  }
});

// Deletar workspace
ipcMain.handle('delete-workspace', async (event, workspaceId: string): Promise<void> => {
  try {
    const workspaces = loadWorkspaces();
    const filtered = workspaces.filter(w => w.id !== workspaceId);
    saveWorkspaces(filtered);
  } catch (error) {
    console.error('Erro ao deletar workspace:', error);
    throw error;
  }
});

