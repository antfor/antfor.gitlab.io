import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { simplifyValue } from '../utils/parse.mjs';
import styles from './result.module.css'; 
import { DoughnutChart } from './DoughnutChart.jsx';
import { Total } from './Total.jsx';
import { Dataset } from '../model.mts';
import { Savings } from '../utils/intrest.mts';


function getColor(dataset:Dataset){
    return ({color:  dataset.backgroundColor});
}
  

function Paragraph(dataset:Dataset, index:number, tot:number){
    const label = dataset.label;
    const value = dataset.data[index];
    const data = simplifyValue(value, 0);
    const percent = simplifyValue(value*100.0/tot, 0);
    return(
        <Col md={6} key={label}>
            <p className={styles.resultat}> {label}: <span className={styles.nowrap} style={getColor(dataset)}>{data} kr ({percent}%)</span></p>
        </Col>
    );
}
  

function EmptyResult(){
    return(
        <div>
            <h2>Resultat</h2>
            <p>Slutsumma: 0 kr</p>
        </div>
    );
}

function Brake(arr:Dataset[]){
    if(arr.length!==0)
        return <br className='d-md-none'/>;
}

interface props{
    datasets:Dataset[],
    total:number,
    index:number,
    dataPoints:Savings
}
export default function Result({datasets, total, index, dataPoints}:props){
    
    
    if(datasets.length == 0){
        return <EmptyResult/>;
    }

    const acc = datasets.filter((dataset) => !dataset.intrest);
    const intrest = datasets.filter((dataset) => dataset.intrest && !dataset.intrestOnIntrest);
    const intrestIntrest = datasets.filter((dataset) => dataset.intrest && dataset.intrestOnIntrest);

    return(
        <Col>
            <Row className="row justify-content-between">
                <Col xl={9} className='col-xl'>
                <h2>Resultat</h2>
                    <p>Slutsumma: {simplifyValue(total,0)} kr (100%)</p>
                    {Brake(intrestIntrest)}
                    <Row>
                        {intrestIntrest.map((dataset) => Paragraph(dataset, index, total))}
                    </Row>
                    {Brake(intrest)}
                    <Row>
                        {intrest.map((dataset) => Paragraph(dataset, index, total))}
                    </Row>
                    {Brake(acc)}
                    <Row>
                        {acc.map((dataset) => Paragraph(dataset, index, total))}
                    </Row>
                    <br/>
                    <Total {...{dataPoints, total, index}} />
                </Col>

                <Col xl={3} className='col-xl'>
                  {DoughnutChart(datasets, index, total)}
                </Col>
            </Row>
        </Col>
    );
}

  