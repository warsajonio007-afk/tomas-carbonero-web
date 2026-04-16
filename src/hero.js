// /src/hero.js
export function initHero() {
  const slides = document.querySelectorAll('.hero-slide')
  if (!slides.length) {
    console.error('Hero: no hay .hero-slide en el DOM')
    return
  }
  let current = 0
  slides[0].classList.add('active')
  setInterval(() => {
    slides[current].classList.remove('active')
    current = (current + 1) % slides.length
    slides[current].classList.add('active')
  }, 4000)

  if (!window.matchMedia('(hover:none)').matches) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 14
      slides.forEach(s => {
        const img = s.querySelector('img')
        if (img) img.style.transform = `translate(${x}px,${y}px)`
      })
    })
  }

  const canvas = document.getElementById('particles')
  if (!canvas) {
    console.error('Hero: no hay #particles en el DOM')
    return
  }
  const ctx = canvas.getContext('2d')
  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const pts = Array.from({ length: 200 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .35,
    vy: (Math.random() - .5) * .35,
    r:  Math.random() * 1.2 + .4
  }))

  ;(function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,169,110,0.4)'
      ctx.fill()
    })
    requestAnimationFrame(loop)
  })()

  console.log('Hero inicializado correctamente')
}
