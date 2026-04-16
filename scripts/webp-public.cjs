/**
 * Convierte public/assets/**\/*.{png,jpg} → .webp con resize inteligente.
 * Trabaja directamente desde los PNG/JPG fuente.
 */
const sharp = require('sharp')
const fs    = require('fs')
const path  = require('path')

const PUBLIC = path.join(__dirname, '..', 'public', 'assets')

// Dimensiones máximas por carpeta/tipo
const MAX = {
  root:        { maxW: 1400, q: 84 },  // slides hero (botellas)
  botellas:    { maxW: 1200, q: 84 },
  bottles:     { maxW: 1400, q: 84 },
  empresas:    { maxW: 1400, q: 82 },
  restaurantes:{ maxW: 1400, q: 82 },
  web:         { maxW: 1400, q: 82 },
  photos:      { maxW: 1400, q: 82 },
  brand:       { maxW: 600,  q: 85 },
  logos:       { maxW: 400,  q: 80 },
}

function getCfg(relDir) {
  const folder = relDir.split(path.sep)[0] || 'root'
  return MAX[folder] || MAX.root
}

async function walk(dir, rel = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full    = path.join(dir, e.name)
    const relPath = rel ? rel + path.sep + e.name : e.name
    if (e.isDirectory()) {
      await walk(full, relPath)
    } else if (/\.(png|jpg|jpeg)$/i.test(e.name)) {
      const outName = e.name.replace(/\.(png|jpg|jpeg)$/i, '.webp')
      const outPath = path.join(dir, outName)
      const cfg     = getCfg(rel)
      const prevSz  = fs.existsSync(outPath) ? fs.statSync(outPath).size : null

      try {
        await sharp(full)
          .resize(cfg.maxW, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: cfg.q, effort: 6 })
          .toFile(outPath + '.tmp')

        const origSz = fs.statSync(full).size
        const newSz  = fs.statSync(outPath + '.tmp').size
        fs.renameSync(outPath + '.tmp', outPath)

        const saving = Math.round((1 - newSz/origSz)*100)
        const flag   = newSz < 500*1024 ? '🟢' : '🟡'
        console.log(
          flag + ' ' + relPath.padEnd(45) +
          (origSz/1024).toFixed(0).padStart(8) + ' KB → ' +
          (newSz/1024).toFixed(0).padStart(5) + ' KB  -' + saving + '%'
        )
      } catch (err) {
        console.error('✗', relPath, err.message)
        if (fs.existsSync(outPath + '.tmp')) fs.unlinkSync(outPath + '.tmp')
      }
    }
  }
}

async function run() {
  console.log('\n══════════════════════════════════════════════════════')
  console.log('  Convirtiendo public/assets/**/*.{png,jpg} → WebP')
  console.log('══════════════════════════════════════════════════════\n')
  await walk(PUBLIC)
  console.log('\n  ✓ Conversión completada\n')
}

run()
