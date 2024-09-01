import { Doughnut } from 'react-chartjs-2';
import styles from './result.module.css';
import { simplifyValue } from '../utils/parse';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
  } from 'chart.js';

  ChartJS.register(
    Tooltip,
    ArcElement,
  );
  
const options ={
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {return(simplifyValue(context.parsed,2)+'%')}, }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
}

export function DoughnutChart(datasets, last, tot){

 
    const percent = datasets.map((dataset) => (dataset.data[last]*100.0/tot));
    const colors = datasets.map((dataset) => dataset.backgroundColor);

    const data ={
      id: 'doughnut',
      datasets:[{
            data: percent,
            backgroundColor: colors,
            borderColor: '#2b3035',
      }]
    }

    return(<Doughnut data={data}  options={options} className={styles.doughnut}/>);

}


