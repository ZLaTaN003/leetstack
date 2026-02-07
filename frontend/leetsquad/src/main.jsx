import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes,BrowserRouter } from "react-router";
import Navbar from './components/NavBar.jsx'
import GroupCreatorMenu from './Group.jsx'
import { AppLayout } from "./components/layout/AppLayout";
import App from './App.jsx';


import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </StrictMode>,
)
