// /src/selector.js
export function initSelector() {
  const tabs = document.querySelectorAll('.cepa-tab')
  const container = document.getElementById('descriptores')
  if (!tabs.length) {
    console.error('Selector: no hay .cepa-tab en el DOM')
    return
  }
  if (!container) {
    console.error('Selector: no hay #descriptores en el DOM')
    return
  }

  const cepas = {
    italia: {
      nariz:   { texto: 'Aromas florales intensos. Jazmín, durazno y notas de lichi. Limpio y perfumado.', barra: 85 },
      paladar: { texto: 'Sedoso y delicado. Lúcuma, pecana y un toque mineral del valle de Cañete.', barra: 75 },
      final:   { texto: 'Largo y elegante, con calidez que recuerda las tardes del río.', barra: 90 }
    },
    quebranta: {
      nariz:   { texto: 'Intenso y profundo. Ciruela madura, cacao y notas terrosas del suelo arcilloso.', barra: 70 },
      paladar: { texto: 'Pleno y redondo. Chocolate negro, mora y una sutil mineralidad persistente.', barra: 95 },
      final:   { texto: 'Largo y cálido, con retrogusto de frutas oscuras que perdura en copa.', barra: 88 }
    },
    torontel: {
      nariz:   { texto: 'Vibrante y expresivo. Mandarina, pétalos de rosa y un sutil toque de miel.', barra: 90 },
      paladar: { texto: 'Fresco y ligero. Cítricos vivos, flores y una dulzura natural bien integrada.', barra: 78 },
      final:   { texto: 'Final largo, floral y refrescante con notas de miel que se prolongan.', barra: 85 }
    },
    acholado: {
      nariz:   { texto: 'Complejo y seductor. Aromas frutales, florales y especiados en perfecta armonía.', barra: 88 },
      paladar: { texto: 'Equilibrado y versátil. Expresa la riqueza completa del valle de Lunahuaná.', barra: 88 },
      final:   { texto: 'Final prolongado y complejo, con múltiples capas que evolucionan en copa.', barra: 95 }
    }
  }

  function cambiarCepa(cepa) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.cepa === cepa))
    container.style.opacity   = '0'
    container.style.transform = 'translateY(10px)'
    setTimeout(() => {
      const d = cepas[cepa]
      const set = (id, val) => {
        const el = document.getElementById(id)
        if (el) el.textContent = val
        else console.error('Selector: falta #' + id)
      }
      const setW = (id, val) => {
        const el = document.getElementById(id)
        if (el) el.style.width = val + '%'
        else console.error('Selector: falta #' + id)
      }
      set('nariz-texto',   d.nariz.texto)
      set('paladar-texto', d.paladar.texto)
      set('final-texto',   d.final.texto)
      setW('nariz-barra',   d.nariz.barra)
      setW('paladar-barra', d.paladar.barra)
      setW('final-barra',   d.final.barra)
      container.style.opacity   = '1'
      container.style.transform = 'translateY(0)'
    }, 280)
  }

  tabs.forEach(tab =>
    tab.addEventListener('click', () => cambiarCepa(tab.dataset.cepa)))

  cambiarCepa('italia')
  console.log('Selector inicializado correctamente')
}
