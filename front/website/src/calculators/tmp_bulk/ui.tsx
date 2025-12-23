
import { useState } from 'react';
import {mifflin_bulk_weight} from './bulk_mifflin.mjs';
import {hallSim} from './bulk_hall.mjs';
import {Chart} from './chart';






export default function Ui(){

    const [surplus, setSurplus] = useState<number | "">(200);
    const [weight, setWeight] = useState<number | "">(75);
    const [height, setHeight] = useState<number | "">(182);
    const [age, setAge] = useState<number | "">(27);

    const [bf, setBf] = useState<number | "">(0.15);
    const [f, setF] = useState<number | "">("");

    const [weeks, setWeeks] = useState<number | "">(0);
    const [months, setMonths] = useState<number | "">(12);
    const [years, setYears] = useState<number | "">(0);

    //nhs 1.4-2.5, default 1.6
    const fs = [1,1.2,1.4,1.6,1.9];
    
    if(f != ""){
        fs.push(f);
    }

    const mb_data = [];
    const hb_data = [];

   
    for(const f of fs){
        if(validateM(surplus,f,weight,height,age)){
            mb_data.push(mifflin_bulk_weight(Number(surplus),f,Number(weight),Number(height),Number(age)));
        }
        if(validateH(surplus,f,weight,bf)){
            hb_data.push(hallSim(Number(surplus),Number(weight),Number(bf),f,Number(surplus) > 0));
        }   
    }

    const isLess = (day:number) => {
        
        if(weeks == "" && months == "" && years == ""){
            return true;
        }

        let days = months == "" ? 0:months*30;
        days += weeks == "" ? 0:weeks*7;
        days += years == "" ? 0:years*365;

        return day <= days;
    }

    const isEq = (day:number) => {
        
        if(weeks == "" && months == "" && years == ""){
            return false;
        }

        let days = months == "" ? 0:months*30;
        days += weeks == "" ? 0:weeks*7;
        days += years == "" ? 0:years*365;

        return day == days;
    }

    let hb_chart_data = hb_data.map((dataset) => dataset.map((value) => {return{ x:value.day, y:value.weight }}));
    hb_chart_data = hb_chart_data.map((dataset)=> dataset.filter((data)=> 
        (data.x%7==0 && isLess(data.x)) || isEq(data.x)));

    const hb_weight_data = hb_chart_data.map((value) => value[value.length-1].y);


    return(
    <>
    <h1>Bulking calculator</h1>

    <form style={{ display: "flex", gap: "1rem" }}> 
        {input("Surplus",surplus,setSurplus,-4000,4000,50)}
        {input("Weight",weight,setWeight,30,150,5)}
        {input("Height",height,setHeight,120,230,2.5)}
        {input("Age",age,setAge,14,90,1)}
        {input("Bodyfat%",bf,setBf,0.01,0.59,0.01)}
        {input("Activity level (1-2.5)",f,setF,1,2.5,0.1)}
    </form>

    <h2>Mifflin-St Jeor equation</h2>
    {Table(Number(weight),mb_data,fs)}
    
    <h2>Hall simulation</h2>
    {input("Weeks",weeks,setWeeks,0,7*52*10,1)}
    {input("Months",months,setMonths,0,12*10,1)}
    {input("Years",years,setYears,0,10,1)}
    {Table(Number(weight),hb_weight_data,fs)}

    {Chart(hb_chart_data, fs)}

    </>
    );
}

function Table(weight:number, data:number[], fs:number[]){
    return(
        <table className="gridTable"> 
            <thead> 
                <tr> 
                    {fs.map((f,i) => <th key={i}>{f}</th> )}
                </tr> 
            </thead>
            <tbody>
                <tr>
                    {data.map((d,i)=><td key={i}>{" "+simplifyValue(d,2)+"kg ("+simplifyValue(d-weight,2)+"kg) "}</td>)}
                </tr>
            </tbody>
        </table> 
    );
}

function input(label:string, value:number|"", setValue:(n:number|"")=>void,  min:number, max:number, step:number){
    
    return(  
        <label>{label}:
            <input type="number" value={value} min={min} max={max} step={step} onChange={(e) => { const val = e.target.value; setValue(val === "" ? "" : Number(val)); }}/>
        </label>
        
    );
}

function validateM(
  surplus: number | "",
  f: number | "",
  weight: number | "",
  height: number | "",
  age: number | ""
): boolean {
  // Convert empty strings to NaN for easy checking
  const s = Number(surplus);
  const af = Number(f);
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  if (!Number.isFinite(s) || s < -4000 || s > 4000) return false;
  if (!Number.isFinite(af) || af < 1.0 || af > 2.5) return false;
  if (!Number.isFinite(w) || w < 30 || w > 150) return false;
  if (!Number.isFinite(h) || h < 120 || h > 230) return false;
  if (!Number.isFinite(a) || a < 14 || a > 90) return false;

  return true;
}

function validateH(
  surplus: number | "",
  f: number | "",
  weight: number | "",
  bf: number | ""   // body‑fat fraction (0.20 = 20%)
): boolean {
  const s = Number(surplus);
  const af = Number(f);
  const w = Number(weight);
  const bodyfat = Number(bf);

  if (!Number.isFinite(s) || s < -4000 || s > 4000) return false;
  if (!Number.isFinite(af) || af < 1.0 || af > 2.5) return false;
  if (!Number.isFinite(w) || w < 30 || w > 150) return false;

  // Body‑fat must be a fraction, not percent
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
    }).format(round(value, decimals) + 0); // +0 to remove -0
}

