import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// TODO: play with the default css to extract its reactivity portion; the rest isnt necessary
// import './index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
