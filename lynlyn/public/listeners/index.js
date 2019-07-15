const path = require('path');
const {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  session,
  shell,
} = require('electron');
const { exec } = require('child_process');

const loadPreferencesListeners = require('./preferences');
const loadUpdaterListeners = require('./updater');
const loadWorkspacesListeners = require('./workspaces');

const sendMessageToWindow = require('../libs/send-message-to-window');

const loadListeners = () => {
  loadPreferencesListeners();
  loadUpdaterListeners();
  loadWorkspacesListeners();

  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('is-full-screen', (e) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      e.returnValue = windows[0].isFullScreen();
    }
    e.returnValue = false;
  });

  ipcMain.on('request-force-reload', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].reload();
    }
  });

  ipcMain.on('request-relaunch', () => {
    app.relaunch();
    app.quit();
  });

  ipcMain.on('request-clear-browsing-data', () => {
    const s = session.fromPartition('persist:app');
    if (!s) return;
    s.clearStorageData((err) => {
      if (err) {
        sendMessageToWindow('log', `Clearing browsing data err: ${err.message}`);
        return;
      }
      sendMessageToWindow('reload');
    });
  });

  ipcMain.on('get-web-view-preload-path', (e) => {
    e.returnValue = path.resolve(__dirname, '..', 'web-view-preload.js');
  });

  ipcMain.on('write-to-clipboard', (e, text) => {
    clipboard.writeText(text);
  });

  /* Badge count */
  // support macos
  const setDockBadge = (process.platform === 'darwin') ? app.dock.setBadge : () => {};

  ipcMain.on('badge', (e, badge) => {
    setDockBadge(badge);
  });

  ipcMain.on('request-open-webcatalog', () => {
    if (process.platform === 'win32') {
      shell.openItem(path.join(app.getPath('home'), 'AppData', 'Local', 'Programs', 'webcatalog', 'WebCatalog.exe'));
      return;
    }
    if (process.platform === 'linux') {
      exec('gtk-launch appimagekit-webcatalog');
    }
    shell.openItem('/Applications/WebCatalog.app');
  });
};

module.exports = loadListeners;
