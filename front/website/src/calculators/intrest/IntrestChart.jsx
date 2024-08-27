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
import { calcSavings, CompoundRate } from './intrest.js';
import { SettingsComponent } from './settings.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from './resultat.jsx';
import styles from'./intrest.module.css';
import { parseFloatSafe } from './parse.js';
import { getModel } from './model.js';
import { getOptions } from './options.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getCompoundRateMap() {
  const map = new Map();
  map.set(CompoundRate.Annually, "År");
  map.set(CompoundRate.Semiannually, "Halvår");
  map.set(CompoundRate.Quarterly, "Kvartal");
  map.set(CompoundRate.Monthly, "Månad");
  return map;
}

function defultSettings(){
  return   {
    intrest: "7",
    startMoney: "5000",
    monthlySaving: "100",
    time: "20",
    compoundRate: CompoundRate.Annually.toString(),
    intrestBreakdown: false,
    accBreakdown: false,
  };
}

function IntrestChart(){
 
    const [settings, setSettings] = useState(defultSettings());
   
    let dataPoints = calcSavings(...[settings.startMoney, settings.monthlySaving, settings.intrest, settings.time, settings.compoundRate].map(parseFloatSafe));
    let model = getModel(dataPoints, settings);
    const compoundRateMap = getCompoundRateMap();
    const crLabel = compoundRateMap.get(parseFloatSafe(settings.compoundRate, CompoundRate.Annually));

    let last = parseFloatSafe(settings.time);
    let total = dataPoints.totalSavings[last];

    return (
        <Container>
        <Row>
          <Col xl={9} className={"col-xl-9 "+ styles.chart} >
            <Bar options={getOptions(crLabel)} data={model} />
            <div className="d-none d-xl-block">
              {Result(model.datasets, total, last)}
            </div>
          </Col>
          <Col xl={3} className="col-xl-3" >{SettingsComponent(settings, setSettings, compoundRateMap)}</Col>
        </Row>
        <Row className='d-xl-none'>{Result(model.datasets, total, last)}</Row>
        
        </Container>

    );
}


export {IntrestChart};