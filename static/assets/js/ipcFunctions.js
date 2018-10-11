/* eslint-disable no-undef,no-unused-vars */
const { ipcRenderer } = require('electron');

function sendProxies(proxies, host) {
  ipcRenderer.send('start test', {
    proxies,
    host,
  });
}

ipcRenderer.on('touchbar clear failed', () => {
  clearFailed();
});

ipcRenderer.on('touchbar clear all', () => {
  clearAll();
});

ipcRenderer.on('touchbar start', () => {
  startTest();
});

ipcRenderer.on('test results', (event, args) => {
  args.forEach(proxy => setResult(proxy.row, Number.parseInt(proxy.time, 10)));
});
