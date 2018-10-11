const { ipcRenderer } = require('electron');

// eslint-disable-next-line import/no-unresolved
const Proxy = require('../src/lib/proxy');

function testAll(proxies, host) {
  const tests = [];

  proxies.forEach((proxy) => {
    tests.push(new Proxy(proxy, host).ping());
  });

  return Promise.all(tests);
}

ipcRenderer.on('start test', (event, args) => {
  testAll(args.proxies, args.host).then((results) => {
    ipcRenderer.send('test results', results);
  });
});

ipcRenderer.send('worker ready');
