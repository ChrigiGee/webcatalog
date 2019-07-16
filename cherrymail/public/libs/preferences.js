const settings = require('electron-settings');

const sendToAllWindows = require('../libs/send-to-all-windows');

// scope
const v = '2018.2';

const defaultPreferences = {
  attachToMenubar: false,
  cssCodeInjection: null,
  jsCodeInjection: null,
  navigationBar: false,
  registered: false,
  rememberLastPageVisited: false,
  shareWorkspaceBrowsingData: false,
  spellChecker: true,
  swipeToNavigate: true,
  theme: 'automatic',
  unreadCountBadge: true,
};

const getPreferences = () => Object.assign({}, defaultPreferences, settings.get(`preferences.${v}`, defaultPreferences));

const getPreference = name => settings.get(`preferences.${v}.${name}`, defaultPreferences[name]);

const setPreference = (name, value) => {
  settings.set(`preferences.${v}.${name}`, value);
  sendToAllWindows('set-preference', name, value);
};

const resetPreferences = () => {
  settings.deleteAll();

  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
};
