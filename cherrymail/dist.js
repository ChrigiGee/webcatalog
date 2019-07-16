/* eslint-disable no-console */
const builder = require('electron-builder');

const { Platform } = builder;

console.log(`Machine: ${process.platform}`);

const opts = {
  targets: Platform.MAC.createTarget(),
  config: {
    appId: 'com.cherrymail.app',
    productName: 'CherryMail',
    asar: true,
    files: [
      '!tests/**/*',
      '!docs/**/*',
    ],
    directories: {
      buildResources: 'build-resources',
    },
    mac: {
      category: 'public.app-category.productivity',
    },
  },
};

builder.build(opts)
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });