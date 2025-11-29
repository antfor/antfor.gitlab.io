import { useEffect, useRef, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import { Match, PR, simplifyValue } from '../orm/orm.mjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { SORTODIR, isEqual, sortTable, tryGetDir, handleClick } from './table.mjs'
import './table.css';
import React from 'react';


const Isort = <FontAwesomeIcon className="clickable" icon={faSort} size="2xs" />
const IsortUp = <FontAwesomeIcon className="clickable" icon={faSortUp} size="2xs" />
const IsortDown = <FontAwesomeIcon className="clickable" icon={faSortDown} size="2xs" />

function getSortIcon(colum: number, sortedColum: number, order: SORTODIR, data: number[][]) {

  if (colum !== sortedColum) {

    if (order === SORTODIR.ZERO || isEqual(colum, data)) {
      return;
    }
    return Isort;
  }

  switch (order) {
    case SORTODIR.UP: return IsortUp;
    case SORTODIR.DOWN: return IsortDown;
    case SORTODIR.NONE: return Isort;
    case SORTODIR.EQUAL: return;
    case SORTODIR.ZERO: return;
    default: return;
  }
}

function HeadLine(text: (React.JSX.Element | string), Icon: (React.JSX.Element | undefined)) {
  return (
    <Stack direction="horizontal" className='justify-content-between'>
      <span>{text}</span>
      {Icon}
    </Stack>
  );
}

const EmptyMatch: Match = {
  percentage: 0,
  weight: 0,
  reps: 0,
}


export function TableORM({ data }: { data: Match[] }) {

  const keys = Object.keys(EmptyMatch);
  const values = data.map(Object.values) as number[][];

  const percentage = keys.indexOf('percentage');
  const weight = keys.indexOf('weight');
  const reps = keys.indexOf('reps');


  const startCol = weight;
  const startDir = SORTODIR.DOWN;
  const preferdDir = useRef(startDir);


  const [sorting, setSorting] = useState({ column: startCol, order: tryGetDir(startCol, values, startDir) });

  useEffect(() => {

    if (sorting.order === SORTODIR.UP || sorting.order === SORTODIR.DOWN)
      preferdDir.current = sorting.order;
  }, [sorting.order]);

  useEffect(() => {
    const values = data.map(Object.values) as number[][];

    setSorting(prev => ({ column: prev.column, order: tryGetDir(prev.column, values, preferdDir.current) }));
  }, [data]);

  const getIcon = (c: number) => getSortIcon(c, sorting.column, sorting.order, values);

  const sortedValues = sortTable(sorting.column, sorting.order, values);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th onClick={handleClick(setSorting, percentage, values)}>{HeadLine("Percentage", getIcon(percentage))}</th>
          <th onClick={handleClick(setSorting, weight, values)}>{HeadLine("Weight", getIcon(weight))}</th>
          <th onClick={handleClick(setSorting, reps, values)}>{HeadLine("Reps", getIcon(reps))}</th>
        </tr>
      </thead>

      <tbody>
        {sortedValues.map((match, i) =>
          <tr key={i}>
            <td>{simplifyValue(match[percentage], 0)}%</td>
            <td>{simplifyValue(match[weight], 2)}kg</td>
            <td>{simplifyValue(match[reps], 0)}</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

const EmptyPR: PR = {
  weight: 0,
  reps: 0,
  orm: 0,
  dif: 0,
}

export function TablePR({ data }: { data: PR[] }) {

  const keys = Object.keys(EmptyPR);
  const values = data.map(Object.values) as number[][];

  const orm = keys.indexOf('orm');
  const weight = keys.indexOf('weight');
  const reps = keys.indexOf('reps');
  const dif = keys.indexOf('dif');

  const startCol = dif;
  const startDir = SORTODIR.UP;
  const preferdDir = useRef(startDir);


  const [sorting, setSorting] = useState({ column: startCol, order: tryGetDir(startCol, values, startDir) });

  useEffect(() => {

    if (sorting.order === SORTODIR.UP || sorting.order === SORTODIR.DOWN)
      preferdDir.current = sorting.order;
  }, [sorting.order]);

  useEffect(() => {
    const values = data.map(Object.values) as number[][];

    setSorting(prev => ({ column: prev.column, order: tryGetDir(prev.column, values, preferdDir.current) }));
  }, [data]);

  const getIcon = (c: number) => getSortIcon(c, sorting.column, sorting.order, values);

  const sortedValues = sortTable(sorting.column, sorting.order, values);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th onClick={handleClick(setSorting, weight, values)}>{HeadLine("Weight", getIcon(weight))}</th>
          <th onClick={handleClick(setSorting, reps, values)}>{HeadLine("Reps", getIcon(reps))}</th>
          <th onClick={handleClick(setSorting, orm, values)}>{HeadLine(<>New <b>ORM</b></>, getIcon(orm))}</th>
          <th onClick={handleClick(setSorting, dif, values)}>{HeadLine("Increase", getIcon(dif))}</th>
        </tr>
      </thead>

      <tbody>
        {sortedValues.map((pr, i) =>
          <tr key={i}>
            <td>{simplifyValue(pr[weight], 2)}kg{/*todo need to round up? so you get the record*/}</td>
            <td>{simplifyValue(pr[reps], 0)}</td>
            <td>{simplifyValue(pr[orm], 1)}kg</td>
            <td>+{simplifyValue(pr[dif], 2)}kg</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}