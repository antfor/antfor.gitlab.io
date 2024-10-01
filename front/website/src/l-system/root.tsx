import "scss/l-system.scss";
import React from 'react';
import ReactDOM from 'react-dom/client';
import FractalSettings from './UI/FractalSettings.tsx';


const root = document.getElementById("Settings");
if(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <FractalSettings></FractalSettings>
    </React.StrictMode>
  )