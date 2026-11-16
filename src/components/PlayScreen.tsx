'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArcadeShell} from './ArcadeShell';
import {buildExamQueue,grade,nextQuestion,nextReviewQuestion,recordAttempt} from '../engine/adaptive';
import {loadProgress,saveProgress} from '../engine/storage';
import {elapsedSeconds,timeExpired} from '../engine/timing';
import type {Attempt,Exam,Game,Locale,Progress,Question} from '../engine/types';
import {ReasoningBreakdown} from './ReasoningBreakdown';

type Mode='game'|'exam'|'review';
const LABELS:{fr:string[];en:string[]}={
  fr:['(1) seule suffit','(2) seule suffit','Les deux ensemble uniquement','Chacune suffit seule','Aucune, même ensemble'],
  en:['Statement (1) alone','Statement (2) alone','Both statements together only','Either statement alone','Neither, even together']
};
const titles:Record<Game,string>={'code-logic':'Code Logic','argument-lab':'Argument Lab','enough-info':'Enough Info?'};
const answerLetter=(q:Question)=>q.game==='enough-info'?q.correctAnswer:String.fromCharCode(65+Number(q.correctAnswer));
const mmss=(s:number)=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.max(0,s)%60).padStart(2,'0')}`;
export function PlayScreen({locale,game,bank,forceExam=false,reviewOnly=false}:{locale:Locale;game:Game|'mixed';bank:Question[];forceExam?:boolean;reviewOnly?:boolean}){
  const fr=locale==='fr';
  const [exam,setExam]=useState<Exam>('tage');
  const [mode,setMode]=useState<Mode>(reviewOnly?'review':forceExam?'exam':'game');
  const [reviewTarget,setReviewTarget]=useState(0);
  const [ready,setReady]=useState(false);
  const [round,setRound]=useState(0);
  const [progress,setProgress]=useState<Progress|null>(null);
  const [queue,setQueue]=useState<Question[]>([]);
  const [current,setCurrent]=useState<Question|null>(null);
  const [attempts,setAttempts]=useState<Attempt[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [revealed,setRevealed]=useState(false);
  const [hint,setHint]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const [finished,setFinished]=useState(false);
  const [expired,setExpired]=useState(false);
  const sessionStartedMs=useRef<number>(0);
  const sessionSize=game==='mixed'?6:5;
  useEffect(()=>{
    const query=new URLSearchParams(window.location.search);
    setExam(query.get('exam')==='gmat'?'gmat':'tage');
    setMode(reviewOnly?'review':forceExam||query.get('mode')==='exam'?'exam':'game');
    setReady(true);
  },[forceExam,reviewOnly]);
  useEffect(()=>{
    if(!ready)return;
    sessionStartedMs.current=performance.now();
    const p=loadProgress();
    const fixed=mode==='exam'?buildExamQueue(bank,exam,game,sessionSize,Math.floor(p.totalAnswered/sessionSize)+round):[];
    const existing=new Set(bank.filter(q=>q.exam===exam).map(q=>q.id));
    const reviewTargetNow=Math.min(sessionSize,(p.pendingReviewIds??[]).filter(id=>existing.has(id)).length);
    setReviewTarget(reviewTargetNow);
    setProgress(p);setQueue(fixed);
    setCurrent(mode==='exam'?fixed[0]??null:mode==='review'
      ?nextReviewQuestion(bank,p,exam,[]):nextQuestion(bank,p,exam,game,[]));
    setAttempts([]);setSelected(null);setRevealed(false);setHint(false);setSeconds(0);setFinished(false);setExpired(false);
  },[ready,round,exam,mode,game,bank,sessionSize]);
  useEffect(()=>{
    if(!ready||finished||!current||(mode!=='exam'&&revealed))return;
    const tick=()=>setSeconds(v=>mode==='exam'?elapsedSeconds(sessionStartedMs.current,performance.now()):v+1);
    const id=window.setInterval(tick,mode==='exam'?250:1000);
    return ()=>window.clearInterval(id);
  },[ready,finished,current,mode,revealed]);
  const duration=queue.length*80;
  useEffect(()=>{
    if(mode==='exam'&&ready&&!finished&&queue.length&&seconds>=duration){
      setExpired(true);setFinished(true);setCurrent(null);
    }
  },[mode,ready,finished,queue.length,seconds,duration]);
  function submit(){
    if(selected===null||!current||revealed||finished||!progress)return;
    // Prevent late submissions even if the tab was backgrounded and its interval throttled.
    if(mode==='exam'&&timeExpired(sessionStartedMs.current,performance.now(),duration)){
      setSeconds(duration);setExpired(true);setFinished(true);setCurrent(null);
      return;
    }
    const correct=selected===current.correctAnswer;
    const updated=recordAttempt(progress,current,correct);
    const nextAttempts=[...attempts,{questionId:current.id,selected,correct,elapsedSeconds:seconds}];
    setProgress(updated);saveProgress(updated);setAttempts(nextAttempts);
    if(mode==='exam'){
      if(nextAttempts.length>=queue.length){setFinished(true);setCurrent(null)}
      else {setCurrent(queue[nextAttempts.length]);setSelected(null)}
    }else setRevealed(true);
  }
  function advance(){
    if(!progress)return;
    if(attempts.length>=(mode==='review'?reviewTarget:sessionSize)){setFinished(true);setCurrent(null);return}
    const next=mode==='review'?nextReviewQuestion(bank,progress,exam,attempts.map(a=>a.questionId)):
      nextQuestion(bank,progress,exam,game,attempts.map(a=>a.questionId));
    if(!next){setFinished(true);setCurrent(null);return}
    setCurrent(next);setSelected(null);setRevealed(false);setHint(false);
  }
  const result=grade(attempts,mode==='exam'?queue.length:mode==='review'?reviewTarget:sessionSize);
  const max=mode==='exam'?queue.length:mode==='review'?reviewTarget:sessionSize;
  const number=Math.min(attempts.length+(mode!=='exam'&&revealed?0:1),max);
  const name=mode==='review'?(fr?'Révision des erreurs':'Mistake review'):game==='mixed'?(fr?'Mini-test mixte':'Mixed mini-test'):titles[game];
  return <ArcadeShell locale={locale}>
    <div className="play-header"><Link className="text-link" href={`/${locale}/`}>← {fr?'Retour':'Back'}</Link><div className="tags"><span>{exam==='tage'?'TAGE MAGE':'GMAT'}</span><span>{mode==='exam'?(fr?'Mini-test':'Mini test'):mode==='review'?(fr?'Révision':'Review'):(fr?'Mode jeu':'Game mode')}</span></div></div>
    {!ready||!progress?<p role="status">{fr?'Chargement…':'Loading…'}</p>:finished?<section className="result-card">
      <p className="eyebrow">{fr?'SESSION TERMINÉE':'SESSION COMPLETE'}</p><div className="score-ring">{result.percent}%</div>
      <h1>{fr?'Tes résultats':'Your results'}</h1>
      <p>{result.correct}/{max} {fr?'réponses correctes':'correct answers'} · {result.total} {fr?'tentées':'attempted'}</p>
      {expired&&<p className="warning">{fr?'Temps écoulé !':'Time is up!'}</p>}
      <p className="note">{fr?'Ce résultat n’est pas un score officiel.':'This result is not an official exam score.'}</p>
      <div className="review"><h2>{fr?'Corrections':'Review'}</h2>
        {expired&&queue.length>attempts.length&&<p className="warning">{fr?'Questions non répondues :':'Unanswered questions:'} {queue.length-attempts.length}</p>}
        {attempts.map((a,i)=>{const q=bank.find(v=>v.id===a.questionId);return q?<article key={q.id} className="review-item"><strong>{a.correct?'✓':'×'} {i+1}. {q.content[locale].prompt}</strong><p className="review-answer">{fr?'Réponse attendue':'Correct answer'} : {answerLetter(q)}</p><p>{q.content[locale].explanation}</p><ReasoningBreakdown text={q.content[locale]} locale={locale} game={q.game}/></article>:null})}
        {expired&&queue.slice(attempts.length).map(q=><article key={q.id} className="review-item">
          <strong>{fr?'Non répondu':'Unanswered'} — {q.content[locale].prompt}</strong>
          <p className="review-answer">{fr?'Réponse attendue':'Correct answer'} : {answerLetter(q)}</p>
          <p>{q.content[locale].explanation}</p>
          <ReasoningBreakdown text={q.content[locale]} locale={locale} game={q.game}/>
        </article>)}
      </div><div className="actions"><button type="button" className="button primary" onClick={()=>setRound(v=>v+1)}>{fr?'Rejouer':'Try again'} ↻</button><Link className="button secondary" href={`/${locale}/`}>{fr?'Accueil':'Home'}</Link></div>
    </section>:!current?<section className="quiz-card"><h1>{mode==='review'?(fr?'Aucune erreur à revoir pour ce parcours':'No mistakes to review in this track'):(fr?'Aucun exercice disponible':'No exercises available')}</h1><Link href={`/${locale}/`}>{fr?'Accueil':'Home'}</Link></section>:
    <section className="quiz-card" aria-labelledby="question-title">
      <div className="question-top"><div><p className="eyebrow">{name} · {fr?'Question':'Question'} {number}/{max}</p><p className="difficulty">{fr?'Niveau':'Level'} {current.difficulty}/5</p>
        {current.alignment==='warmup'&&<p className="note" role="note">{fr?'Échauffement : ce format ne reproduit pas le sous-test Logique officiel.':'Warm-up: this format does not reproduce the official Logic subtest.'}</p>}</div>
        <span className="timer" role="timer" aria-label={fr?'Chronomètre':'Timer'}>{mmss(mode==='exam'?duration-seconds:seconds)}</span></div>
      <div className="progress-bar" role="progressbar" aria-label={fr?'Progression des questions':'Question progress'} aria-valuenow={attempts.length} aria-valuemin={0} aria-valuemax={max}><span style={{width:`${Math.min(100,100*attempts.length/max)}%`}}/></div>
      <h1 id="question-title">{current.content[locale].prompt}</h1>
      {current.content[locale].context&&<p className="context">{current.content[locale].context}</p>}
      {current.content[locale].statements?.map((s,i)=><div className="statement" key={i}><span>({i+1})</span> {s}</div>)}
      <div className="answer-list" role="group" aria-label={fr?'Choix de réponse':'Answer choices'}>
        {(current.game==='enough-info'?['A','B','C','D','E']:current.content[locale].choices??[]).map((choice,i)=>{
          const key=current.game==='enough-info'?String(choice):String(i);
          const label=current.game==='enough-info'?LABELS[locale][i]:choice;
          const right=revealed&&key===current.correctAnswer;
          const wrong=revealed&&selected===key&&key!==current.correctAnswer;
          return <button type="button" key={key} aria-pressed={selected===key} disabled={revealed} onClick={()=>setSelected(key)} className={`answer ${selected===key?'chosen':''} ${right?'correct':''} ${wrong?'incorrect':''}`}>
            <span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{label}</span>{right&&<b aria-label={fr?'Bonne réponse':'Correct'}>✓</b>}</button>
        })}
      </div>
      {mode!=='exam'&&!revealed&&<button className="hint-button" type="button" aria-expanded={hint} onClick={()=>setHint(v=>!v)}>{fr?'Afficher un indice':'Show a hint'} ✧</button>}
      {hint&&mode!=='exam'&&!revealed&&<div className="hint" role="note">{current.content[locale].hint}</div>}
      {revealed&&<div role="status" className={selected===current.correctAnswer?'feedback good':'feedback bad'}><strong>{selected===current.correctAnswer?(fr?'Bonne réponse':'Correct'):(fr?'À retravailler':'Keep practicing')}</strong>
        <p className="review-answer">{fr?'Réponse attendue':'Correct answer'} : {answerLetter(current)}</p>
        <p>{current.content[locale].explanation}</p>
        <ReasoningBreakdown text={current.content[locale]} locale={locale} game={current.game}/></div>}
      <div className="quiz-footer"><span className="small-muted">{fr?'Les progrès restent sur cet appareil.':'Progress stays on this device.'}</span>
        {mode!=='exam'&&revealed?<button type="button" className="button primary" onClick={advance}>{attempts.length>=max?(fr?'Terminer':'Finish'):(fr?'Suivante':'Next')} →</button>:
          <button type="button" className="button primary" disabled={selected===null} onClick={submit}>{fr?'Valider':'Submit'} →</button>}</div>
      {mode==='exam'&&<p className="note">{fr?'Entraînement chronométré, non officiel. Les explications seront visibles à la fin.':'Unofficial timed practice. Explanations appear at the end.'}</p>}
    </section>}
  </ArcadeShell>;
}
