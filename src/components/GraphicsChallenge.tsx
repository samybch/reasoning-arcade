'use client';
import {useState} from 'react';
import type {Locale,Question} from '../engine/types';

export function GraphicsChallenge({question,locale,disabled,onAnswer}:{question:Question;locale:Locale;disabled:boolean;onAnswer:(v:string|null)=>void}){
  const graph=question.graph;
  const statements=question.content[locale].graphicStatements;
  const [answers,setAnswers]=useState<[''|string,''|string]>(['','']);
  if(!graph||!statements)return null;
  const max=Math.max(...graph.values,1);
  const change=(i:number,v:string)=>{
    if(disabled)return;
    const next:[string,string]=[...answers] as [string,string];
    next[i]=v;
    setAnswers(next);
    onAnswer(next.every(Boolean)?next.join('|'):null);
  };
  return <section className="graphics-challenge" aria-label={locale==='fr'?'Interprétation graphique':'Graphics interpretation'}>
    <figure className="graphics-figure">
      <figcaption>{graph.title[locale]} — {graph.units[locale]}</figcaption>
      <svg viewBox="0 0 620 285" role="img" aria-label={locale==='fr'?'Diagramme en barres avec les valeurs indiquées':'Bar chart with labeled numeric values'} className="graphics-svg">
        {[0,.25,.5,.75,1].map(f=><g key={f}>
          <line x1="62" x2="608" y1={240-190*f} y2={240-190*f} stroke="currentColor" opacity=".18"/>
          <text x="53" y={244-190*f} fontSize="12" textAnchor="end" fill="currentColor">{Math.round(max*f)}</text>
        </g>)}
        {graph.values.map((v,i)=>{
          const slot=540/graph.values.length,x=68+i*slot,barWidth=Math.min(72,slot*.58);
          const h=v/max*190;
          return <g key={graph.labels[i]}>
            <rect x={x+(slot-barWidth)/2} y={240-h} width={barWidth} height={h} rx="4" fill="currentColor" opacity=".65"/>
            <text x={x+slot/2} y={232-h} textAnchor="middle" fontSize="14" fill="currentColor">{v}</text>
            <text x={x+slot/2} y="265" textAnchor="middle" fontSize="13" fill="currentColor">{graph.labels[i]}</text>
          </g>;
        })}
      </svg>
      <table className="graphics-data"><caption>{locale==='fr'?'Valeurs exactes du graphique':'Exact chart values'}</caption>
        <thead><tr>{graph.labels.map(label=><th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody><tr>{graph.values.map((v,i)=><td key={graph.labels[i]}>{v}</td>)}</tr></tbody>
      </table>
    </figure>
    <fieldset className="graphic-questions" disabled={disabled}>
      <legend>{locale==='fr'?'Complète les deux affirmations':'Complete both statements'}</legend>
      {statements.map((statement,i)=><label key={i} className="graphic-statement" htmlFor={'graphic-'+question.id+'-'+i}>
        <span>{i+1}. {statement.prompt}</span>
        <select id={'graphic-'+question.id+'-'+i} value={answers[i]} onChange={event=>change(i,event.target.value)}>
          <option value="">{locale==='fr'?'Choisir…':'Select…'}</option>
          {statement.options.map((option,j)=><option key={j} value={String(j)}>{option}</option>)}
        </select>
      </label>)}
    </fieldset>
  </section>;
}
