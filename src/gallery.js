// /src/gallery.js — CSS-only expand, click-only lightbox
export function initGallery() {
  const items = document.querySelectorAll('.g-item')
  if (!items.length) {
    console.error('Gallery: no hay .g-item en el DOM')
    return
  }

  const overlay = document.getElementById('lightbox-overlay')
  const lbImg   = document.getElementById('lightbox-img')

  if (overlay && lbImg) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src
        if (!src) return
        lbImg.src = src
        overlay.classList.add('open')
        document.body.style.overflow = 'hidden'
        // Push history entry so browser back closes lightbox instead of navigating away
        history.pushState({ lightbox: true }, '')
      })
    })
  }

  console.log('Gallery inicializada correctamente')
}
