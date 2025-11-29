import { Dispatch, SetStateAction } from 'react';

export enum SORTODIR {
  EQUAL = 'eql',
  UP = 'asc',
  DOWN = 'desc',
  NONE = '',
  ZERO = 'zero', //todo handle
}
type reactSet = Dispatch<SetStateAction<{ column: number; order: SORTODIR; }>>;


export function sortTable(colum: number, order: SORTODIR, data: number[][]) {
  if (order === SORTODIR.NONE || order === SORTODIR.EQUAL || order === SORTODIR.ZERO)
    return data;

  return data.sort((a, b) => order === SORTODIR.UP ? a[colum] - b[colum] : b[colum] - a[colum]);
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


export function handleClick(setSorting: reactSet, newCol: number, values: number[][]) {

  const toggle = (o: SORTODIR) => (o === SORTODIR.EQUAL) || (o === SORTODIR.ZERO) ? o :
    o === SORTODIR.DOWN ? SORTODIR.UP : SORTODIR.DOWN;

  const newOrder = (o: SORTODIR, cOld: number, cNew: number) => cOld === cNew ? toggle(o) : toggle(getOrder(cNew, values));

  return () => { setSorting((prev) => ({ column: newCol, order: newOrder(prev.order, prev.column, newCol) })) };
}

export function isEqual(col: number, data: number[][]) {

  return data.reduce((acc, value) => (acc && (data[0][col] === value[col])), true);
}

export function tryGetDir(column: number, values: number[][], wanted: SORTODIR) {

  const dir = getOrder(column, values);

  if (dir === SORTODIR.ZERO || dir === SORTODIR.EQUAL) {
    return dir;
  } else if (wanted === SORTODIR.UP || wanted === SORTODIR.DOWN) {
    return wanted;
  }

  return dir;
}