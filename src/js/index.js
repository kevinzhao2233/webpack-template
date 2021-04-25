import '../assets/style/reset.css'
import '../assets/style/main.scss'

document.addEventListener('click', (e) => {
  if (e.target.nodeName.toUpperCase() === 'H1') {
    document.location.hash = e.target.id
  }
})
