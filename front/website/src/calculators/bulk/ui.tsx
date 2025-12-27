
import { useState } from 'react';
import {hallSim} from './bulk_hall.mjs';
import {Chart} from './chart';
import './ui.css';
import { getCalories, getRFL } from './rlf.mts';


export default function Ui(){

    const [surplus, setSurplus] = useState<number | "">(200);
    const [weight, setWeight] = useState<number | "">(75);

    const [bf, setBf] = useState<number | "">(0.15);
    const [kcal, setKcal] = useState<number | "">("");

    const [weeks, setWeeks] = useState<number | "">(0);
    const [months, setMonths] = useState<number | "">(0);
    const [years, setYears] = useState<number | "">(1);

    const [carbs, setCarbs] = useState<number | "">(0);

    const kcals = [2000,2250,2500,2750,3000];
    
    if(kcal != ""){
        kcals.push(kcal);
    }

    const hb_data = [];

   
    for(const c of kcals){

        if(validateH(surplus,c,weight,bf)){
            hb_data.push(hallSim(Number(surplus),Number(weight),Number(bf),c));
        }   
    }

    const cmp = (day:number, less:boolean) => cmpDay(day, weeks, months, years, less);

    let hb_chart_data = hb_data.map((dataset) => dataset.map((value) => {return{ x:value.day, y:value.weight, tdee:value.tdee}}));
    hb_chart_data = hb_chart_data.map((dataset)=> dataset.filter((data)=> 
        (data.x%7==0 && cmp(data.x,true)) || cmp(data.x,false)));

    const hb_weight_data = hb_chart_data.map((value) => value[value.length-1].y);
    const labels = hb_chart_data.map((value) => simplifyValue(value[0].tdee,0)+"kalc");
    const tdee = hb_chart_data.map((value) => value[0].tdee);
    const days = hb_chart_data.map((m) => m.reduceRight((a,c) => (c.y == m[m.length-1].y) ? c : a));

    return (
    <div className="appContainer">
      <header className="appHeader">
        <h1>Bulking/Cutting Calculator</h1>
        <div className="subtitle">Estimate fat gain or loss when starting at maintenance while training to maintain lean mass</div>                          
      </header>

      <section className="section">
        <form className="controls" onSubmit={(e)=>{e.preventDefault()}}>
          {input("Surplus",surplus,setSurplus,-4000,4000,50)}
          {input("Weight",weight,setWeight,30,150,5)}
          {input("Bodyfat%",bf,setBf,0.01,0.59,0.01)}
          {input("Maintenance Calories",kcal,setKcal,0,7000,100)}
        </form>
      </section>

      <section className="section">
        <h2>Adaptive Weight Change Projection</h2>
        <div className="controls" style={{marginBottom:12}}>
          {input("Weeks",weeks,setWeeks,0,7*52*10,1)}
          {input("Months",months,setMonths,0,12*10,1)}
          {input("Years",years,setYears,0,10,1)}
        </div>
        {Table(Number(weight), Number(bf), hb_weight_data, days, labels)}
        <div className="chartWrap">
          {Chart(hb_chart_data, labels)}
        </div>
      </section>

      <div className="controls" style={{alignItems: "flex-start" }}>
      <section className="section">
        <h2>RFL</h2>
          <form className="controls" onSubmit={(e)=>{e.preventDefault()}}>
          {input("extra carbs:",carbs,setCarbs,0,1000,10)}
        </form>
        <div className="controls">
          {rfl(Number(weight), Number(bf), Number(carbs))}
        </div>
      </section>

      <section className="section">
        {TableRfl(Number(weight), Number(bf),tdee, labels, Number(carbs))}
      </section>
      </div>

    </div>
  );

}

function rfl(weight:number, bf:number, carbs=0, male=true){
  const cat = getRFL(bf, male);
  const kcal = getCalories(weight, bf, cat, carbs);
  const s =(s:number) => simplifyValue(s,0);
  return(
    <>
    <div>
      <p><b>Calorise: </b>{s(kcal[0])}-{s(kcal[1])} kcal/day</p>
      <p>&emsp;<b>protine:</b> {s(cat.protein[0]*weight)}-{s(cat.protein[1]*weight)}g/day</p>
      <p>&emsp;<b>fat:</b> ~{cat.fat}g/day</p>
      <p>&emsp;<b>carbs:</b> ~{carbs}g/day</p>
      <p><b>Diet length:</b> {cat.length[0]}-{cat.length[1]} {cat.Period}</p>
    </div>
    </>
  );
}

