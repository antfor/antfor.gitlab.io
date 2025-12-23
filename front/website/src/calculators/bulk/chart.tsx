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
  ChartOptions,
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

const options:ChartOptions<'line'> = {
  responsive: true,
  scales: { 
    x: { 
    type: "linear", // important for {x,y} numeric points 
    position: "bottom", 
    title: { display: true, text: "days" }, }, 
    y: { 
      title: { display: true, text: "weight(kg)" }, 
    }, 
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Hall Simulation Chart',
    },
  },
};


function data(dataSets:{x: number;y: number;}[][], labels:number[]):ChartData<'line'>{
    const colors = ["#3F51B5","#E91E63","#FF9800","#4CAF50","#00BCD4","#9C27B0"];
    const fills = [ "rgba(63,81,181,0.20)", "rgba(233,30,99,0.20)", "rgba(255,152,0,0.20)", "rgba(76,175,80,0.20)", "rgba(0,188,212,0.20)", "rgba(156,39,176,0.20)" ];
    return {
        datasets: dataSets.map((dataSet,i)=> { return(
            {
            label: "Activity:" + labels[i].toString(),
            data: dataSet,
            borderColor:colors[i%colors.length],
            backgroundColor:fills[i%fills.length],
            })})
        ,
        };
}

export function Chart(dataSets:{x: number;y: number;}[][], labels:number[]) {
  return <Line options={options} data={data(dataSets, labels)} />;
}