'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArcadeShell} from './ArcadeShell';
import {clearProgress,loadProgress} from '../engine/storage';
import type {Exam,Game,Locale,SkillProgress} from '../engine/types';

const games:{id:Game;name:string;description:{fr:string;en:string};symbol:string}[]=[
  {id:'code-logic',name:'Code Logic',symbol:'⌘',description:{fr:'Trouve la règle cachée dans les nombres et les figures.',en:'Find the hidden rule behind numbers and patterns.'}},
  {id:'argument-lab',name:'Argument Lab',symbol:'◇',description:{fr:'Identifie hypothèses, conclusions et failles de raisonnement.',en:'Find assumptions, conclusions and flawed arguments.'}},
  {id:'enough-info',name:'Enough Info?',symbol:'∑',description:{fr:'Décide si deux informations suffisent à répondre.',en:'Decide if two statements contain enough information.'}},
  {id:'quant-lab',name:'Quant Lab',symbol:'%',description:{fr:'Résous des problèmes de calcul, de proportion et d’algèbre.',en:'Solve quantitative, rate, algebra and ratio challenges.'}}
];
export function HomeScreen({locale,questionCount,questionIds}:{locale:Locale;questionCount:number;questionIds:string[]}){
  const [exam,setExam]=useState<Exam>('tage');
  const [stats,setStats]=useState({total:0,correct:0});
  const [pendingReviewIds,setPendingReviewIds]=useState<string[]>([]);
  const [skillSummary,setSkillSummary]=useState<Array<{key:string;exam:string;skill:string;progress:SkillProgress}>>([]);
  useEffect(()=>{
    const p=loadProgress();
    setStats({total:p.totalAnswered,correct:p.totalCorrect});
    setPendingReviewIds(p.pendingReviewIds??[]);
    const summary=Object.entries(p.skills).filter(([,v])=>v.attempts>0).map(([key,progress])=>{
      const [exam,,skill]=key.split(':');
      return {key,exam,skill,progress};
    });
    setSkillSummary(summary.sort((a,b)=>a.key.localeCompare(b.key)));
  },[]);
  const fr=locale==='fr';
  const names:Record<string,{fr:string;en:string}>={
    'numeric-patterns':{fr:'Suites numériques',en:'Number patterns'},
    'numeric-categorization':{fr:'Catégorisation',en:'Categorization'},
    'critical-reasoning':{fr:'Raisonnement critique',en:'Critical reasoning'},
    'data-sufficiency':{fr:'Suffisance de données',en:'Data sufficiency'},
    'percentages':{fr:'Pourcentages',en:'Percentages'},
    'rates':{fr:'Débits et proportions',en:'Rates and proportions'},
    'algebra':{fr:'Algèbre',en:'Algebra'},
    'geometry':{fr:'Géométrie',en:'Geometry'},
    'probability':{fr:'Probabilités',en:'Probability'},
    'weighted-averages':{fr:'Moyennes pondérées',en:'Weighted averages'}
  };
  const knownQuestionIds=new Set(questionIds);
  const reviewCount=pendingReviewIds.filter(id=>knownQuestionIds.has(id)&&id.startsWith(exam==='tage'?'T-':'G-')).length;
  function reset(){if(window.confirm(fr?'Effacer ta progression sur cet appareil ?':'Delete progress stored on this device?')){
    clearProgress();setStats({total:0,correct:0});setSkillSummary([]);setPendingReviewIds([]);
  }}
  return <ArcadeShell locale={locale}>
    <section className="hero">
      <div><p className="eyebrow">THINK SMARTER · PLAY BETTER</p>
        <h1>{fr?'La logique,':'Better thinking,'}<br/><em>{fr?'à ton rythme.':'one puzzle at a time.'}</em></h1>
        <p className="lead">{fr?'Des jeux pour développer ton raisonnement et des mini-tests pour te préparer. Sans compte, gratuitement.':'Grow your reasoning skills with quick games and timed practice. Free, with no login.'}</p>
        <a className="button primary" href="#choose">{fr?'Commencer':'Get started'} →</a>
        <p className="hero-stats"><strong>{games.length}</strong> {fr?'jeux':'games'} <span>·</span> <strong>{questionCount}</strong> {fr?'questions pilotes':'pilot questions'} <span>·</span> <strong>0 €</strong></p>
      </div>
      <div className="hero-graphic" aria-hidden><div className="floating f1">3 · 6 · 12 · <b>?</b></div><div className="floating f2">IF → THEN</div><div className="floating f3">A / B / C / D / E</div></div>
    </section>
    <section id="choose" className="section">
      <p className="eyebrow">01 — {fr?'CHOISIS TON PARCOURS':'CHOOSE YOUR TRACK'}</p><h2>{fr?'Quel examen prépares-tu ?':'Which exam are you preparing for?'}</h2>
      <div className="track-selector" role="group" aria-label={fr?'Examen':'Exam'}>
        <button type="button" aria-pressed={exam==='tage'} className={exam==='tage'?'track active':'track'} onClick={()=>setExam('tage')}><strong>TAGE MAGE</strong><small>{fr?'Logique · Calcul · Raisonnement':'Logic · Quantitative · Reasoning'}</small></button>
        <button type="button" aria-pressed={exam==='gmat'} className={exam==='gmat'?'track active':'track'} onClick={()=>setExam('gmat')}><strong>GMAT</strong><small>Quant · Verbal · Data Insights</small></button>
      </div>
      <div className="section-header"><div><p className="eyebrow">02 — {fr?'À TOI DE JOUER':'YOUR CHALLENGE'}</p><h2>{fr?'Choisis ton jeu':'Choose a game'}</h2></div>
        <Link className="text-link" href={`/${locale}/practice/?exam=${exam}`}>{fr?'Mini-test chronométré':'Timed mini-test'} →</Link></div>
      <div className="game-grid">
        {games.filter(g=>exam==='tage'||g.id!=='code-logic').map((g,i)=><article className="game-card" key={g.id}>
          <div className={`game-illustration illustration-${i}`} aria-hidden>{g.symbol}</div>
          <div className="game-description"><p className="eyebrow">{fr?'RAISONNEMENT':'REASONING'} · {i+1}</p><h3>{g.name}</h3><p>{g.description[locale]}</p>
            <div className="actions"><Link className="button secondary" href={`/${locale}/play/${g.id}/?exam=${exam}&mode=game`}>{fr?'Jouer':'Play'} →</Link>
            <Link className="text-link" href={`/${locale}/play/${g.id}/?exam=${exam}&mode=exam`}>{fr?'Chronométré':'Timed'} ◷</Link></div></div>
        </article>)}
      </div>
      {exam==='gmat'&&<p className="note">{fr?'Code Logic est un exercice complémentaire et non une section du GMAT.':'Code Logic is supplemental practice, not a GMAT exam section.'}</p>}
    </section>
    {reviewCount>0&&<section className="review-cta" aria-label={fr?'Révision des erreurs':'Mistake review'}>
      <div><p className="eyebrow">{fr?'ENTRAÎNEMENT CIBLÉ':'TARGETED PRACTICE'}</p>
        <h2>{fr?'Revoir mes erreurs':'Review my mistakes'}</h2>
        <p>{reviewCount} {fr?'exercice(s) à retravailler pour ce parcours.':'exercise(s) to revisit in this track.'}</p>
      </div>
      <Link className="button primary" href={`/${locale}/review/?exam=${exam}`}>{fr?'Revoir mes erreurs':'Review my mistakes'} →</Link>
    </section>}
    <section className="progress-panel"><div><p className="eyebrow">03 — {fr?'PROGRESSION':'PROGRESS'}</p><h2>{fr?'Ta progression locale':'Your local progress'}</h2>
      <p>{fr?'Elle reste dans ton navigateur. Aucun compte nécessaire.':'Saved in your browser. No account required.'}</p></div>
      <div className="stats"><div><strong>{stats.total}</strong><small>{fr?'Réponses':'Answers'}</small></div>
      <div><strong>{stats.total?Math.round(stats.correct/stats.total*100):0}%</strong><small>{fr?'Réussite':'Accuracy'}</small></div>
      <button className="reset-button" type="button" onClick={reset}>{fr?'Effacer':'Reset'}</button></div>
    </section>
    {skillSummary.length>0&&<section className="skill-section" aria-labelledby="skill-heading">
      <p className="eyebrow">{fr?'MAÎTRISE PAR COMPÉTENCE':'MASTERY BY SKILL'}</p>
      <h2 id="skill-heading">{fr?'Compétences travaillées':'Skills practiced'}</h2>
      <p className="note">{fr?'Ces niveaux sont expérimentaux et ne correspondent à aucun score officiel.':'These levels are experimental and do not correspond to official scores.'}</p>
      <ul className="skill-grid">{skillSummary.map(item=><li key={item.key} className="skill-card">
        <div><small>{item.exam.toUpperCase()==='TAGE'?'TAGE MAGE':'GMAT'}</small><strong>{names[item.skill]?.[locale]??item.skill.replaceAll('-',' ')}</strong></div>
        <div><b>{fr?'Niveau':'Level'} {item.progress.level}/5</b>
          <small>{item.progress.correct}/{item.progress.attempts} {fr?'réussites':'correct'}</small></div>
      </li>)}</ul>
    </section>}
    <p className="disclaimer">{fr?'Exercices originaux pilotes. Site indépendant, non affilié aux organismes officiels. Aucun score présenté comme officiel.':'Original pilot exercises. Independent project, not affiliated with exam organizations. No official score estimates.'}</p>
  </ArcadeShell>;
}
