import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';
import {buildExamQueue,EMPTY_PROGRESS,recordAttempt,nextReviewQuestion} from '../src/engine/adaptive.ts';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const msr=bank.filter(q=>q.game==='multi-source-lab');

test('three bilingual multi-source pilots share one original three-source dossier',()=>{
  assert.deepEqual(msr.map(q=>[q.id,q.correctAnswer]),[['G-M-01','2'],['G-M-02','0'],['G-M-03','4']]);
  assert.ok(msr.every(q=>q.exam==='gmat'&&q.status==='pilot'&&q.alignment==='skill-practice'));
  for(const locale of ['fr','en']){
    assert.equal(msr[0].content[locale].sources.length,3);
    assert.ok(msr.every(q=>JSON.stringify(q.content[locale].sources)===JSON.stringify(msr[0].content[locale].sources)));
    assert.equal(new Set(msr[0].content[locale].sources.map(s=>s.title)).size,3);
    assert.ok(msr.every(q=>q.content[locale].choices.length===5));
  }
});
test('multi-source correct answers agree with independent business arithmetic',()=>{
  const north=92/100,south=60/80,remote=34/40;
  assert.equal(Math.max(north,south,remote),north);
  assert.equal(3000+600-200,3400);
  assert.equal(3000+600>3500,true);
  assert.equal(72/80,.9);
  assert.equal(msr[0].content.en.choices[2].includes('North'),true);
  assert.equal(msr[1].content.en.choices[0].includes('€3,400'),true);
  assert.equal(msr[2].content.en.choices[4].includes('forecast'),true);
});
test('invalid source structure, invalid IDs and wrong track fail validation',()=>{
  const original=msr[0];
  const broken={...original,content:{...original.content,en:{...original.content.en,sources:[{title:'Short',body:'tiny'}]}}};
  assert.ok(validateQuestions(bank.map(q=>q.id===original.id?broken:q)).some(e=>e.includes(original.id)&&e.includes('sources')));
  const wrong={...original,id:'T-M-99',exam:'tage'};
  assert.ok(validateQuestions([...bank,wrong]).some(e=>e.includes('GMAT only')));
});
test('GMAT mixed queue includes multi-source practice and retains local wrong-answer review',()=>{
  for(const variant of [0,1,2,3,4,8]){
    assert.ok(buildExamQueue(bank,'gmat','mixed',6,variant).some(q=>q.game==='multi-source-lab'));
    assert.ok(buildExamQueue(bank,'tage','mixed',6,variant).every(q=>q.game!=='multi-source-lab'));
  }
  const miss=recordAttempt(EMPTY_PROGRESS,msr[0],false);
  assert.equal(nextReviewQuestion(bank,miss,'gmat',[]).id,msr[0].id);
  assert.equal(nextReviewQuestion(bank,recordAttempt(miss,msr[0],true),'gmat',[]),null);
});
