import 'scss/interest.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from 'react-bootstrap/Card';
import { InterestChart } from './barchart/InterestChart.tsx';
import './calculator.css';




const chart = document.getElementById('calculators');

function container() {
  return (
    <div id="hideNav">
      <Card id="calculator" data-bs-theme="dark">
        <Card.Header>Ränta på ränta</Card.Header>
        <Card.Body>
          <InterestChart />
        </Card.Body>
      </Card>
    </div>
  );
}

if (chart)
  ReactDOM.createRoot(chart).render(
    <React.StrictMode>
      {container()}
    </React.StrictMode>
  )