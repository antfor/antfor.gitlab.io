import React from 'react';
import ReactDOM from 'react-dom/client';
import FractalSettings from './UI/FractalSettings.jsx';


const root = document.getElementById("Settings");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FractalSettings></FractalSettings>
  </React.StrictMode>
)