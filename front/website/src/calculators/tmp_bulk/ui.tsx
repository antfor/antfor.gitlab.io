
import { useState } from 'react';
import {mifflin_bulk_weight} from './bulk_mifflin.mjs';
import {katch_bulk_weight} from './bulk_katch.mjs';


//nhs 1.4-2.5, default 1.6
const fs = [1,1.2,1.4,1.6,1.9];
const bfs = [0.1,0.15,0.2,0.25];



export default function Ui(){

    const [surplus, setSurplus] = useState<number | "">(200);
    const [weight, setWeight] = useState<number | "">(75);
    const [height, setHeight] = useState<number | "">(182);
    const [age, setAge] = useState<number | "">(27);


    const mb_data = [];
    const kb_data = [];

    
    for(const bf of bfs){
        const tmp = [];
        for(const f of fs){
            if(validateK(surplus,f,weight,bf))    
                tmp.push(katch_bulk_weight(Number(surplus),Number(weight),bf,f));
        }
        kb_data.push(tmp);
    }

   
    for(const f of fs){
         if(validateM(surplus,f,weight,height,age)){
            mb_data.push(mifflin_bulk_weight(Number(surplus),f,Number(weight),Number(height),Number(    age)));
         }
    }

    return(
    <>
    <h1>Bulking calculator</h1>

    <form style={{ display: "flex", gap: "1rem" }}> 
        {input("Surplus",surplus,setSurplus,-2000,2000,50)}
        {input("Weight",weight,setWeight,30,150,5)}
        {input("height",height,setHeight,120,230,2.5)}
        {input("age",age,setAge,14,90,1)}
    </form>
    
    <h2>Katch-McArdle equation</h2>
    {TableK(Number(weight),kb_data)}

    <h2>Mifflin-St Jeor equation</h2>
    {TableM(Number(weight),mb_data)}

    </>
    );
}

function TableM(weight:number, data:number[]){
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

function TableK(weight:number, data:number[][]){
    return(
        <table className="gridTable"> 
            <thead> 
                <tr> 
                    <th>bf%</th>
                    {fs.map((f,i) => <th key={i}>{f}</th> )}
                </tr> 
            </thead>
            <tbody>
                {data.map((row,i) =>
                    <tr key={i}>
                        <td>{bfs[i]}</td>
                        {row.map((d,i)=><td key={i}>{" "+simplifyValue(d,2)+"kg ("+simplifyValue(d-weight,2)+"kg) "}</td>)}
                    </tr>)}
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

  if (!Number.isFinite(s) || s < -2000 || s > 2000) return false;
  if (!Number.isFinite(af) || af < 1.0 || af > 2.5) return false;
  if (!Number.isFinite(w) || w < 30 || w > 150) return false;
  if (!Number.isFinite(h) || h < 120 || h > 230) return false;
  if (!Number.isFinite(a) || a < 14 || a > 90) return false;

  return true;
}

function validateK(
  surplus: number | "",
  f: number | "",
  weight: number | "",
  bf: number | ""   // body‑fat fraction (0.20 = 20%)
): boolean {
  const s = Number(surplus);
  const af = Number(f);
  const w = Number(weight);
  const bodyfat = Number(bf);

  if (!Number.isFinite(s) || s < -2000 || s > 2000) return false;
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

