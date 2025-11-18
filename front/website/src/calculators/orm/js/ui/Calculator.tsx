
import {useState} from 'react';
import Card from 'react-bootstrap/Card';
import {calcOneRepMax, simplifyValue, Result} from '../orm.mjs';
import {Input} from './input.tsx';
import {TabelORM, TabelPR} from './Table.tsx';

//todo make 1-20 and not 0-19
type Range<N extends number, Acc extends number[] = []> = 
  Acc['length'] extends N 
    ? Acc[number] 
    : Range<N, [...Acc, Acc['length']]>;

const maxReps = 20;
type Reps = number;//Range<21>;
//type Increment = (0|1|1.25|2.5|5);

type Maybe<T>=(T|"");
type WeightAndReps ={weight:Maybe<number>, reps:Maybe<number>};

type InputData = {
  weight: Maybe<number>,
  reps: Maybe<number>,
  increment: number,
};

const defaultSettings:InputData={
  weight: "",
  reps: "",
  increment: 2.5,
}

function Tables({result}:{result:Result}){

    return(
        <>
            <h2>Your <b>ORM</b> is: {simplifyValue(result.orm,1)}kg</h2>
            <TabelORM data={result}/>
            <br/>
            <h2>Needed for new <b>ORM</b>:</h2>
            <TabelPR data={result.minPRs}/>
        </>
    );
    
}

function isDataValid(weight:Maybe<number> ,reps:Maybe<number>){

    return weight !=="" && 1 <= weight && reps !== "" && 1 <= reps && reps <= 20;
}

export function Calculator(){

  const [increment, setIncrement] = useState(defaultSettings.increment);

  const [weight, setWeight] = useState(defaultSettings.weight);
  const [reps, setReps] = useState(defaultSettings.reps);  //todo combine
  
  const dataValid = isDataValid(weight, reps);

  let result;
  let tables;
  if(dataValid){
    result = calcOneRepMax(Number(weight),Number(reps),increment);
    tables = Tables({result});

    /*
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
    */
  }
  

  return(
      <div id="hideNav">
      <Card id="calculator" data-bs-theme="dark">
          <Card.Header><h1 className="metal-mania-regular"><b>O</b>ne-<b>R</b>ep-<b>M</b>ax 🐍</h1></Card.Header>
          <Card.Body className='container'> 
           
            <Input increment={increment} maxRep={maxReps} setIncrement={setIncrement} setWeight={setWeight} setReps={setReps}/>
            
            <br/>
            {tables}
          </Card.Body>
      </Card>
      </div>
  );
}