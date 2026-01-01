import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TypoProvider } from './context/TypoContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TypoProvider>
      <App />
    </TypoProvider>
  </StrictMode>,
)
