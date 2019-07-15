if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
}

const {
  remote,
  ipcRenderer,
  webFrame,
} = require('electron');

const packageJson = require('../package.json');

window.platform = process.platform;
window.packageJson = packageJson;

// disable zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(1, 1);

window.env = process.env;
window.ipcRenderer = ipcRenderer;
window.version = remote.app.getVersion();
window.isTesting = remote.getGlobal('isTesting');

const { arch, platform, versions } = process;
window.arch = arch;
window.platform = platform;
window.versions = versions;

const { dialog } = remote;
window.dialog = dialog;
