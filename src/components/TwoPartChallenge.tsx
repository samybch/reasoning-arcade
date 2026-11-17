'use client';
import {useState} from 'react';
import type {Locale,Question} from '../engine/types';

// One answer in each of two columns; both must be correct (no partial credit).
// Radio columns reproduce the interaction pattern without copying official questions.
export function TwoPartChallenge({question,locale,disabled,onAnswer}:{question:Question;locale:Locale;disabled:boolean;onAnswer:(v:string|null)=>void}){
  const [answers,setAnswers]=useState<[string|null,string|null]>([null,null]);
  const choices=question.content[locale].choices??[];
  const headers=question.content[locale].twoPartHeaders;
  if(!headers||headers.length!==2||choices.length!==5)return null;
  const select=(column:0|1,index:number)=>{
    if(disabled)return;
    const next:[string|null,string|null]=[...answers];
    next[column]=String(index);
    setAnswers(next);
    onAnswer(next.every(x=>x!==null)?next.join('|'):null);
  };
  return <fieldset className="two-part-challenge" disabled={disabled}>
    <legend>{locale==='fr'?'Sélectionne une réponse dans chaque colonne':'Select one answer in each column'}</legend>
    <p className="note">{locale==='fr'?'Les deux choix doivent être corrects pour réussir la question.':'Both selections must be correct to earn credit.'}</p>
    <div className="table-scroll" tabIndex={0} role="region" aria-label={locale==='fr'?'Matrice à deux réponses':'Two-part answer matrix'}>
      <table className="data-table two-part-matrix">
        <thead><tr><th scope="col">{locale==='fr'?'Proposition':'Option'}</th>
          {headers.map((h,i)=><th key={i} scope="col">{h}</th>)}
        </tr></thead>
        <tbody>{choices.map((choice,row)=><tr key={row}><th scope="row">{String.fromCharCode(65+row)}. {choice}</th>
          {([0,1] as const).map(column=><td key={column}>
            <input type="radio" name={'two-part-'+question.id+'-'+column}
              aria-label={headers[column]+': '+choice}
              checked={answers[column]===String(row)}
              onChange={()=>select(column,row)}/>
          </td>)}
        </tr>)}</tbody>
      </table>
    </div>
  </fieldset>;
}
