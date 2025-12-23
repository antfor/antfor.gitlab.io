import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};


function data(x:number[], y:number[][], labels:number[]):ChartData<'line'>{
    return {
        labels: x,
        datasets: y.map((row,i)=> { return(
            {
            label: labels[i].toString() + '%',
            data: row,
            })})
        ,
        };
}

export function Chart(x:number[], y:number[][], labels:number[]) {
  return <Line options={options} data={data(x,y,labels)} />;
}