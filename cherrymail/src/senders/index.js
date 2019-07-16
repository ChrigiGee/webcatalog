
const { ipcRenderer } = window.require('electron');

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

export const requestLoadURL = (url, id) => ipcRenderer.send('request-load-url', url, id);

export const requestGoHome = () => ipcRenderer.send('request-go-home');
export const requestGoBack = () => ipcRenderer.send('request-go-back');
export const requestGoForward = () => ipcRenderer.send('request-go-forward');
export const requestReload = () => ipcRenderer.send('request-reload');

export const requestShowPreferencesWindow = () => ipcRenderer.send('request-show-preferences-window');
export const requestShowEditWorkspaceWindow = id => ipcRenderer.send('request-show-edit-workspace-window', id);
export const requestShowCodeInjectionWindow = type => ipcRenderer.send('request-show-code-injection-window', type);

export const getIsFullscreen = () => ipcRenderer.sendSync('get-is-fullscreen');

// Preferences
export const getPreference = name => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
export const requestShowRequireRestartDialog = () => ipcRenderer.send('request-show-require-restart-dialog');

// System Preferences
export const getSystemPreference = name => ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => ipcRenderer.send('request-set-system-preference', name, value);

// Workspace
export const getWorkspace = id => ipcRenderer.sendSync('get-workspace', id);
export const getWorkspaces = () => ipcRenderer.sendSync('get-workspaces');
export const requestCreateWorkspace = serviceId => ipcRenderer.send('request-create-workspace', serviceId);
export const requestSetWorkspace = (id, opts) => ipcRenderer.send('request-set-workspace', id, opts);
export const requestSetActiveWorkspace = id => ipcRenderer.send('request-set-active-workspace', id);
export const requestRemoveWorkspace = id => ipcRenderer.send('request-remove-workspace', id);
export const requestClearBrowsingData = () => ipcRenderer.send('request-clear-browsing-data');
export const requestOpenUrlInWorkspace = (url, id) => ipcRenderer.send('request-open-url-in-workspace', url, id);

// Find In Page
export const requestFindInPage = (text, forward) => ipcRenderer.send('request-find-in-page', text, forward);
export const requestStopFindInPage = close => ipcRenderer.send('request-stop-find-in-page', close);

export const requestShowMessageBox = (message, type) => ipcRenderer.send('request-show-message-box', message, type);