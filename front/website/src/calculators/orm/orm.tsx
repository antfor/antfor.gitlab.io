import 'scss/fullBootstrap.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from 'react-bootstrap/Card';
import {calcOneRepMaxWithIncrement} from './js/orm.mjs'
import './orm.css';



const chart = document.getElementById('calculators');

function container(){
  
    const result = calcOneRepMaxWithIncrement(65,10);

    console.log(result.orm);
    console.log(result.percantage);
    console.log(result.weight);
    console.log(result.reps);
    console.log(result.minPRs);

    return(
        <div id="hideNav">
        <Card id="calculator" data-bs-theme="dark">
            <Card.Header>One-Rep-Max 🐍</Card.Header>
            <Card.Body> 
              <h1>One-Rep-Max 🐍</h1>
            </Card.Body>
        </Card>
        </div>
    );
}

if(chart)
  ReactDOM.createRoot(chart).render(
    <React.StrictMode>
      {container()}
    </React.StrictMode>
  )