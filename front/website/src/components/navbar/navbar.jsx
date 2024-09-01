import React from 'react'
import ReactDOM from 'react-dom/client'
import MyNavbar from './DefaultNavbar.jsx'
import "./navbar.css"


const navbar = document.getElementById('navbar');

ReactDOM.createRoot(navbar).render(
  <React.StrictMode>
    <MyNavbar active={navbar.getAttribute("active")} fixed={navbar.getAttribute("fixed")}/>
  </React.StrictMode>
)
