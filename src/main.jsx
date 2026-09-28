import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TarredDevicesProvider } from './context/TarredDevicesContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <TarredDevicesProvider>
        <App />
      </TarredDevicesProvider>
    </HashRouter>
  </StrictMode>,
)
