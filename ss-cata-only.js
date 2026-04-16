import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch();

  // Mobile 390 — solo sección cata
  const mob = await browser.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto(URL + '#cata', { waitUntil: 'networkidle', timeout: 20000 });
  await mob.waitForTimeout(1500);
  await mob.evaluate(() => document.getElementById('cata')?.scrollIntoView({ block: 'start' }));
  await mob.waitForTimeout(1000);
  const cataMob = await mob.locator('#cata').boundingBox();
  await mob.screenshot({
    path: path.join(__dirname, 'fix2-cata-mobile-390.png'),
    clip: { x: 0, y: cataMob.y, width: 390, height: Math.min(cataMob.height, 900) }
  });
  console.log('✓ cata mobile (sección completa)');
  await mob.close();

  // Desktop 1440 — solo sección cata
  const desk = await browser.newPage();
  await desk.setViewportSize({ width: 1440, height: 900 });
  await desk.goto(URL + '#cata', { waitUntil: 'networkidle', timeout: 20000 });
  await desk.waitForTimeout(1500);
  await desk.evaluate(() => document.getElementById('cata')?.scrollIntoView({ block: 'start' }));
  await desk.waitForTimeout(1000);
  const cataDesk = await desk.locator('#cata').boundingBox();
  await desk.screenshot({
    path: path.join(__dirname, 'fix2-cata-desktop-1440.png'),
    clip: { x: 0, y: cataDesk.y, width: 1440, height: Math.min(cataDesk.height, 900) }
  });
  console.log('✓ cata desktop (sección completa)');
  await desk.close();

  await browser.close();
}
run().catch(console.error);
