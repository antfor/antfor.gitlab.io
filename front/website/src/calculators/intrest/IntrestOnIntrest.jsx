import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import {
  round
} from 'mathjs'
import { calcSavings } from './intrest.js';
import { SettingsComponent } from './settings.jsx';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from './resultat.jsx';
import styles from'./intrest.module.css';
import { simplifyValue, parseFloatSafe } from './parse.js';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

let options = {
    plugins: {
      title: {
        display: false,
        text: 'ränta på ränta',
      },
      
      tooltip: {
       // mode: 'label',
        callbacks: {
            title: (ttItem) => (`År: ${ttItem[0].label}`),
            label: function(context) {
                
                var label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    let value = context.parsed.y;

                    label += simplifyValue(value,0) + ' kr';
                    const dataPoints = context.chart.tooltip.dataPoints;
                    const total = dataPoints.reduce((acc, val) => acc + val.raw, 0);
            
                    if(total == 0){
                      label += ` (0%)`;
                    }else{
                      label += ` (${round(value/total*100, 0)}%)`;
                    }
                }
                return label;
                
                
            },
            afterBody: (ttItem) => (`Totalt: ${simplifyValue(ttItem.reduce((acc, val) => acc + val.raw, 0),0)} kr (100%)`)
        }
    }, 
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'x',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };


function getTime(N){
  N = parseFloatSafe(N);
  return new Array(N+1).fill().map((_,i) => i );

}

function removeEmpty(data){
  return data.filter((v) => v.data.reduce((acc,val) => acc || val != 0, false));
}

function totalIntrest(data){
  return removeEmpty([{
    label: 'ränta',
    data: data.totalIntrest,
    backgroundColor: 'rgb(230, 142, 65)',
    intrest: true,
  }]);
}

function totalDeposit(data){
  return removeEmpty([{
    label: 'insata pengar',
    data: data.totalAcc,
    backgroundColor: 'rgb(60, 120, 201)',
    intrest: false,
  }]);
}

function accBreakdown(data){
  return removeEmpty([{
    label: 'startbelopp',
    data: data.accPrincipel,
    backgroundColor: 'rgb(11, 83, 148)',
    intrest: false,
  },
  {
    label: 'månadssparande',
    data: data.accMonthly,
    backgroundColor: 'rgb(109, 158, 235)',
    intrest: false,
  }]);
}
function intrestBreakdown(data){
  return removeEmpty([{
    label: 'ränta på startbelopp',
    data: data.intrestPrincipel,
    backgroundColor: 'rgb(255, 217, 102)',
    intrest: true,
  },
  {
    label: 'ränta på månadssparande',
    data: data.intrestMonthly,
    backgroundColor: 'rgb(230, 145, 56)',
    intrest: true,
  },{
    label: 'ränta på ränta',
    data: data.intrestIntrest,
    backgroundColor: 'rgb(204, 65, 37)',
    intrest: true,
  }]);
}

function getDatasets(data, settings){

  let intrest = settings.intrestBreakdown ? intrestBreakdown(data): totalIntrest(data);
  let acc = settings.accBreakdown ? accBreakdown(data): totalDeposit(data);
  
  return acc.concat(intrest);

}


function getModel(data, settings){
  return {
    labels: getTime(settings.time),
    datasets: getDatasets(data, settings),
  };
}

function defultSettings(){
  return   {
    intrest: "7",
    startMoney: "5000",
    monthlySaving: "100",
    time: "20",
    intrestBreakdown: false,
    accBreakdown: false,
  };
}

function IntrestChart(){
 
    const [settings, setSettings] = useState(defultSettings());
   
    let dataPoints = calcSavings(...[settings.startMoney, settings.monthlySaving, settings.intrest, settings.time].map(parseFloatSafe));
    let model = getModel(dataPoints, settings);

    let last = parseFloatSafe(settings.time);
    let tot = dataPoints.totalSavings[last];

    return (
        <Container>
        <Row>
          <Col xl={9} className={"col-xl-9 "+ styles.chart} >
            <Bar options={options} data={model} />
            <div className="d-none d-xl-block">
              {Result(model.datasets, tot, last)}
            </div>
          </Col>
          <Col xl={3} className="col-xl-3" >{SettingsComponent(settings, setSettings)}</Col>
        </Row>
        <Row className='d-xl-none'>{Result(model.datasets, tot, last)}</Row>
        
        </Container>

    );
}


export {IntrestChart};