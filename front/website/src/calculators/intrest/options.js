import { round } from 'mathjs'
import { simplifyValue } from './parse.js';

function sumDatapoints(dataPoints){
    return dataPoints.reduce((acc, val) => acc + val.raw, 0);
}

function percentOfTotal(value, total){
    if(total == 0){
        return 0;
    }
    return round(value/total*100, 0);
}

function getLabel(context){
            
    var label = context.dataset.label || '';
    if (label) {
        label += ': ';

        if (context.parsed.y !== null) {
            let value = context.parsed.y;

            label += simplifyValue(value,0) + ' kr';

            const dataPoints = context.chart.tooltip.dataPoints;
            const total = sumDatapoints(dataPoints);

            label += ` (${round(percentOfTotal(value, total), 0)}%)`;
            
        }else{
            label += "0 kr (0%)";
        }
    }
    
    return label;
}

export function getOptions(labelX="År"){

    let options = {
        plugins: {
        title: {
            display: false,
            text: 'ränta på ränta',
        },
        
        tooltip: {
            callbacks: {
                title: (ttItem) => labelX+`: ${ttItem[0].label}`,
                label: getLabel,
                afterBody: (ttItem) => (`Totalt: ${simplifyValue(sumDatapoints(ttItem),0)} kr (100%)`)
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

