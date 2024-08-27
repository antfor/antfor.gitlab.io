import { parseFloatSafe } from './parse.js';
  
  function removeEmpty(data){
    return data.filter((v) => v.data.reduce((acc,val) => acc || val != 0, false));
  }
  
  function totalIntrest(data){
    return([{
      label: 'ränta',
      data: data.totalIntrest,
      backgroundColor: 'rgb(230, 142, 65)',
      intrest: true,
    }]);
  }
  
  function totalDeposit(data){
    return([{
      label: 'insata pengar',
      data: data.totalAcc,
      backgroundColor: 'rgb(60, 120, 201)',
      intrest: false,
    }]);
  }
  
  function accBreakdown(data){
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
  function intrestBreakdown(data){
    return([{
      label: 'ränta på startbelopp',
      data: data.intrestPrincipel,
      backgroundColor: 'rgb(255, 217, 102)',
      intrest: true,
    },
    {
      label: 'ränta på månadssparande',
      data: data.intrestMonthly,
      backgroundColor: 'rgb(230, 145, 56)',
      intrest: true,
    },{
      label: 'ränta på ränta',
      data: data.intrestIntrest,
      backgroundColor: 'rgb(204, 65, 37)',
      intrest: true,
    }]);
  }
  
  function getDatasets(data, settings){
  
    let intrest = settings.intrestBreakdown ? intrestBreakdown(data): totalIntrest(data);
    let acc = settings.accBreakdown ? accBreakdown(data): totalDeposit(data);
    
    return removeEmpty(acc.concat(intrest));
  
  }
  
  function getTime(N){
    N = parseFloatSafe(N);
    return new Array(N+1).fill().map((_,i) => i );
  
  }

  export function getModel(data, settings){
    return {
      labels: getTime(settings.time),
      datasets: getDatasets(data, settings),
    };
  }