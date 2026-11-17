import type {Attempt,Exam,Game,Level,Progress,Question,SkillProgress} from './types';

export const EMPTY_PROGRESS:Progress={version:1,skills:{},totalAnswered:0,totalCorrect:0,recentQuestionIds:[],pendingReviewIds:[]};
const RECENT_LIMIT=16;
const REVIEW_LIMIT=24;
export const skillKey=(q:Question):string=>`${q.exam}:${q.game}:${q.competency}`;
export function recordAttempt(progress:Progress,question:Question,correct:boolean):Progress {
  const key=skillKey(question);
  const current:SkillProgress=progress.skills[key]??{level:2,streakCorrect:0,streakWrong:0,attempts:0,correct:0};
  const wins=correct?current.streakCorrect+1:0;
  const losses=correct?0:current.streakWrong+1;
  const level=Math.max(1,Math.min(5,current.level+(wins>=2?1:losses>=2?-1:0))) as Level;
  const next:SkillProgress={
    level,streakCorrect:wins>=2?0:wins,streakWrong:losses>=2?0:losses,
    attempts:current.attempts+1,correct:current.correct+(correct?1:0)
  };
  const recentQuestionIds=[...(progress.recentQuestionIds??[]).filter(id=>id!==question.id),question.id].slice(-RECENT_LIMIT);
  const pendingReviewIds=correct
    ? (progress.pendingReviewIds??[]).filter(id=>id!==question.id)
    : [...(progress.pendingReviewIds??[]).filter(id=>id!==question.id),question.id].slice(-REVIEW_LIMIT);
  return {version:1,skills:{...progress.skills,[key]:next},totalAnswered:progress.totalAnswered+1,totalCorrect:progress.totalCorrect+(correct?1:0),recentQuestionIds,pendingReviewIds};
}
export function nextQuestion(bank:Question[],progress:Progress,exam:Exam,game:Game|'mixed',used:string[]):Question|null{
  const unseen=bank.filter(q=>q.exam===exam&&(game==='mixed'||q.game===game)&&!used.includes(q.id));
  if(!unseen.length)return null;
  const recent=new Set(progress.recentQuestionIds??[]);
  const fresh=unseen.filter(q=>!recent.has(q.id));
  // Prefer unseen questions across sessions, but never allow an exhausted pool to dead-end.
  const pool=fresh.length?fresh:unseen;
  return pool.sort((a,b)=>{
    const aSkill=progress.skills[skillKey(a)];
    const bSkill=progress.skills[skillKey(b)];
    const aScore=Math.abs(a.difficulty-(aSkill?.level??2))*10+(aSkill?.attempts??0);
    const bScore=Math.abs(b.difficulty-(bSkill?.level??2))*10+(bSkill?.attempts??0);
    return aScore-bScore||a.id.localeCompare(b.id);
  })[0];
}
// Use oldest pending mistakes first, without repeating an item inside one review session.
// The bank remains the source of truth: stale local IDs are ignored, not rendered.
export function nextReviewQuestion(bank:Question[],progress:Progress,exam:Exam,used:string[]):Question|null {
  const excluded=new Set(used);
  const available=new Map(bank.filter(q=>q.exam===exam).map(q=>[q.id,q]));
  for(const id of progress.pendingReviewIds??[]) {
    if(!excluded.has(id) && available.has(id)) return available.get(id)??null;
  }
  return null;
}
// Unofficial timed practice: rotate item selection and cover each available skill game.
// Round-robin selection avoids a mixed mini-test accidentally containing a single category.
export function buildExamQueue(bank:Question[],exam:Exam,game:Game|'mixed',size=6,variant=0):Question[]{
  const eligible=bank.filter(q=>q.exam===exam&&(game==='mixed'||q.game===game));
  if(!eligible.length||size<=0)return [];
  const normalizedVariant=Number.isFinite(variant)?Math.trunc(variant):0;
  const select=(items:Question[],shift:number):Question[]=>{
    const sorted=[...items].sort((a,b)=>a.difficulty-b.difficulty||a.id.localeCompare(b.id));
    if(!sorted.length)return [];
    const offset=((shift%sorted.length)+sorted.length)%sorted.length;
    const rotated=[...sorted.slice(offset),...sorted.slice(0,offset)];
    const chosen:Question[]=[];
    while(rotated.length&&chosen.length<size){
      chosen.push(rotated.splice(Math.floor((rotated.length-1)/2),1)[0]);
    }
    return chosen;
  };
  if(game!=='mixed')return select(eligible,normalizedVariant);
  const order:Game[]=['code-logic','argument-lab','enough-info','quant-lab','reading-lab','expression-lab','table-lab','multi-source-lab','graphics-lab'];
  const availableGames=order.filter(g=>eligible.some(q=>q.game===g));
  const offset=((normalizedVariant%availableGames.length)+availableGames.length)%availableGames.length;
  const rotatedGames=[...availableGames.slice(offset),...availableGames.slice(0,offset)];
  const pools=new Map(rotatedGames.map((g,i)=>[g,select(eligible.filter(q=>q.game===g),normalizedVariant+i)]));
  const chosen:Question[]=[];
  while(chosen.length<size){
    let picked=false;
    for(const g of rotatedGames){
      const next=pools.get(g)?.shift();
      if(!next)continue;
      chosen.push(next);
      picked=true;
      if(chosen.length>=size)break;
    }
    if(!picked)break;
  }
  return chosen;
}
export function queueUnansweredForReview(progress:Progress,unanswered:Question[]):Progress{
  if(unanswered.length===0)return progress;
  const pending=[...(progress.pendingReviewIds??[])];
  for(const question of unanswered){
    if(!pending.includes(question.id))pending.push(question.id);
  }
  // Unanswered questions join the local review queue but do not count as attempts.
  return {...progress,pendingReviewIds:pending.slice(-REVIEW_LIMIT)};
}
// In timed sessions, unanswered questions count toward the denominator.
export function grade(attempts:Attempt[],expectedQuestions=attempts.length){
  const correct=attempts.filter(a=>a.correct).length;
  const denominator=Math.max(expectedQuestions,attempts.length);
  return {correct,total:attempts.length,percent:denominator?Math.round(100*correct/denominator):0};
}
