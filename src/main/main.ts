import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

// Debug logs
console.log('🚀 Spectro AI iniciando...');
console.log('📁 Diretório:', __dirname);
console.log('🖥️ Plataforma:', process.platform);

let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;
let currentMode: 'expanded' | 'minimized' = 'expanded';

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

