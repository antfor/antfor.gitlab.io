import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import Table from 'react-bootstrap/Table';
import {Result, PR, simplifyValue} from '../../orm.mjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

enum SORTODIR{
  EQUAL = 'eql',
  UP = 'asc',
  DOWN = 'desc',
  NONE = '',
  ZERO = 'zero', //todo handle
}

const Isort = <FontAwesomeIcon icon={faSort} size="2xs"/>
const IsortUp = <FontAwesomeIcon icon={faSortUp}  size="2xs"/>
const IsortDown = <FontAwesomeIcon icon={faSortDown}  size="2xs"/>

function getSortIcon(colum:number, sortedColum:number, order:SORTODIR, data: number[][]){

  if(colum!==sortedColum){
 
    if(order === SORTODIR.ZERO || isEqual(colum,data)){
      return;
    }
    return Isort;
  }

  switch(order){
    case SORTODIR.UP: return IsortUp;
    case SORTODIR.DOWN: return IsortDown;
    case SORTODIR.NONE: return Isort;
    case SORTODIR.EQUAL: return;
    case SORTODIR.ZERO: return;
    default: return;
  } 
}

function sortTable(colum:number, order:SORTODIR, data: number[][]){
  if(order === SORTODIR.NONE || order ===  SORTODIR.EQUAL || order === SORTODIR.ZERO)
    return data;

  return data.sort((a, b) => order===SORTODIR.UP ? a[colum] - b[colum] : b[colum] - a[colum]);
}

function getOrder(col: number, values: number[][]) {
  if (values.length === 0) return SORTODIR.ZERO;
  if (values.length === 1) return SORTODIR.EQUAL;

  let Up = false;
  let Down = false;

  for (let i = 0; i + 1 < values.length; i++) {
    const a = values[i][col];
    const b = values[i + 1][col];

    if (a < b) Up = true;
    else if (a > b) Down = true;

    if (Up && Down) return SORTODIR.NONE;
  }

  if (!Up && !Down) return SORTODIR.EQUAL;
  if (Up && !Down) return SORTODIR.UP;
  if (Down && !Up) return SORTODIR.DOWN;

  return SORTODIR.NONE;
}

type reactSet = Dispatch<SetStateAction<{column: number;order: SORTODIR;}>>;
function handleClick(setSorting:reactSet, newCol:number, values:number[][]){

  const toggle = (o:SORTODIR) =>  (o === SORTODIR.EQUAL) || (o === SORTODIR.ZERO) ? o : 
                                   o === SORTODIR.DOWN ? SORTODIR.UP : SORTODIR.DOWN;

  const newOrder = (o:SORTODIR, cOld:number, cNew:number) => cOld === cNew ? toggle(o) : toggle(getOrder(cNew, values)); 
  
  return () => {setSorting((prev) => ({column: newCol, order: newOrder(prev.order, prev.column, newCol)}))};
}

function isEqual(col:number, data: number[][]){
  
  return data.reduce((acc,value) => (acc && (data[0][col] === value[col])), true);
}

export function TabelORM({data}:{data:Result}) {
 
  const len =Math.min(data.reps.length, Math.min(data.percantage.length, data.weight.length));

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Percentage {}</th>
          <th>Weight {}</th>
          <th>Reps {}</th>
        </tr>
      </thead>

      <tbody>
        {Array.from({length:len},(_,i)=>
            <tr key={i}>
                <td>{simplifyValue(data.percantage[i],0)}%</td>
                <td>{simplifyValue(data.weight[i],2)}kg</td>
                <td>{simplifyValue(data.reps[i],0)}</td>
            </tr>
        )}
      </tbody>
    </Table>
  );
}

const EmptyPR:PR = {
  weight: 0,
  reps: 0,
  orm: 0,
  dif: 0,
}

function tryGetDir(column:number, values:number[][], wanted:SORTODIR){

    const dir = getOrder(column, values);

    if(dir === wanted)
      return wanted;

    if(dir === SORTODIR.ZERO || dir === SORTODIR.EQUAL || wanted === SORTODIR.ZERO || wanted === SORTODIR.EQUAL || wanted === SORTODIR.NONE)
      return dir;

    return wanted;
}

function handleEffect(preferdDir:SORTODIR, data:PR[], setSorting:reactSet){
    const values = data.map(Object.values) as number[][];

    setSorting(prev => ({column:prev.column, order:tryGetDir(prev.column, values, preferdDir)}));
}

export function TabelPR({data}:{data:PR[]}) {

  const keys = Object.keys(EmptyPR);
  const values = data.map(Object.values) as number[][];

  const orm = keys.indexOf('orm');
  const weight = keys.indexOf('weight');
  const reps = keys.indexOf('reps');
  const dif = keys.indexOf('dif');

  const startCol = dif;
  const startDir = SORTODIR.UP;
  const preferdDir = useRef(startDir);


  const [sorting, setSorting] = useState({column:startCol, order:tryGetDir(startCol, values, startDir)}); 
    
  useEffect(() => {

    if(sorting.order === SORTODIR.UP || sorting.order === SORTODIR.DOWN)
      preferdDir.current = sorting.order;
  }, [sorting.order]);

  useEffect(() => {
    handleEffect(preferdDir.current, data, setSorting);
  }, [data]);

  const getIcon = (c:number) => getSortIcon(c, sorting.column, sorting.order, values);
  
  const sortedValues = sortTable(sorting.column, sorting.order, values);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th onClick={handleClick(setSorting, weight, values)}>Weight  {getIcon(weight)}</th>
          <th onClick={handleClick(setSorting, reps, values)}>Reps  {getIcon(reps)}</th>
          <th onClick={handleClick(setSorting, orm, values)}>New <b>ORM</b> {getIcon(orm)}</th>
          <th onClick={handleClick(setSorting, dif, values)}>Increase  {getIcon(dif)}</th>
        </tr>
      </thead>

      <tbody>
        {sortedValues.map((pr,i)=>
            <tr key={i}>
                <td>{simplifyValue(pr[weight],2)}kg{/*todo need to round up? so you get the record*/}</td>
                <td>{simplifyValue(pr[reps],0)}</td>
                <td>{simplifyValue(pr[orm],1)}kg</td>
                <td>+{simplifyValue(pr[dif],2)}kg</td>
            </tr>
        )}
      </tbody>
    </Table>
  );
}