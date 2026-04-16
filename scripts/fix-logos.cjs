/**
 * Convierte los Logos-NN.png huérfanos a WebP y los sincroniza
 * en las 3 ubicaciones que deben tener los mismos assets:
 *   1. public/assets/logos/   ← fuente (única verdad)
 *   2. dist/assets/logos/     ← output de Vite build
 *   3. TOMASCARBONERO_SUBIR/assets/logos/ ← entregable
 */
const sharp = require('sharp')
const fs    = require('fs')
const path  = require('path')

const SRC_DIR  = path.join(__dirname, '..', '..', 'Tomás Carbonero', 'Logos final')
const PUBLIC   = path.join(__dirname, '..', 'public', 'assets', 'logos')
const DIST     = path.join(__dirname, '..', 'dist', 'assets', 'logos')
const SUBIR    = path.join(__dirname, '..', '..', 'TOMASCARBONERO_SUBIR', 'assets', 'logos')

// PNGs huérfanos encontrados en SUBIR (no están en public ni en dist)
const TARGETS = [
  'Logos-01.png',
  'Logos-02.png',
  'Logos-06.png',
  'Logos-08.png',
  'Logos-12.png',
  'Logos-14.png',
]

async function run() {
  console.log('\n  Convirtiendo logos huérfanos PNG → WebP\n')

  for (const filename of TARGETS) {
    const srcPng  = path.join(SRC_DIR, filename)
    const outName = filename.replace('.png', '.webp').toLowerCase()  // logos-01.webp

    if (!fs.existsSync(srcPng)) {
      console.log('  ⚠ No encontrado en fuente: ' + filename)
      continue
    }

    // Convertir WebP desde fuente original (no desde SUBIR para evitar recompresión doble)
    const tmpPath = path.join(PUBLIC, outName + '.tmp')
    await sharp(srcPng)
      .resize(400, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(tmpPath)

    const origKB = (fs.statSync(srcPng).size / 1024).toFixed(0)
    const newKB  = (fs.statSync(tmpPath).size / 1024).toFixed(0)
    const saving = Math.round((1 - fs.statSync(tmpPath).size / fs.statSync(srcPng).size) * 100)

    // 1. Instalar en public/ (fuente)
    fs.renameSync(tmpPath, path.join(PUBLIC, outName))

    // 2. Copiar a dist/ si existe la carpeta
    if (fs.existsSync(DIST)) {
      fs.copyFileSync(path.join(PUBLIC, outName), path.join(DIST, outName))
    }

    // 3. Copiar a TOMASCARBONERO_SUBIR/
    if (fs.existsSync(SUBIR)) {
      fs.copyFileSync(path.join(PUBLIC, outName), path.join(SUBIR, outName))
    }

    console.log('  🟢 ' + filename.padEnd(16) + ' → ' + outName.padEnd(16) +
      origKB.padStart(5) + ' KB → ' + newKB.padStart(4) + ' KB  -' + saving + '%')
  }

  // Eliminar los PNG originales de SUBIR (ya están reemplazados por WebP)
  console.log('\n  Eliminando PNG huérfanos de SUBIR...')
  for (const filename of TARGETS) {
    const pngInSubir = path.join(SUBIR, filename)
    if (fs.existsSync(pngInSubir)) {
      fs.unlinkSync(pngInSubir)
      console.log('  🗑  ' + filename + ' eliminado de TOMASCARBONERO_SUBIR')
    }
  }

  // Resumen
  console.log('\n  Sincronización completada:')
  ;[['public/assets/logos', PUBLIC], ['dist/assets/logos', DIST], ['TOMASCARBONERO_SUBIR/assets/logos', SUBIR]]
    .forEach(([label, dir]) => {
      if (!fs.existsSync(dir)) return
      const webps = fs.readdirSync(dir).filter(f => /\.webp$/.test(f)).length
      const pngs  = fs.readdirSync(dir).filter(f => /\.png$/.test(f)).length
      console.log('  ' + label.padEnd(38) + webps + ' webp  ' + (pngs ? '⚠️ ' + pngs + ' png' : '✅ 0 png'))
    })
  console.log()
}

run().catch(console.error)
