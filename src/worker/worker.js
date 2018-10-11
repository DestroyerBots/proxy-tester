/* eslint-disable no-underscore-dangle */
const { BrowserWindow } = require('electron');

let _proxies;
let _host;

module.exports.init = function init(proxies, host) {
  _proxies = proxies;
  _host = host;

  const workerWin = new BrowserWindow({
    show: false,
  });

  workerWin.loadFile(global.config.WINDOW_WORKER);

  return workerWin;
};

module.exports.sendStart = function (workerWin) {
  workerWin.webContents.send('start test', {
    proxies: _proxies,
    host: _host,
  });
};
