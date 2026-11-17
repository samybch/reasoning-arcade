import {EMPTY_PROGRESS} from './adaptive';
import type {Progress,SkillProgress} from './types';
const KEY='reasoning-arcade:progress:v1';
const initial=():Progress=>({version:1,skills:{},totalAnswered:0,totalCorrect:0,recentQuestionIds:[],pendingReviewIds:[]});
const validNonNeg=(n:unknown):boolean=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0;
const validSkill=(v:unknown):v is SkillProgress=>{
  if(!v||typeof v!=='object'||Array.isArray(v))return false;
  const x=v as Record<string,unknown>;
  return Number.isInteger(x.level)&&Number(x.level)>=1&&Number(x.level)<=5&&
    validNonNeg(x.streakCorrect)&&validNonNeg(x.streakWrong)&&validNonNeg(x.attempts)&&
    validNonNeg(x.correct)&&Number(x.correct)<=Number(x.attempts);
};
export function loadProgress():Progress {
  if(typeof window==='undefined')return initial();
  try{
    const value:unknown=JSON.parse(window.localStorage.getItem(KEY)??'null');
    if(!value||typeof value!=='object'||Array.isArray(value))return initial();
    const x=value as Record<string,unknown>;
    if(x.version!==1||!validNonNeg(x.totalAnswered)||!validNonNeg(x.totalCorrect)||
      Number(x.totalCorrect)>Number(x.totalAnswered)||!x.skills||typeof x.skills!=='object'||Array.isArray(x.skills))return initial();
    const skills=Object.fromEntries(Object.entries(x.skills as Record<string,unknown>).filter(([,s])=>validSkill(s))) as Record<string,SkillProgress>;
    const recentQuestionIds=Array.isArray(x.recentQuestionIds)
      ? x.recentQuestionIds.filter((id:unknown):id is string=>typeof id==='string'&&/^[TG]-[LADCQRET]-\d{2,4}$/.test(id)).slice(-16)
      : [];
    const pendingReviewIds=Array.isArray(x.pendingReviewIds)
      ? [...new Set(x.pendingReviewIds.filter((id:unknown):id is string=>
          typeof id==='string'&&/^[TG]-[LADCQRET]-\d{2,4}$/.test(id)))].slice(-24)
      : [];
    return {version:1,totalAnswered:x.totalAnswered as number,totalCorrect:x.totalCorrect as number,skills,recentQuestionIds,pendingReviewIds};
  }catch{return {...EMPTY_PROGRESS,skills:{}}}
}
export function saveProgress(progress:Progress):void {try{window.localStorage.setItem(KEY,JSON.stringify(progress))}catch{/* private browsing */}}
export function clearProgress():void {try{window.localStorage.removeItem(KEY)}catch{/* private browsing */}}
