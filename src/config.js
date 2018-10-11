/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const isDev = require('isdev');

let WINDOW_MAIN_PATH;
let WINDOW_WORKER_PATH;
/**
 * We want to establish the file paths. These paths will
 * change based on if app is in production or development
 */
if (isDev) {
  WINDOW_MAIN_PATH = path.join(__dirname, '..', 'static', 'index.html');
  WINDOW_WORKER_PATH = path.join(__dirname, '..', 'static', 'worker.html');
} else {
  WINDOW_MAIN_PATH = path.join(__dirname, '..', '..', 'static', 'index.html');
  WINDOW_WORKER_PATH = path.join(__dirname, '..', '..', 'static', 'worker.html');
}

module.exports = {
  // APP_ICON: APP_ICON,

  DELAYED_INIT: 3000,

  /* Windows */
  WINDOW_MAIN: WINDOW_MAIN_PATH,
  WINDOW_WORKER: WINDOW_WORKER_PATH,

  WINDOW_MIN_WIDTH: 992,
  WINDOW_MIN_HEIGHT: 800,

  WINDOW_DEFAULT_WIDTH: 992,
  WINDOW_DEFAULT_HEIGHT: 800,
};
