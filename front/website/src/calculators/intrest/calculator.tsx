import 'scss/intrest.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from 'react-bootstrap/Card';
import { IntrestChart} from './barchart/IntrestChart.tsx';
import './calculator.css';




const chart = document.getElementById('calculators');

function container(){
    return(
        <div id="hideNav">
        <Card id="calculator" data-bs-theme="dark">
            <Card.Header>Ränta på ränta</Card.Header>
            <Card.Body> 
              <IntrestChart/> 
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