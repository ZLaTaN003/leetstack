import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes,BrowserRouter } from "react-router";
import Navbar from './components/NavBar.jsx'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
