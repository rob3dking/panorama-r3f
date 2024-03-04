import { createRoot } from 'react-dom/client'
import './styles.css'
import './3D/hotspot.css';
import { App } from './3D/Canvas'
import { UI } from './views/Overlay'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <UI />
  </>
)
