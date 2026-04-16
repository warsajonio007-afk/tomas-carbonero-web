/**
 * Verifica FIX 1 (hero mobile) y FIX 2 (cata mobile) + confirma desktop intacto.
 * Sirve desde dist/ via preview de Vite.
 */
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'http://localhost:4173';  // vite preview default

async function run() {
  const browser = await chromium.launch();

  // ── MOBILE 390px: hero ────────────────────────────────────────────
  const mob = await browser.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
  await mob.waitForTimeout(2500);  // esperar animaciones GSAP

  await mob.screenshot({
    path: path.join(__dirname, 'fix-hero-mobile-390.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });
  console.log('✓ hero mobile 390px');

  // Scroll hasta #cata
  await mob.evaluate(() => document.getElementById('cata')?.scrollIntoView());
  await mob.waitForTimeout(800);
  await mob.screenshot({
    path: path.join(__dirname, 'fix-cata-mobile-390.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });
  console.log('✓ cata mobile 390px');
  await mob.close();

  // ── DESKTOP 1440px: confirmar sin cambios ─────────────────────────
  const desk = await browser.newPage();
  await desk.setViewportSize({ width: 1440, height: 900 });
  await desk.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
  await desk.waitForTimeout(2000);

  await desk.screenshot({
    path: path.join(__dirname, 'fix-hero-desktop-1440.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ hero desktop 1440px');

  await desk.evaluate(() => document.getElementById('cata')?.scrollIntoView());
  await desk.waitForTimeout(800);
  await desk.screenshot({
    path: path.join(__dirname, 'fix-cata-desktop-1440.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ cata desktop 1440px');
  await desk.close();

  await browser.close();
  console.log('\nScreenshots guardados en e:\\CLAUDE\\tomascarbonero\\');
}

run().catch(console.error);
