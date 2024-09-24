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
import { calcSavings, Interval} from './utils/intrest.mts';
import { SettingsComponent } from './settings/Settings.tsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from './results/Resultat.tsx';
import styles from'./intrest.module.css';
import { parseFloatSafe } from './utils/parse.mts';
import { getModel } from './model.mts';
import { getOptions } from './options.mts';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type {Interval}
export type IntervalMap = Map<Interval,string>

function getIntervalMap():IntervalMap {
  const map = new Map<Interval,string>();
  map.set(Interval.Year, "År");
  map.set(Interval.HalfYear, "Halvår");
  map.set(Interval.Quarter, "Kvartal");
  map.set(Interval.Month, "Månad");
  return map;
}

export type Settings = {
  intrest: string, //value
  startMoney: string,
  monthlySaving: string,
  time: string,
  Interval: Interval,
  intrestBreakdown: boolean,
  intrestOnIntrestBreakdown: boolean,
  accBreakdown: boolean,
};

function defultSettings():Settings {
  return   {
    intrest: "7",
    startMoney: "5000",
    monthlySaving: "100",
    time: "20",
    Interval: Interval.Year,
    intrestBreakdown: false,
    intrestOnIntrestBreakdown: false,
    accBreakdown: false,
  };
}

function IntrestChart(){
 
    const [settings, setSettings] = useState(defultSettings());
   
    const dataPoints = calcSavings(parseFloatSafe(settings.startMoney),
                                   parseFloatSafe(settings.monthlySaving), 
                                   parseFloatSafe(settings.intrest), 
                                   parseFloatSafe(settings.time), 
                                   settings.Interval);

    const model = getModel(dataPoints, settings);

    const intervalMap = getIntervalMap();
    const intervlLabel = intervalMap.get(settings.Interval);

    const last = parseFloatSafe(settings.time);
    const total = dataPoints.totalSavings[last];

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
          <Col xl={3} className="col-xl-3" >{SettingsComponent({settings, setSettings, intervalMap})}</Col>
        </Row>
        <br className='d-xl-none'/>
        <Row className='d-xl-none'>{Result(model.datasets, total, last, dataPoints)}</Row>
      </Container>

    );
}


export {IntrestChart};