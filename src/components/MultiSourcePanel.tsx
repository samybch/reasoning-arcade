'use client';
import {useState} from 'react';
import type {Locale,Question} from '../engine/types';

export function MultiSourcePanel({question,locale}:{question:Question;locale:Locale}){
  const [active,setActive]=useState(0);
  const sources=question.content[locale].sources??[];
  if(sources.length<2)return null;
  return <section className="multi-source" aria-label={locale==='fr'?'Dossier de sources':'Source dossier'}>
    <p className="note">{locale==='fr'?'Consulte les différentes sources avant de répondre.':'Review the different sources before answering.'}</p>
    <div className="source-tabs" role="tablist" aria-label={locale==='fr'?'Sources disponibles':'Available sources'}>
      {sources.map((source,i)=><button key={i} type="button" role="tab" id={'source-tab-'+i} aria-controls={'source-panel-'+i}
        aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)}
        onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
          event.preventDefault();
          const next=event.key==='Home'?0:event.key==='End'?sources.length-1:
            (active+(event.key==='ArrowRight'?1:-1)+sources.length)%sources.length;
          setActive(next);
          const tabs=event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
          tabs?.[next]?.focus();
        }}>{source.title}</button>)}
    </div>
    {sources.map((source,i)=><div key={i} role="tabpanel" id={'source-panel-'+i}
      aria-labelledby={'source-tab-'+i} hidden={active!==i} tabIndex={0} className="source-panel">
      <p>{source.body}</p>
    </div>)}
  </section>;
}
