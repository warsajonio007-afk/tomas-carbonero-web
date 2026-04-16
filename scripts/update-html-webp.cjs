/**
 * Reemplaza .png/.jpg → .webp en index.html del proyecto Vite.
 * Excluye favicons y cualquier enlace que no sea /assets/.
 */
const fs   = require('fs')
const path = require('path')

const HTML = path.join(__dirname, '..', 'index.html')
let html = fs.readFileSync(HTML, 'utf8')

// Solo reemplazar dentro de atributos src, data-src, href que apunten a /assets/
// Excluir favicon-*.png, apple-touch-icon.png (no están en /assets/)
const before = (html.match(/\/assets\/[^"']*\.(png|jpg|jpeg)/gi) || []).length

html = html.replace(
  /(src|data-src|href|srcset)="(\/assets\/[^"]+)\.(png|jpg|jpeg)"/gi,
  '$1="$2.webp"'
)

const after = (html.match(/\/assets\/[^"']*\.(png|jpg|jpeg)/gi) || []).length
const replaced = before - after

fs.writeFileSync(HTML, html, 'utf8')
console.log('✓ index.html actualizado')
console.log('  ' + replaced + ' referencias png/jpg → webp')
console.log('  ' + after + ' referencias png/jpg restantes (favicons u otras)')

// Listar todas las referencias de imagen en index.html
const imgs = [...html.matchAll(/(src|data-src)="([^"]+\.(webp|png|jpg|jpeg|svg))"/gi)]
console.log('\n  Referencias de imagen en index.html:')
imgs.forEach(m => console.log('  ' + m[2]))
