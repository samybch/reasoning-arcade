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
