import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function screenshot() {
  const browser = await chromium.launch();
  const url = 'http://localhost:5173';

  // Console log capture
  const diagPage = await browser.newPage();
  const logs = [];
  diagPage.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  diagPage.on('pageerror', e => logs.push(`[ERROR] ${e.message}`));
  await diagPage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await diagPage.waitForTimeout(3000);
  console.log('=== CONSOLE LOGS ===');
  console.log(logs.length ? logs.join('\n') : '(sin logs)');
  console.log('=== END LOGS ===');
  await diagPage.close();

  // Mobile 390px
  const mobile = await browser.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: path.join(__dirname, 'screenshot-mobile.png'), fullPage: true });
  console.log('Mobile 390px screenshot saved');

  // Tablet 768px
  const tablet = await browser.newPage();
  await tablet.setViewportSize({ width: 768, height: 1024 });
  await tablet.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await tablet.waitForTimeout(2000);
  await tablet.screenshot({ path: path.join(__dirname, 'screenshot-tablet.png'), fullPage: true });
  console.log('Tablet 768px screenshot saved');

  // Desktop 1440px — move mouse
  const desktop = await browser.newPage();
  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await desktop.waitForTimeout(1500);
  await desktop.mouse.move(720, 450);
  await desktop.waitForTimeout(800);
  await desktop.screenshot({ path: path.join(__dirname, 'screenshot-desktop.png'), fullPage: false });
  console.log('Desktop 1440px screenshot saved');

  await browser.close();
}

screenshot().catch(console.error);
