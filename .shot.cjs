const { chromium } = require('playwright');
const PORT = process.argv[2];
const OUT = process.argv[3];
const ids = process.argv.slice(4);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  for (const id of ids) {
    await page.goto(`http://localhost:${PORT}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/build-${id}.png`, fullPage: true });
    console.log('shot', id);
  }
  await browser.close();
})();
