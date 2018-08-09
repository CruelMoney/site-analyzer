const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchChromeAndRunLighthouse = (url, config = null) =>
  chromeLauncher.launch({ chromeFlags: ['--disable-gpu', '--headless', '--no-sandbox'] }).then((chrome) => {
    const o = {
      port: chrome.port,
    };
    return lighthouse(url, o, config)
      .then(results => chrome.kill().then(() => results.reportCategories));
  });


module.exports = {
  analyze: launchChromeAndRunLighthouse,
};
