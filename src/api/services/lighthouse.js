const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const log = require('lighthouse-logger');


const config = {
  extends: 'lighthouse:default',
  passes: [{
    passName: 'defaultPass',
    recordTrace: true,
    useThrottling: false,
    pauseAfterLoadMs: 1000,
    networkQuietThresholdMs: 1000,
    cpuQuietThresholdMs: 1000,
    gatherers: [
      'scripts',
      'css-usage',
      'viewport',
      'viewport-dimensions',
      'theme-color',
      'manifest',
      'runtime-exceptions',
      'chrome-console-messages',
      'image-usage',
      'accessibility',
      'dobetterweb/anchors-with-no-rel-noopener',
      'dobetterweb/appcache',
      'dobetterweb/doctype',
      'dobetterweb/domstats',
      'dobetterweb/js-libraries',
      'dobetterweb/optimized-images',
      'dobetterweb/password-inputs-with-prevented-paste',
      'dobetterweb/response-compression',
      'dobetterweb/tags-blocking-first-paint',
      'dobetterweb/websql',
      'seo/meta-description',
      'seo/font-size',
      'seo/crawlable-links',
      'seo/meta-robots',
      'seo/hreflang',
      'seo/embedded-content',
      'seo/canonical',
      'seo/robots-txt',
      'fonts',
    ],
  },
  {
    passName: 'offlinePass',
    gatherers: [
      'service-worker',
      'offline',
      'start-url',
    ],
  },
  {
    passName: 'redirectPass',
    // Speed up the redirect pass by blocking stylesheets, fonts, and images
    blockedUrlPatterns: ['*.css', '*.jpg', '*.jpeg', '*.png', '*.gif', '*.svg', '*.ttf', '*.woff', '*.woff2'],
    gatherers: [
      'http-redirect',
      'html-without-javascript',
    ],
  }],
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


log.setLevel('info');

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
    chromeFlags: ['--disable-gpu', '--headless', '--no-sandbox', '--window-size=1000,1000']
  }).then((chrome) => {
    const o = {
      port: chrome.port,
      logLevel: 'info'
    };
    return lighthouse(url, o, config)
      .then(results => chrome.kill().then(() => {
        let res = {};
        console.log(results.lhr.audits)
        

        return {
          audits: results.lhr.audits,
          categories: results.lhr.categories
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
