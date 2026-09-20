import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import Home from './pages/Home/Home'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Home/>
  </HashRouter>,
)
