const fs = require('fs'), path = require('path')
const DIR = path.join(__dirname, '..', '..', 'TOMASCARBONERO_SUBIR')

function walk(d, acc = []) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const full = path.join(d, e.name)
    e.isDirectory() ? walk(full, acc) : acc.push({ p: full, sz: fs.statSync(full).size })
  })
  return acc
}

const all   = walk(DIR)
const total = all.reduce((s, f) => s + f.sz, 0)
const js    = all.filter(f => /\.js$/.test(f.p) && !/favicon/.test(f.p)).reduce((s,f) => s+f.sz, 0)
const css   = all.filter(f => /\.css$/.test(f.p)).reduce((s,f) => s+f.sz, 0)
const over  = all.filter(f => /\.(webp|jpg|jpeg)$/.test(f.p) && f.sz > 500*1024)
const pngBig = all.filter(f => /\.png$/.test(f.p) && !/favicon|icon|apple/.test(f.p))

console.log('\n══════════════════════════════════════')
console.log(' TOMASCARBONERO_SUBIR — checks finales')
console.log('══════════════════════════════════════')
console.log((total/1e6 < 15 ? '✅' : '❌') + ' Total:         ' + (total/1e6).toFixed(2) + ' MB  (' + all.length + ' archivos)')
console.log((js/1024   < 500 ? '✅' : '❌') + ' JS:            ' + (js/1024).toFixed(0) + ' KB')
console.log((css/1024  < 100 ? '✅' : '❌') + ' CSS:           ' + (css/1024).toFixed(0) + ' KB')
console.log((over.length === 0 ? '✅' : '❌') + ' Img >500KB:    ' + (over.length === 0 ? 'ninguna' : over.map(f=>path.basename(f.p)).join(', ')))
console.log((pngBig.length === 0 ? '✅' : '⚠️ ') + ' PNG no-favicon: ' + (pngBig.length === 0 ? 'ninguno' : pngBig.length))

const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8')
const badRef = (html.match(/\/assets\/[^"']+\.(png|jpg|jpeg)"/gi) || [])
console.log((badRef.length === 0 ? '✅' : '❌') + ' HTML sin ref PNG/JPG en assets: ' + (badRef.length === 0 ? 'ok' : badRef.slice(0,3).join(', ')))
console.log('══════════════════════════════════════\n')
