import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recordAttempt,nextQuestion,buildExamQueue,grade,EMPTY_PROGRESS,skillKey} from '../src/engine/adaptive.ts';
import {readFileSync} from 'node:fs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const q=bank[0];

test('two consecutive correct answers increase skill level',()=>{
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,true),q,true);
  assert.equal(p.skills[skillKey(q)].level,3);assert.equal(p.totalCorrect,2);
});
test('two consecutive errors decrease skill level',()=>{
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,false),q,false);
  assert.equal(p.skills[skillKey(q)].level,1);
});
test('skills are isolated by exam and competency',()=>{
  const other=bank.find(v=>v.exam==='gmat');
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,true),other,false);
  assert.equal(Object.keys(p.skills).length,2);
});
test('chooser respects track and excludes seen IDs',()=>{
  const first=nextQuestion(bank,EMPTY_PROGRESS,'tage','code-logic',[]);
  assert.ok(first);assert.equal(first.exam,'tage');
  const second=nextQuestion(bank,EMPTY_PROGRESS,'tage','code-logic',[first.id]);
  assert.ok(second);assert.notEqual(first.id,second.id);
});
test('mini-test queue is deterministic and GMAT does not use Code Logic',()=>{
  const a=buildExamQueue(bank,'gmat','mixed',6),b=buildExamQueue(bank,'gmat','mixed',6);
  assert.deepEqual(a.map(q=>q.id),b.map(q=>q.id));
  assert.ok(a.every(q=>q.exam==='gmat'&&q.game!=='code-logic'));
});
test('grade handles empty and partial sessions',()=>{
  assert.deepEqual(grade([]),{correct:0,total:0,percent:0});
  assert.equal(grade([{questionId:'x',selected:'0',correct:true,elapsedSeconds:1}]).percent,100);
});

test('timed scoring counts unanswered questions as incorrect',()=>{
  const oneCorrect=[{questionId:'T-L-01',selected:'2',correct:true,elapsedSeconds:12}];
  assert.equal(grade(oneCorrect,6).percent,17);
  assert.equal(grade([],6).percent,0);
  assert.equal(grade(oneCorrect,1).percent,100);
});

test('repeat mini-tests use fresh deterministic question subsets while preserving valid IDs',()=>{
  for(const exam of ['tage','gmat']){
    const first=buildExamQueue(bank,exam,'mixed',6,0);
    const replay=buildExamQueue(bank,exam,'mixed',6,1);
    assert.equal(first.length,6);
    assert.equal(replay.length,6);
    assert.equal(new Set(first.map(q=>q.id)).size,6);
    assert.equal(new Set(replay.map(q=>q.id)).size,6);
    assert.ok(replay.every(q=>q.exam===exam));
    assert.notDeepEqual(first.map(q=>q.id),replay.map(q=>q.id));
    assert.deepEqual(replay.map(q=>q.id),buildExamQueue(bank,exam,'mixed',6,1).map(q=>q.id));
  }
});

test('recent successful and incorrect questions are remembered without bloating local progress',()=>{
  let progress={...EMPTY_PROGRESS,skills:{},recentQuestionIds:[]};
  const selection=bank.filter(q=>q.exam==='tage'&&q.game==='code-logic');
  for(const [i,q] of selection.entries())progress=recordAttempt(progress,q,i%2===0);
  assert.equal(progress.recentQuestionIds.length,16);
  assert.equal(new Set(progress.recentQuestionIds).size,16);
  assert.equal(progress.recentQuestionIds[0],selection[2].id);
  const next=nextQuestion(bank,progress,'tage','code-logic',[]);
  assert.ok(next);
  assert.ok(!progress.recentQuestionIds.includes(next.id),'prefers older unpracticed questions');
});
test('recent history never repeats the same item within a session or blocks an exhausted pool',()=>{
  const pool=bank.filter(q=>q.exam==='gmat'&&q.game==='argument-lab');
  const progress={...EMPTY_PROGRESS,recentQuestionIds:pool.map(q=>q.id)};
  assert.ok(nextQuestion(pool,progress,'gmat','argument-lab',[]));
  const excluded=pool.slice(0,-1).map(q=>q.id);
  assert.equal(nextQuestion(pool,progress,'gmat','argument-lab',excluded).id,pool.at(-1).id);
  assert.equal(nextQuestion(pool,progress,'gmat','argument-lab',pool.map(q=>q.id)),null);
});
