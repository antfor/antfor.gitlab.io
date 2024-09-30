import '../../bootstrap/home.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ZoomButton from './ZoomButton';
import WelcomePill from './WelcomePill';





const foreground = document.getElementById('foreground');

if(foreground)
  ReactDOM.createRoot(foreground).render(
    <React.StrictMode>
      <WelcomePill/>
      <ZoomButton/>
    </React.StrictMode>
  )