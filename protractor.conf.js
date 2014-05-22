exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  specs: ['tests_e2e/*.js'],
  capabilities: {
    'browserName': 'chrome' // 'chrome', 'firefox', 'safari'
  }
}