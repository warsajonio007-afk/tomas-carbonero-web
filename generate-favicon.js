import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

function makeSVG(size) {
  const tSize   = Math.round(size * 0.52);
  const cSize   = Math.round(size * 0.48);
  const tX      = Math.round(size * 0.40);
  const tY      = Math.round(size * 0.52);
  const cX      = Math.round(size * 0.60);
  const cY      = Math.round(size * 0.56);
  const border  = size >= 32 ? `<rect x="${Math.round(size*0.06)}" y="${Math.round(size*0.06)}" width="${Math.round(size*0.88)}" height="${Math.round(size*0.88)}" fill="none" stroke="rgba(200,169,110,0.4)" stroke-width="${Math.round(size*0.03)}"/>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#080706"/>
  ${border}
  <text x="${tX}" y="${tY}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-size="${tSize}" fill="#C8A96E" text-anchor="middle" dominant-baseline="middle">T</text>
  <text x="${cX}" y="${cY}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-size="${cSize}" fill="#C8A96E" text-anchor="middle" dominant-baseline="middle" opacity="0.9">C</text>
</svg>`;
}

const sizes = [
  { file: 'favicon-16x16.png',   size: 16  },
  { file: 'favicon-32x32.png',   size: 32  },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-192x192.png', size: 192 },
  { file: 'favicon-512x512.png', size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(Buffer.from(makeSVG(size))).png().toFile(path.join(publicDir, file));
  console.log(`Generated ${file}`);
}

// favicon.ico from 32px
await sharp(Buffer.from(makeSVG(32))).png().toFile(path.join(publicDir, 'favicon.ico'));
console.log('Generated favicon.ico');
