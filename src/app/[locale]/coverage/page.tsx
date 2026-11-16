import {notFound} from 'next/navigation';
import {ArcadeShell} from '../../../components/ArcadeShell';
import {getQuestions} from '../../../content/catalog';
import type {Locale,Exam,Game} from '../../../engine/types';

export function generateStaticParams(){return [{locale:'fr'},{locale:'en'}]}

export default async function CoveragePage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  const fr=locale==='fr';
  const questions=getQuestions();
  const count=(exam:Exam,game:Game)=>questions.filter(q=>q.exam===exam&&q.game===game).length;
  const warmups=questions.filter(q=>q.alignment==='warmup').length;
  type CoverageRow={fr:string;en:string;n:number;detail?:string};
  const tage:CoverageRow[]=[
    {fr:'Compréhension de textes',en:'Reading comprehension',n:count('tage','reading-lab')},
    {fr:'Calcul',en:'Mathematical problem solving',n:count('tage','quant-lab')},
    {fr:'Raisonnement / Argumentation',en:'Reasoning / Argumentation',n:count('tage','argument-lab')},
    {fr:'Conditions minimales',en:'Data sufficiency',n:count('tage','enough-info')},
    {fr:'Expression',en:'Written expression',n:0},
    {fr:'Logique',en:'Categorical logic',n:count('tage','code-logic'),detail:fr?`dont ${warmups} échauffements`:`${warmups} warm-ups included`}
  ];
  const gmat:CoverageRow[]=[
    {fr:'Quantitative Reasoning — Problem Solving',en:'Quantitative Reasoning — Problem Solving',n:count('gmat','quant-lab')},
    {fr:'Verbal — Reading Comprehension',en:'Verbal — Reading Comprehension',n:count('gmat','reading-lab')},
    {fr:'Verbal — Critical Reasoning',en:'Verbal — Critical Reasoning',n:count('gmat','argument-lab')},
    {fr:'Data Insights — Data Sufficiency',en:'Data Insights — Data Sufficiency',n:count('gmat','enough-info')},
    {fr:'Data Insights — Multi-Source Reasoning',en:'Data Insights — Multi-Source Reasoning',n:0},
    {fr:'Data Insights — Table Analysis',en:'Data Insights — Table Analysis',n:0},
    {fr:'Data Insights — Graphics Interpretation',en:'Data Insights — Graphics Interpretation',n:0},
    {fr:'Data Insights — Two-Part Analysis',en:'Data Insights — Two-Part Analysis',n:0}
  ];
  return <ArcadeShell locale={locale as Locale}>
    <header className="coverage-header">
      <p className="eyebrow">{fr?'TRANSPARENCE PÉDAGOGIQUE':'PEDAGOGICAL TRANSPARENCY'}</p>
      <h1>{fr?'Couverture actuelle des examens':'Current exam coverage'}</h1>
      <p><strong>{questions.length} {fr?'exercices pilotes':'pilot exercises'}</strong>. {fr?'Ce prototype cible certaines compétences, mais ne prépare pas encore à toutes les sections des examens.':'This prototype trains selected skills only; it does not yet cover all exam sections.'}</p>
    </header>
    <div className="coverage-grid">
      {([{name:'TAGE MAGE',rows:tage},{name:'GMAT',rows:gmat}]).map(section=><section className="coverage-card" key={section.name}>
        <h2>{section.name}</h2>
        <p>{fr?'Nombre d’exercices originaux par compétence':'Original exercises by skill area'}</p>
        <dl className="coverage-list">{section.rows.map(row=><div className="coverage-row" key={row.en}>
          <dt>{row[locale as Locale]}{row.detail?<small style={{display:'block',color:'var(--muted)'}}>{row.detail}</small>:null}</dt>
          <dd className={row.n>0?'covered':'absent'}>{row.n>0?`${row.n} ${fr?'pilotes':'pilot'}`:(fr?'Non couvert':'Not covered')}</dd>
        </div>)}</dl>
      </section>)}
    </div>
    <section className="coverage-notes">
      <h2>{fr?'Ce que signifient ces chiffres':'What these figures mean'}</h2>
      <p>{fr?'Un exercice « pilote » n’a pas reçu de validation pédagogique indépendante. Les exercices de découverte, les jeux et les mini-tests ne correspondent pas aux formats, aux chronomètres ou aux scores officiels.':'A “pilot” item has not undergone independent educational validation. Warm-ups, games, and mini-tests are not the same as official exam formats, time limits or scores.'}</p>
      <p>{fr?'Pour les descriptions et règles officielles des examens, consulte les organismes responsables :':'For authoritative exam specifications and rules, consult the exam owners:'} <a className="text-link" href="https://www.tagemage.fr/page/sous-tests" target="_blank" rel="noopener noreferrer">FNEGE — TAGE MAGE</a> · <a className="text-link" href="https://www.mba.com/exams/gmat-exam/about/exam-content" target="_blank" rel="noopener noreferrer">GMAC — GMAT</a>.</p>
    </section>
  </ArcadeShell>;
}
