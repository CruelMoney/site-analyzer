const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'is-on-https',
      'redirects-http',
      'no-vulnerable-libraries',
      'external-anchors-use-rel-noopener',
      
      'screenshot-thumbnails',
      'first-meaningful-paint',
      'uses-http2',
      'offscreen-images',       // Consider lazy-loading offscreen and hidden images to improve page load speed and time to interactive.
      'uses-responsive-images', // Serve images that are appropriately-sized to save cellular data and improve load time.
      'viewport',
      'content-width',
    ],
  },
};



const parseIdObject = (o) => {
  const res = {};
  Object.keys(o)
  .forEach(k => {
    res[o[k].id] = o[k];
  });
  return res;
}

const launchChromeAndRunLighthouse = url =>
  chromeLauncher.launch({
    disableCpuThrottling: true,
    disableNetworkThrottling: true,
    chromeFlags: ['--disable-gpu', '--headless', '--no-sandbox']
  }).then((chrome) => {
    const o = {
      port: chrome.port,
      logLevel: 'info'
    };
    return lighthouse(url, o, config)
      .then(results => chrome.kill().then(() => {
        return {
          audits: results.audits,
          categories: results.categories
        };
      }))
      .catch(e => {
        if(e.friendlyMessage){
          e.message = e.friendlyMessage;
        }
        throw e;
      });
});


 

module.exports = {
  analyze: launchChromeAndRunLighthouse,
};
