import 'scss/fullBootstrap.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Calculator} from './js/ui/Calculator.tsx'
import './orm.css';

const chart = document.getElementById('calculators');

if(chart)
  ReactDOM.createRoot(chart).render(
    <React.StrictMode>
      <Calculator/>
    </React.StrictMode>
  )