import Table from 'react-bootstrap/Table';
import {Result, PR, simplifyValue} from '../orm.mjs';



export function TabelORM({data}:{data:Result}) {
    const len =Math.min(data.reps.length ,Math.min(data.percantage.length, data.weight.length));
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th  >Percentage</th>
          <th  >Weight</th>
          <th  >Reps</th>
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


function colorDif(){
    
}

export function TabelPR({data}:{data:PR[]}) {
    const len = data.length;
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Weight</th>
          <th>Reps</th>
          <th>New <b>ORM</b> (+increce)</th>
        </tr>
      </thead>

      <tbody>
        {Array.from({length:len},(_,i)=>
            <tr key={i}>
                <td>{simplifyValue(data[i].weight,2/*todo need to round up? so you get the record*/)}kg</td> 
                <td>{simplifyValue(data[i].reps,0)}</td>
                <td>{simplifyValue(data[i].orm,1)}kg (+{simplifyValue(data[i].dif,2)}kg)</td>
            </tr>
        )}
      </tbody>
    </Table>
  );
}


export function tabelB() {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
  );
}