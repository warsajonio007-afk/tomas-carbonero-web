import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

/**
 * TC monogram: T offset top-left, C offset bottom-right, overlapping at center
 */
function makeSVG(size) {
  const s = size;
  // T: larger, positioned top-left of center
  const tSize  = Math.round(s * 0.60);
  const tX     = Math.round(s * 0.38);
  const tY     = Math.round(s * 0.46);
  // C: slightly smaller, positioned bottom-right, overlapping
  const cSize  = Math.round(s * 0.52);
  const cX     = Math.round(s * 0.62);
  const cY     = Math.round(s * 0.60);

  const border = s >= 32
    ? `<rect x="${Math.round(s*0.05)}" y="${Math.round(s*0.05)}" width="${Math.round(s*0.90)}" height="${Math.round(s*0.90)}" fill="none" stroke="rgba(200,169,110,0.35)" stroke-width="${Math.round(s*0.025)}"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#080706"/>
  ${border}
  <text x="${tX}" y="${tY}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-size="${tSize}" fill="#C8A96E" text-anchor="middle" dominant-baseline="middle">T</text>
  <text x="${cX}" y="${cY}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-size="${cSize}" fill="#C8A96E" text-anchor="middle" dominant-baseline="middle" opacity="0.88">C</text>
</svg>`;
}

const sizes = [
  { file: 'favicon-16x16.png',    size: 16  },
  { file: 'favicon-32x32.png',    size: 32  },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-192x192.png',  size: 192 },
  { file: 'favicon-512x512.png',  size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(Buffer.from(makeSVG(size))).png().toFile(path.join(publicDir, file));
  console.log(`Generated ${file}`);
}

await sharp(Buffer.from(makeSVG(32))).png().toFile(path.join(publicDir, 'favicon.ico'));
console.log('Generated favicon.ico');
console.log('Done — TC monogram favicons generated.');
