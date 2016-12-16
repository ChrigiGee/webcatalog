// https://raw.githubusercontent.com/jiahaog/nativefier/9243f6689fe1cacc2311ee009bd96b705b32d8ad/src/helpers/convertToIcns.js

const shell = require('shelljs');
const path = require('path');

const PNG_TO_ICNS_BIN_PATH = path.join(__dirname, 'convertToIcns.sh');

console.log(PNG_TO_ICNS_BIN_PATH);

const convertToIcns = (pngSrc, icnsDest, callback) => {
  shell.exec(`${PNG_TO_ICNS_BIN_PATH} ${pngSrc} ${icnsDest}`, { silent: true }, (exitCode, stdOut, stdError) => {
    if (stdOut.includes('icon.iconset:error') || exitCode) {
      if (exitCode) {
        callback({
          stdOut,
          stdError,
        }, pngSrc);
        return;
      }

      callback(stdOut, pngSrc);
      return;
    }

    callback(null, icnsDest);
  });
};

module.exports = convertToIcns;
