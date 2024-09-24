import React from 'react'
import ReactDOM from 'react-dom/client'
import DefaultNavbar from './DefaultNavbar.tsx'
import {PAGES, page} from './Pages.js';
import "./css/navbar.css"

const navbar = document.getElementById('navbar');


function getActive(navbar:HTMLElement): page | null{
  const active = navbar.getAttribute("active");
  
  if(active === null){
    return null;
  }

  if(Object.prototype.hasOwnProperty.call(PAGES, active)){
    const key = active as keyof typeof PAGES;
    return PAGES[key];
  }
 
  return null;
 
}

function getFixed(navbar:HTMLElement): boolean{
  const fixed = navbar.getAttribute("fixed");

  return fixed === "true";
}

if(navbar)
  ReactDOM.createRoot(navbar).render(
    <React.StrictMode>
      <DefaultNavbar active={getActive(navbar)} fixed={getFixed(navbar)}/>
    </React.StrictMode>
  )
