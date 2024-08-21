import React from 'react'
import ReactDOM from 'react-dom/client'
import Card from 'react-bootstrap/Card';
import { IntrestChart} from './IntrestOnIntrest.jsx'
import './calculator.css'




const chart = document.getElementById('calculators');

function container(){
    return(
        <Card data-bs-theme="dark">
            <Card.Header> Ränta på ränta </Card.Header>
            <Card.Body> 
             <IntrestChart/> 
            </Card.Body>
        </Card>
    );
}

ReactDOM.createRoot(chart).render(
  <React.StrictMode>
    {container()}
  </React.StrictMode>
)