'use client';
import {useState} from 'react';
import type {Locale,Question} from '../engine/types';

type Column={key:string;fr:string;en:string;kind:'number'|'text'};
export function TableAnalysisChallenge({question,locale,disabled,onAnswer}:{question:Question;locale:Locale;disabled:boolean;onAnswer:(value:string|null)=>void}){
  const data=question.table;
  const statements=question.content[locale].tableStatements;
  const [sort,setSort]=useState<{key:string;ascending:boolean}|null>(null);
  const [answers,setAnswers]=useState<Array<'Y'|'N'|null>>([null,null,null]);
  if(!data||!statements)return null;
  const columns=data.columns as Column[];
  const rows=[...data.rows].sort((a,b)=>{
    if(!sort)return 0;
    const col=columns.find(c=>c.key===sort.key);
    const index=columns.findIndex(c=>c.key===sort.key);
    const left=a[index],right=b[index];
    const comparison=col?.kind==='number'?Number(left)-Number(right):
      left.localeCompare(right,locale,{numeric:true,sensitivity:'base'});
    return comparison*(sort.ascending?1:-1);
  });
  const change=(index:number,value:'Y'|'N')=>{
    if(disabled)return;
    const updated=[...answers];updated[index]=value;setAnswers(updated);
    onAnswer(updated.every(x=>x!==null)?updated.join(''):null);
  };
  return <div className="table-analysis">
    <p className="note">{locale==='fr'?'Trie le tableau en sélectionnant un en-tête. Réponds aux trois affirmations.':'Select a column heading to sort the table. Answer all three statements.'}</p>
    <div className="table-scroll" tabIndex={0} role="region" aria-label={locale==='fr'?'Tableau de données triable':'Sortable data table'}>
      <table className="data-table">
        <thead><tr>{columns.map(c=><th key={c.key} scope="col" aria-sort={sort?.key===c.key?(sort.ascending?'ascending':'descending'):'none'}>
          <button type="button" onClick={()=>setSort(previous=>previous?.key===c.key?{key:c.key,ascending:!previous.ascending}:{key:c.key,ascending:true})}>
            {c[locale]} <span aria-hidden="true">{sort?.key===c.key?(sort.ascending?'↑':'↓'):'↕'}</span>
          </button>
        </th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={columns[j].key}>{v}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <fieldset className="table-claims" disabled={disabled}>
      <legend>{locale==='fr'?'Affirmations fondées sur le tableau':'Statements based on the table'}</legend>
      {statements.map((statement,i)=><div className="table-claim" key={i}>
        <p>{i+1}. {statement}</p>
        <div className="table-radios">{(['Y','N'] as const).map(value=><label key={value}>
          <input type="radio" name={'table-claim-'+question.id+'-'+i} checked={answers[i]===value} onChange={()=>change(i,value)}/>
          {value==='Y'?(locale==='fr'?'Oui':'Yes'):(locale==='fr'?'Non':'No')}
        </label>)}</div>
      </div>)}
    </fieldset>
  </div>;
}
