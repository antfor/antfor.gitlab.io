import "scss/scss/navbar.scss";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Ui from './ui.js'
import './bulk.css'

const root = document.getElementById("bulk");
if(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Ui></Ui>
    </React.StrictMode>
  )
  