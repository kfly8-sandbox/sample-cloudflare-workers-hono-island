import { hydrateRoot } from 'react-dom/client'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app')

  const islands = document.querySelectorAll('[data-island]')
  console.log('islands', islands)


//  if (container) {
//    if (container.hasChildNodes()) {
//      hydrateRoot(container, <App />)
//    }
//  }
})
