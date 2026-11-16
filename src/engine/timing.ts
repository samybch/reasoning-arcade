// Pure time helpers: elapsed wall-clock intervals remain correct after tab suspension.
export function elapsedSeconds(startMs:number,nowMs:number):number {
  if(!Number.isFinite(startMs)||!Number.isFinite(nowMs))return 0;
  return Math.max(0,Math.floor((nowMs-startMs)/1000));
}
export function timeExpired(startMs:number,nowMs:number,durationSeconds:number):boolean{
  return durationSeconds>0 && elapsedSeconds(startMs,nowMs)>=durationSeconds;
}

// Timed practice uses each pilot's estimated solving time, never official exam section timing.
export function practiceDurationSeconds(questions:ReadonlyArray<{estimatedSeconds:number}>):number {
  return questions.reduce((sum,q)=>sum+q.estimatedSeconds,0);
}
