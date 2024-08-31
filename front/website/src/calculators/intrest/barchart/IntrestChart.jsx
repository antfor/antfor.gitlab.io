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
import { calcSavings, Interval } from './utils/intrest.js';
import { SettingsComponent } from './settings/Settings.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from './results/Resultat.jsx';
import styles from'./intrest.module.css';
import { parseFloatSafe } from './utils/parse.js';
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

function getIntervalMap() {
  const map = new Map();
  map.set(Interval.Year, "År");
  map.set(Interval.HalfYear, "Halvår");
  map.set(Interval.Quarter, "Kvartal");
  map.set(Interval.Month, "Månad");
  return map;
}

function defultSettings(){
  return   {
    intrest: "7",
    startMoney: "5000",
    monthlySaving: "100",
    time: "20",
    Interval: Interval.Year.toString(),
    intrestBreakdown: false,
    intrestOnIntrestBreakdown: false,
    accBreakdown: false,
  };
}

function IntrestChart(){
 
    const [settings, setSettings] = useState(defultSettings());
   
    let dataPoints = calcSavings(...[settings.startMoney, settings.monthlySaving, settings.intrest, settings.time, settings.Interval].map(parseFloatSafe));
    let model = getModel(dataPoints, settings);

    const intervalMap = getIntervalMap();
    const intervlLabel = intervalMap.get(parseFloatSafe(settings.Interval, Interval.Annually));

    let last = parseFloatSafe(settings.time);
    let total = dataPoints.totalSavings[last];

    return (
      <Container>
        <Row>
          <Col xl={9} className={"col-xl-9"} >
            <Row className={styles.chart} >  
              <Bar options={getOptions(intervlLabel)} data={model}/>
            </Row>
            <Row className={"d-none d-xl-block"}>
              {Result(model.datasets, total, last, dataPoints)}
            </Row>
          </Col>
          <Col xl={3} className="col-xl-3" >{SettingsComponent(settings, setSettings, intervalMap)}</Col>
        </Row>
        <br className='d-xl-none'/>
        <Row className='d-xl-none'>{Result(model.datasets, total, last, dataPoints)}</Row>
      </Container>

    );
}


export {IntrestChart};