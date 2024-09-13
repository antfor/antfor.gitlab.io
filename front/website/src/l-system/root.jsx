import React from 'react';
import ReactDOM from 'react-dom/client';
import FractalSettings from './FractalSettings.jsx';


const root = document.getElementById("Lsystem");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FractalSettings></FractalSettings>
  </React.StrictMode>
)