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
import { useState, useMemo } from 'react';
import { calcSavings, Interval } from './utils/interest.mjs';
import { SettingsComponent } from './settings/Settings.tsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from './results/Resultat.tsx';
import styles from './interest.module.css';
import { getModel } from './model.mts';
import { getOptions } from './options.mts';
import { defaultInterestSettings, interestSettings, defaultBreakdownSettings, breakdownSettings, updateInterestSettings, updateBreakdownSettings } from './settings/defaultSettings.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type key<T> = keyof T;
export type { Interval, breakdownSettings, interestSettings };
export type IntervalMap = Map<Interval, string>

function getIntervalMap(): IntervalMap {
  const map = new Map<Interval, string>();
  map.set(Interval.Year, "År");
  map.set(Interval.HalfYear, "Halvår");
  map.set(Interval.Quarter, "Kvartal");
  map.set(Interval.Month, "Månad");
  return map;
}

function InterestChart() {

  const [interestSettings, setInterest] = useState(defaultInterestSettings());
  const [breakdownSettings, setBreakdown] = useState(defaultBreakdownSettings());


  const dataPoints = useMemo(() => calcSavings(interestSettings.startMoney.getNumber(),
    interestSettings.monthlySaving.getNumber(),
    interestSettings.interest.getNumber(),
    interestSettings.time.getNumber(),
    interestSettings.Interval), [interestSettings]);

  const last = interestSettings.time.getNumber();
  const model = getModel(dataPoints, last, breakdownSettings);

  const intervalMap = getIntervalMap();
  const intervlLabel = intervalMap.get(interestSettings.Interval);

  const total = dataPoints.totalSavings[last];

  const updateInterest = (k: key<interestSettings>, v: (string | Interval)) => { updateInterestSettings(setInterest, k, v) };
  const updateBreakdown = (k: key<breakdownSettings>, v: boolean) => { updateBreakdownSettings(setBreakdown, k, v) };

  const result = <Result {...{ datasets: model.datasets, total, index: last, dataPoints }} />;

  return (
    <Container>
      <Row>
        <Col xl={9} className={"col-xl-9"} >
          <Row className={styles.chart} >
            <Bar options={getOptions(intervlLabel)} data={model} />
          </Row>
          <Row className={"d-none d-xl-block"}>
            {result}
          </Row>
        </Col>
        <Col xl={3} className="col-xl-3" >
          <SettingsComponent {...{ interestSettings, updateInterest, breakdownSettings, updateBreakdown, intervalMap }} />
        </Col>
      </Row>
      <br className='d-xl-none' />
      <Row className='d-xl-none'>
        {result}
      </Row>
    </Container>
  );
}


export { InterestChart };