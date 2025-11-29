import { simplifyValue } from './utils/parse.mjs';
import {ChartOptions, TooltipItem, ChartTypeRegistry} from 'chart.js';


type tooltipItem = TooltipItem<keyof ChartTypeRegistry>;

function sumDatapoints(dataPoints: tooltipItem[]): number{
    return dataPoints.reduce((acc, val) => acc + (val.raw as number), 0);
}

function percentOfTotal(value:number, total:number): string {
    if(total == 0){
        return '0';
    }
    return Math.round(value/total*100).toString();
}

function getLabel(context:tooltipItem):string{
            
    let label = context.dataset.label || '';
    if (label) {
        label += ': ';

        if (context.parsed.y && context.chart.tooltip) {
            const value = context.parsed.y;

            const dataPoints = context.chart.tooltip.dataPoints;
            const total = sumDatapoints(dataPoints);

            const Percent = ` (${percentOfTotal(value, total)}%)`;
            const Money = simplifyValue(value,0) + ' kr';

            label += Money + Percent;
            
        }else{
            label += "0 kr (0%)";
        }
    }
    
    return label;
}

export function getOptions(labelX="År"): ChartOptions<'bar'>{

    const options: ChartOptions<'bar'>= {
        plugins: {
        title: {
            display: false,
            text: 'ränta på ränta',
        },
        
        tooltip: {
            callbacks: {
                title: (ttItems) => labelX+`: ${ttItems[0].label}`,
                label: (ttItem) => getLabel(ttItem),
                afterBody: (ttItems) => (`Totalt: ${simplifyValue(sumDatapoints(ttItems),0)} kr (100%)`)
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

    return options;
}