function TableRfl(weight:number, bf:number, tdee:number[], labels:string[], carbs=0, male=true){
  const cat = getRFL(bf, male);
  const kcal = getCalories(weight, bf, cat, carbs);
    return(
      <div className="tableWrapper">
        <table className="gridTable"> 
            <thead> 
                <tr> 
                    <th>Maintenance Calories:</th>
                    {labels.map((label,i) => <th key={i}>{label}</th> )}
                </tr> 
            </thead>
            <tbody>
                <tr>
                    <td>Deficit(high):</td>
                    {tdee.map((d,i)=><td key={i}>{" "+simplifyValue(kcal[1]-d,0)+"kcal "}</td>)}
                </tr>
                <tr>
                    <td>Deficit(low):</td>
                    {tdee.map((d,i)=><td key={i}>{" "+simplifyValue(kcal[0]-d,0)+"kcal "}</td>)}
                </tr>
            </tbody>
        </table> 
      </div>
    );
}

function Table(weight:number, bf:number, data:number[], days:{x:number}[], labels:string[]){
    //TODO add days to reach gaol
    const lbm = weight * (1- bf);

    return(
      <div className="tableWrapper">
        <table className="gridTable"> 
            <thead> 
                <tr> 
                    <th>Maintenance Calories:</th>
                    {labels.map((label,i) => <th key={i}>{label}</th> )}
                </tr> 
            </thead>
            <tbody>
                <tr>
                    <td>End Weight:</td>
                    {data.map((d,i)=><td key={i}>{" "+simplifyValue(d,2)+"kg ("+simplifyValue(d-weight,2)+"kg) "}</td>)}
                </tr>
                <tr>
                    <td>Bodyfat%:</td>
                    {data.map((d,i)=><td key={i}>{" "+simplifyValue((1-lbm/d) *100,1)+"% "}</td>)}
                </tr>
                <tr>
                    <td>Days to Minimum:</td>
                    {days.map((d,i)=><td key={i}>{`${d.x.toString()} days`}</td>)}
                </tr>
            </tbody>
        </table> 
      </div>
    );
}

function input(label:string, value:number|"", setValue:(n:number|"")=>void, min:number, max:number, step:number){ 
    return ( 
    <div className="control" key={label}> 
        <label>{label}</label> 
        <input type="number" value={value} min={min} max={max} step={step} 
               onChange={(e) => { const val = e.target.value; setValue(val === "" ? "" : Number(val)); }} /> 
    </div> 
    ); 
}

function cmpDay(day:number, weeks:(number|""), months:(number|""), years:(number|""), LessNotEq = true) {
        
  if(weeks == "" && months == "" && years == ""){
      return LessNotEq;
  }

  let days = months == "" ? 0:months*30;
  days += weeks == "" ? 0:weeks*7;
  days += years == "" ? 0:years*365;

  if(LessNotEq){
    return day <= days;
  }
  return day == days;
}

function validateH(
  surplus: number | "",
  kcal: number | "",
  weight: number | "",
  bf: number | ""
): boolean {
  const s = Number(surplus);
  const c = Number(kcal);
  const w = Number(weight);
  const bodyfat = Number(bf);

  if (!Number.isFinite(s) || s < -4000 || s > 4000) return false;
  if (!Number.isFinite(c) || c < 0.0 || c > 7000) return false;
  if (!Number.isFinite(w) || w < 30 || w > 150) return false;

  if (!Number.isFinite(bodyfat) || bodyfat <= 0 || bodyfat >= 0.6) return false;

  return true;
}

function round(n: number, d = 0) {
    const pow = 10 ** d;
    return Math.round(n * pow) / pow;
}

function simplifyValue(value: number, decimals: number) {
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
    }).format(round(value, decimals) + 0);
}

