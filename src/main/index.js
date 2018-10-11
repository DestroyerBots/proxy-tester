const { app } = require('electron');
const main = require('../render/render');

global.config = require('../config');

global.proxies = {};

app.on('ready', () => {
  main.init();
});

app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    main.init();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('login', (event, webContents, request, authInfo, callback) => {
  const fullProxy = `${authInfo.host}:${authInfo.port}`; // concat proxy for lookup

  callback(global.proxies[fullProxy].username,
    global.proxies[fullProxy].password); // supply credentials to server
});
