const request = require('request');

class Proxy {
  constructor(proxy, site) {
    this.proxy = proxy;
    this.site = site;

    this.request = request.defaults({
      timeout: 10000,
      time: true,
    });
  }

  ping() {
    return new Promise((resolve) => {
      console.log(JSON.stringify(this.proxy, null, 4));
      this.request.get({
        url: `${this.site}`,
        proxy: `http://${this.proxy.details}`,
      }, (err, res) => {
        console.log('testing');
        if (err || !res) {
          console.log(err);
          resolve({
            row: this.proxy.row,
            time: -1, // this is a falsey value to indicate failure
          });
        }

        resolve({
          row: this.proxy.row,
          time: res.elapsedTime,
        });
      });
    });
  }
}

module.exports = Proxy;
