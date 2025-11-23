
import {useState} from 'react';
import Card from 'react-bootstrap/Card';
import {calcOneRepMax, simplifyValue, Result, } from '../orm.mjs';
import {Input} from './input.tsx';
import {TabelORM, TabelPR} from './table/Table.tsx';


const maxReps = 20;

const Not = "";
type Maybe<T>=(T | typeof Not);

enum Params{
  WEIGHT = "weight",
  REPS = "reps",
}

type InputData = {
  weight: Maybe<number>,
  reps: Maybe<number>,
  increment: number,
};

const defaultSettings:InputData={
  weight: Not,
  reps: Not,
  increment: 2.5,
}

function Tables({result}:{result:Result}){

    return(
        <>
            <h2>Your <b>ORM</b> is: {simplifyValue(result.orm,2)}kg</h2>
            <TabelORM data={result.match}/>
            <br/>
            <h2>Needed for new <b>ORM</b>:</h2>
            <TabelPR data={result.minPRs}/>
        </>
    );
    
}

function isDataValid(weight:Maybe<number> ,reps:Maybe<number>){

    return weight !==Not && 1 <= weight && reps !== Not && 1 <= reps && reps <= 20;
}

function getParamNumber(name:Params, url = window.location.href):Maybe<number>{
    try {
        const value = new URL(url).searchParams.get(name);
        return Number.isNaN(value) || value === null || value === Not? Not : Number(value);
    } catch (err) {
        console.error("Error getting: ",name," from url. Error: ", err);
        return Not;
    }
}

function setParam(name:Params, value:Maybe<number>, uri = window.location.href) {
    try {
        const url = new URL(uri);
        url.searchParams.set(name, value.toString());
        history.replaceState(history.state, '', url);
    } catch (err) {
        console.error("Invalid URL:", err);
        return uri;
    }
}

export function Calculator(){

  const [increment, setIncrement] = useState(defaultSettings.increment);

  let startWeight = getParamNumber(Params.WEIGHT);
  startWeight = startWeight === Not ? defaultSettings.weight : startWeight;
  let startReps = getParamNumber(Params.REPS);
  startReps = startReps === Not ? defaultSettings.reps : startReps;
  
  const [input, setInput] = useState({weight:startWeight, reps:startReps});
  
  setParam(Params.WEIGHT, input.weight);
  setParam(Params.REPS, input.reps);

  const dataValid = isDataValid(input.weight, input.reps);

  let result;
  let tables;

  if(dataValid){
    try{
      result = calcOneRepMax(Number(input.weight),Number(input.reps),increment);
      tables = Tables({result});
    } catch(e){
      console.error("An error occurred: ", (e as Error).message);
    }
  }
  

  return(
      <div id="hideNav">
      <Card id="calculator" data-bs-theme="dark">
          <Card.Header><h1 className="metal-mania-regular"><b>O</b>ne-<b>R</b>ep-<b>M</b>ax 🐍</h1></Card.Header>
          <Card.Body className='container'> 
           
            <Input Iweight={startWeight} Ireps={startReps} increment={increment} maxRep={maxReps} setIncrement={setIncrement} setInputs={(w,r) => {setInput({ weight:w, reps:r})}}/>
            
            <br/>
            {tables}
          </Card.Body>
      </Card>
      </div>
  );
}