import 'scss/fullBootstrap.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Card from 'react-bootstrap/Card';
import {calcOneRepMax} from './js/orm.mjs';
import {Input} from './js/ui/input.tsx';
import Form from 'react-bootstrap/Form';
import './orm.css';



const chart = document.getElementById('calculators');

function round(n:number, d=0){
    const pow = 10**d;
    return Math.round(n * pow) / pow;
}

type Range<N extends number, Acc extends number[] = []> = 
  Acc['length'] extends N 
    ? Acc[number] 
    : Range<N, [...Acc, Acc['length']]>;

const maxReps = 20;
type Reps = Range<21>;
type Increment = (0|1|1.25|2.5|5);

type InputData = {
  weight: (number | ""),
  reps: (Reps | ""),
  increment: Increment,
};

const defaultSettings:InputData={
  weight: "",
  reps: "",
  increment:5,
}

function container(){
  
    const result = calcOneRepMax(78,4);

    console.log("orm");
    console.log(result.orm);
     console.log("per");
    console.log(result.percantage);
     console.log("weights");
    console.log(result.weight);
     console.log("reps");
    console.log(result.reps);
     console.log("pr");
    console.log(result.minPRs);

    return(
        <div id="hideNav">
        <Card id="calculator" data-bs-theme="dark">
            <Card.Header><h1 className="metal-mania-regular"><b>O</b>ne-<b>R</b>ep-<b>M</b>ax 🐍</h1></Card.Header>
            <Card.Body className='container'> 
              <Form className='justify-content-center align-items-center'>
                <Input maxRep={maxReps}/>
              </Form>
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