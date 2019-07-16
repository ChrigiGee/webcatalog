const {
  Menu,
  clipboard,
  shell,
  dialog,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const editWorkspaceWindow = require('../windows/edit-workspace');
const licenseRegistrationWindow = require('../windows/license-registration');

const {
  countWorkspaces,
  getWorkspaces,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
} = require('./workspaces');

const {
  createWorkspaceView,
  setActiveWorkspaceView,
  removeWorkspaceView,
  clearBrowsingData,
} = require('./workspaces-views');

const {
  getView,
} = require('./views');

const { getPreference } = require('./preferences');

const { EMAIL_SERVICES } = require('../constants');

const FIND_IN_PAGE_HEIGHT = 42;

function createMenu() {
  const registered = getPreference('registered');

  const template = [
    {
      label: 'CherryMail',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: registered ? 'Registered' : 'Registration...',
          enabled: !registered,
          click: registered ? null : () => licenseRegistrationWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Check for Updates...',
          click: () => {
            global.updateSilent = false;
            autoUpdater.checkForUpdates();
          },
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => preferencesWindow.show(),
        },
        { type: 'separator' },
        {
          label: 'Clear Browsing Data...',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => {
            dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
              type: 'question',
              buttons: ['Clear Now', 'Cancel'],
              message: 'Are you sure? All browsing data will be cleared. This action cannot be undone.',
              cancelId: 1,
            }, (response) => {
              if (response === 0) {
                clearBrowsingData();
              }
            });
          },
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            const win = mainWindow.get();
            if (win) {
              win.send('open-find-in-page');

              const contentSize = win.getContentSize();
              const view = win.getBrowserView();

              view.setBounds({
                x: 68,
                y: global.showNavigationBar ? FIND_IN_PAGE_HEIGHT + 36 : FIND_IN_PAGE_HEIGHT,
                height: global.showNavigationBar ? contentSize[1] - FIND_IN_PAGE_HEIGHT - 36
                  : contentSize[1] - FIND_IN_PAGE_HEIGHT,
                width: contentSize[0] - 68,
              });
            }
          },
        },
        {
          label: 'Find Next',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', true);
          },
        },
        {
          label: 'Find Previous',
          accelerator: 'Shift+CmdOrCtrl+G',
          click: () => {
            const win = mainWindow.get();
            win.send('request-back-find-in-page', false);
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.setZoomFactor(1);
            }
          },
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.getZoomFactor((zoomFactor) => {
                contents.setZoomFactor(zoomFactor + 0.1);
              });
            }
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              contents.getZoomFactor((zoomFactor) => {
                contents.setZoomFactor(zoomFactor - 0.1);
              });
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Reload This Workspace',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              win.getBrowserView().webContents.reload();
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Developer Tools',
          submenu: [
            {
              label: 'Window',
              click: () => {
                const win = mainWindow.get();
                if (win != null) {
                  if (win.webContents.isDevToolsOpened()) {
                    win.webContents.closeDevTools();
                  } else {
                    win.webContents.openDevTools({ mode: 'detach' });
                  }
                }
              },
            },
            { type: 'separator' },
          ],
        },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Shift+CmdOrCtrl+H',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const activeWorkspace = getActiveWorkspace();
              if (activeWorkspace.id !== 'home') {
                const contents = win.getBrowserView().webContents;
                contents.loadURL(EMAIL_SERVICES[activeWorkspace.serviceId].url);
                win.send('update-can-go-back', contents.canGoBack());
                win.send('update-can-go-forward', contents.canGoForward());
              }
            }
          },
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              if (contents.canGoBack()) {
                contents.goBack();
                win.send('update-can-go-back', contents.canGoBack());
                win.send('update-can-go-forward', contents.canGoForward());
              }
            }
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const contents = win.getBrowserView().webContents;
              if (contents.canGoForward()) {
                contents.goForward();
                win.send('update-can-go-back', contents.canGoBack());
                win.send('update-can-go-forward', contents.canGoForward());
              }
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Copy URL',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              const url = win.getBrowserView().webContents.getURL();
              clipboard.writeText(url);
            }
          },
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Report an Issue...',
          click: () => shell.openExternal('https://github.com/quanglam2807/cherrymail/issues'),
        },
        {
          label: 'Learn More...',
          click: () => shell.openExternal('https://getcherrymail.com'),
        },
      ],
    },
  ];

  Object.values(getWorkspaces())
    .sort((a, b) => a.order - b.order)
    .forEach((workspace) => {
      if (workspace.id !== 'home') {
        template[4].submenu.push({
          label: workspace.name || `Account ${workspace.order + 1}`,
          type: 'checkbox',
          checked: workspace.active,
          click: () => {
            setActiveWorkspaceView(workspace.id);
            createMenu();
          },
          accelerator: `CmdOrCtrl+${workspace.order + 1}`,
        });
      }

      template[2].submenu[7].submenu.push({
        label: workspace.name || `Account ${workspace.order + 1}`,
        click: () => {
          const v = getView(workspace.id);
          v.webContents.toggleDevTools();
        },
      });
    });

  template[4].submenu.push(
    { type: 'separator' },
    {
      label: 'Select Next Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const nextWorkspace = getNextWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(nextWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+]',
    },
    {
      label: 'Select Previous Workspace',
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const nextWorkspace = getPreviousWorkspace(currentActiveWorkspace.id);
        setActiveWorkspaceView(nextWorkspace.id);
        createMenu();
      },
      accelerator: 'CmdOrCtrl+Shift+[',
    },
    { type: 'separator' },
    {
      label: 'Edit Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        editWorkspaceWindow.show(activeWorkspace.id);
      },
    },
    {
      label: 'Remove Current Workspace',
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        removeWorkspaceView(activeWorkspace.id);
        createMenu();
      },
    },
    { type: 'separator' },
    {
      label: 'Add Workspace',
      enabled: countWorkspaces() < 10,
      click: () => {
        createWorkspaceView();
        createMenu();
      },
    },
  );

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;