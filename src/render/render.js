const { BrowserWindow, TouchBar, ipcMain } = require('electron');
const worker = require('../worker/worker');

const { TouchBarButton, TouchBarSpacer, TouchBarGroup } = TouchBar;

let mainWin;
let workerWin;

function createTouchBar(window) {
  const renderer = window.webContents;

  const startButton = new TouchBarButton({
    label: '🏁️ Start Test',
    backgroundColor: '#00e640',
    iconPosition: 'left',
    click: () => {
      renderer.send('touchbar start');
    },
  });

  const clearFailed = new TouchBarButton({
    label: '👎️ Clear Failed',
    backgroundColor: '#f03434',
    iconPosition: 'left',
    click: () => {
      renderer.send('touchbar clear failed');
    },
  });

  const clearAll = new TouchBarButton({
    label: '💣 Clear All',
    backgroundColor: '#d5b8ff',
    iconPosition: 'left',
    click: () => {
      renderer.send('touchbar clear all');
    },
  });

  const clearGroup = new TouchBar([clearFailed, clearAll]);

  const importProxies = new TouchBarButton({
    label: '⬇️ Import',
    iconPosition: 'right',
  });

  const exportProxies = new TouchBarButton({
    label: '⬆️️ Export',
    iconPosition: 'right',
  });

  const fileGroup = new TouchBar([importProxies, exportProxies]);

  return new TouchBar([
    startButton,
    new TouchBarSpacer({ size: 'large' }),
    new TouchBarGroup({ items: clearGroup }),
    new TouchBarSpacer({ size: 'large' }),
    new TouchBarGroup({ items: fileGroup }),
  ]);
}

module.exports.init = function init() {
  mainWin = new BrowserWindow({
    show: false,
    backgroundColor: '#191927',
    title: 'Proxy Tester',
    titleBarStyle: 'hiddenInset', // this removes the chrome from the window
    height: global.config.WINDOW_DEFAULT_HEIGHT,
    minHeight: global.config.WINDOW_MIN_HEIGHT,
    width: global.config.WINDOW_DEFAULT_WIDTH,
    minWidth: global.config.WINDOW_MIN_WIDTH,
  });

  mainWin.loadFile(global.config.WINDOW_MAIN);

  mainWin.once('ready-to-show', () => {
    mainWin.show(); // this means that we don't have visible lag on startup
  });


  const touchbar = createTouchBar(mainWin);
  mainWin.setTouchBar(touchbar);

  return mainWin;
};

ipcMain.on('start test', (event, args) => {
  workerWin = worker.init(args.proxies, args.host);
});

ipcMain.on('worker ready', () => {
  worker.sendStart(workerWin);
});

ipcMain.on('test results', (event, args) => {
  mainWin.webContents.send('test results', args);
});
