import { Savings } from './utils/interest.mts';
import { breakdownSettings } from './InterestChart.tsx';


function totalInterest(data: Savings): Dataset[] {
  return ([{
    label: 'ränta',
    data: data.totalInterest,
    backgroundColor: 'rgb(230, 142, 65)',
    interest: true,
  }]);
}


function totalDeposit(data: Savings): Dataset[] {
  return ([{
    label: 'insata pengar',
    data: data.totalAcc,
    backgroundColor: 'rgb(60, 120, 201)',
    interest: false,
  }]);
}


function accBreakdown(data: Savings): Dataset[] {
  return ([{
    label: 'startbelopp',
    data: data.accPrincipel,
    backgroundColor: 'rgb(11, 83, 148)',
    interest: false,
  },
  {
    label: 'månadssparande',
    data: data.accMonthly,
    backgroundColor: 'rgb(109, 158, 235)',
    interest: false,
  }]);
}


function interestOnInterestBreakdown(data: Savings, iiB: boolean): Dataset[] {

  if (iiB) {
    return ([{
      label: 'RpR startbelopp',
      data: data.interestInterestPrincipal,
      backgroundColor: 'rgb(204, 65, 37)',
      interest: true,
      interestOnInterest: true,
    },
    {
      label: 'RpR månadssparande',
      data: data.interestInterestMonthly,
      backgroundColor: 'rgb(133, 32, 12)',
      interest: true,
      interestOnInterest: true,
    }]);
  }

  return ([{
    label: 'ränta på ränta',
    data: data.interestInterest,
    backgroundColor: 'rgb(204, 65, 37)',
    interest: true,
    interestOnInterest: true,
  }]);
}


function interestBreakdown(data: Savings, iiB: boolean): Dataset[] {
  const interest: Dataset[] = [{
    label: 'ränta på startbelopp',
    data: data.interestPrincipel,
    backgroundColor: 'rgb(255, 217, 102)',
    interest: true,
    interestOnInterest: false,
  },
  {
    label: 'ränta på månadssparande',
    data: data.interestMonthly,
    backgroundColor: 'rgb(230, 145, 56)',
    interest: true,
    interestOnInterest: false,
  }]

  const interestOnInterest = interestOnInterestBreakdown(data, iiB);
  return (interest.concat(interestOnInterest));
}


function removeEmpty(data: Dataset[]) {
  return data.filter((v) => v.data.reduce((acc, val) => acc || val != 0, false));
}


function getDatasets(data: Savings, bs: breakdownSettings): Dataset[] {
  const iiB = bs.interestOnInterestBreakdown;
  const interest = bs.interestBreakdown ? interestBreakdown(data, iiB) : totalInterest(data);
  const acc = bs.accBreakdown ? accBreakdown(data) : totalDeposit(data);

  return removeEmpty(acc.concat(interest));
}


function getTime(N: number) {
  return Array.from({ length: N + 1 }, (_, i) => i);
}

export type Dataset = {
  label: string,
  data: number[],
  backgroundColor: string,
  interest: boolean,
  interestOnInterest?: boolean,
};
export type Model = {
  labels: number[],
  datasets: Dataset[],
};
export function getModel(data: Savings, time: number, bs: breakdownSettings): Model {
  return {
    labels: getTime(time),
    datasets: getDatasets(data, bs),
  };
}