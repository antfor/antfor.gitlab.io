import { Doughnut } from 'react-chartjs-2';
import styles from './result.module.css';
import { simplifyValue } from '../utils/parse.mts';
import { Dataset } from '../model.mts';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    ChartOptions,
  } from 'chart.js';

  ChartJS.register(
    Tooltip,
    ArcElement,
  );
  
const options: ChartOptions<'doughnut'> ={
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {return(simplifyValue(context.parsed,2)+'%')}, }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
}

export function DoughnutChart(datasets:Dataset[], last:number, tot:number){

 
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


