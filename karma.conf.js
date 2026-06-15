// Karma configuration for headless / no-GUI environments (e.g. the dev server, CI).
// Uses Puppeteer's bundled Chromium so no system Chrome/Chromium install is required:
// `npm install` pulls a known-good headless browser into the Puppeteer cache, and
// CHROME_BIN points Karma at it. The ChromeHeadlessNoSandbox launcher adds --no-sandbox,
// which is required when running as root or inside containers.
//
// Puppeteer >= 23 made executablePath() async, and Karma's config callback is sync, so
// we resolve the path in a short-lived child process and delegate to Puppeteer's own
// resolution logic (version-proof and cross-platform) rather than hardcoding the cache layout.
// execFileSync(process.execPath, ...) runs node directly with no shell, so there are no
// quote-escaping pitfalls on Windows vs POSIX.
if (!process.env.CHROME_BIN) {
  const script =
    "Promise.resolve(require('puppeteer').executablePath()).then(p => process.stdout.write(p))";
  process.env.CHROME_BIN = require('child_process')
    .execFileSync(process.execPath, ['-e', script], { cwd: __dirname })
    .toString()
    .trim();
}

module.exports = function (config) {
  config.set({
    basePath: '',
    // The @angular/build:karma builder injects its own Angular framework plugin
    // (assets middleware + polyfills) programmatically and explicitly strips the
    // legacy '@angular-devkit/build-angular' framework/plugin if present, so the
    // config only needs to declare jasmine and the standard karma plugins here.
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/personal-website'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    restartOnFileChange: true,
  });
};
