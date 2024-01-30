import React from 'react'
import ReactDOM from 'react-dom/client'
import MyNavbar from './components/navbar/Navbar.jsx'
import './index.css'



const navbar = document.getElementById('navbar');

ReactDOM.createRoot(navbar).render(
  <React.StrictMode>
    <MyNavbar active={navbar.getAttribute("active")}/>
  </React.StrictMode>
)