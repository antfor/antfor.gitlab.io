import React from 'react'
import ReactDOM from 'react-dom/client'
import ZoomButton from './ZoomButton';
import WelcomePill from './WelcomePill';





const navbar = document.getElementById('foreground') as HTMLElement;

ReactDOM.createRoot(navbar).render(
  <React.StrictMode>
    <WelcomePill/>
    <ZoomButton/>
  </React.StrictMode>
)