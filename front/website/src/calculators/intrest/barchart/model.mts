import { Savings } from './utils/intrest.mts';
import { breakdownSettings } from './IntrestChart.tsx';


function totalIntrest(data:Savings):Dataset[]{
  return([{
    label: 'ränta',
    data: data.totalIntrest,
    backgroundColor: 'rgb(230, 142, 65)',
    intrest: true,
  }]);
}
  

function totalDeposit(data:Savings):Dataset[]{
  return([{
    label: 'insata pengar',
    data: data.totalAcc,
    backgroundColor: 'rgb(60, 120, 201)',
    intrest: false,
  }]);
}
  

function accBreakdown(data:Savings):Dataset[]{
  return([{
    label: 'startbelopp',
    data: data.accPrincipel,
    backgroundColor: 'rgb(11, 83, 148)',
    intrest: false,
  },
  {
    label: 'månadssparande',
    data: data.accMonthly,
    backgroundColor: 'rgb(109, 158, 235)',
    intrest: false,
  }]);
}


function intrestOnIntrestBreakdown(data:Savings, iiB:boolean):Dataset[]{
  
  if(iiB){
    return([{
        label: 'RpR startbelopp',
        data: data.intrestIntrestPrincipal,
        backgroundColor: 'rgb(204, 65, 37)',
        intrest: true,
        intrestOnIntrest: true,
      },
      {
        label: 'RpR månadssparande',
        data: data.intrestIntrestMonthly,
        backgroundColor: 'rgb(133, 32, 12)',
        intrest: true,
        intrestOnIntrest: true,
      }]);
  }

  return([{
    label: 'ränta på ränta',
    data: data.intrestIntrest,
    backgroundColor: 'rgb(204, 65, 37)',
    intrest: true,
    intrestOnIntrest: true,
  }]);
}


function intrestBreakdown(data:Savings, iiB:boolean):Dataset[]{
  const intrest:Dataset[] =[{
    label: 'ränta på startbelopp',
    data: data.intrestPrincipel,
    backgroundColor: 'rgb(255, 217, 102)',
    intrest: true,
    intrestOnIntrest: false,
  },
  {
    label: 'ränta på månadssparande',
    data: data.intrestMonthly,
    backgroundColor: 'rgb(230, 145, 56)',
    intrest: true,
    intrestOnIntrest: false,
  }]

  const intrestOnIntrest = intrestOnIntrestBreakdown(data, iiB);
  return(intrest.concat(intrestOnIntrest));
}


function removeEmpty(data:Dataset[]){
  return data.filter((v) => v.data.reduce((acc,val) => acc || val != 0, false));
}

  
function getDatasets(data:Savings, bs:breakdownSettings):Dataset[]{
  const iiB = bs.intrestOnIntrestBreakdown;
  const intrest = bs.intrestBreakdown ? intrestBreakdown(data, iiB): totalIntrest(data);
  const acc = bs.accBreakdown ? accBreakdown(data): totalDeposit(data);
  
  return removeEmpty(acc.concat(intrest));
}


function getTime(N:number){
  return Array.from({ length: N + 1 }, (_, i) => i);
}

export type Dataset= {
  label: string,
  data: number[],
  backgroundColor: string,
  intrest: boolean,
  intrestOnIntrest?: boolean,
};
export type Model = {
  labels: number[],
  datasets: Dataset[],
};
export function getModel(data:Savings, time:number, bs:breakdownSettings):Model{
  return {
    labels: getTime(time),
    datasets: getDatasets(data, bs),
  };
}