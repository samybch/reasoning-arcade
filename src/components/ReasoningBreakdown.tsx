import type {Locale,QuestionText} from '../engine/types';

export function ReasoningBreakdown({text,locale}:{text:QuestionText;locale:Locale}){
  if(!text.reviewSteps)return null;
  const fr=locale==='fr';
  const headings=fr?['Information (1)','Information (2)','Verdict et justification']:['Statement (1)','Statement (2)','Verdict and justification'];
  return <section className="reasoning-breakdown" aria-label={fr?'Correction étape par étape':'Step-by-step explanation'}>
    <h3>{fr?'Méthode de résolution':'Step-by-step reasoning'}</h3>
    <ol>{text.reviewSteps.map((step,i)=><li key={i}><strong>{headings[i]}</strong><p>{step}</p></li>)}</ol>
  </section>;
}
