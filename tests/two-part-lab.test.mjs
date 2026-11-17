import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';
import {EMPTY_PROGRESS,recordAttempt,nextReviewQuestion,buildExamQueue} from '../src/engine/adaptive.ts';
const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='two-part-lab');

test('three original bilingual GMAT Two-Part questions store two independent choices',()=>{
  assert.deepEqual(items.map(q=>[q.id,q.correctAnswer]),[['G-P-01','4|2'],['G-P-02','2|4'],['G-P-03','4|1']]);
  assert.ok(items.every(q=>q.exam==='gmat'&&q.status==='pilot'&&q.alignment==='skill-practice'));
  for(const q of items)for(const lang of ['fr','en']){
    const loc=q.content[lang];
    assert.equal(loc.choices.length,5,q.id);
    assert.equal(loc.twoPartHeaders.length,2,q.id);
    assert.equal(new Set(loc.choices).size,5,q.id);
    assert.ok(loc.reviewSteps.every(step=>step.length>=40),q.id);
    assert.ok(loc.choices.every(option=>option.trim().length>0),q.id);
    assert.ok(q.correctAnswer.split('|').every(k=>Number(k)<loc.choices.length));
  }
  assert.deepEqual(validateQuestions(),[]);
});

test('independent two-part calculations support both columns, not just one',()=>{
  assert.equal(2*40+40,120);
  assert.equal(items[0].content.en.choices[4],'80 hours');
  assert.equal(items[0].content.en.choices[2],'40 hours');
  const profit=n=>8*n-240;
  assert.equal(profit(30),0);
  assert.equal(profit(50),160);
  assert.equal(items[1].content.en.choices[2],'30 units');
  assert.equal(items[1].content.en.choices[4],'50 units');
  assert.equal(600*.12,72);
  assert.equal(400*.08,32);
  assert.equal(items[2].content.en.choices[4],'72 orders');
  assert.equal(items[2].content.en.choices[1],'32 orders');
});

test('invalid answer pairs, missing column labels and wrong exam track are rejected',()=>{
  const q=items[0];
  for(const broken of [
    {...q,correctAnswer:'4'},
    {...q,correctAnswer:'4|8'},
    {...q,content:{...q.content,fr:{...q.content.fr,twoPartHeaders:[]}}},
    {...q,exam:'tage',id:'T-P-99'}
  ]){
    const failures=validateQuestions([...bank.filter(x=>x.id!==q.id),broken]);
    assert.ok(failures.some(x=>x.includes(broken.id)),JSON.stringify(failures));
  }
});

test('two-part problems participate in the rotating GMAT queue, never TAGE, and retain mistake review',()=>{
  const covered=new Set();
  for(let variant=0;variant<10;variant++){
    const q=buildExamQueue(bank,'gmat','mixed',6,variant);
    q.filter(x=>x.game==='two-part-lab').forEach(x=>covered.add(x.id));
    assert.ok(buildExamQueue(bank,'tage','mixed',6,variant).every(x=>x.game!=='two-part-lab'));
  }
  assert.ok(covered.size>=1);
  const mistaken=recordAttempt(EMPTY_PROGRESS,items[0],false);
  assert.equal(nextReviewQuestion(bank,mistaken,'gmat',[])?.id,items[0].id);
  assert.equal(nextReviewQuestion(bank,mistaken,'tage',[]),null);
  assert.equal(nextReviewQuestion(bank,recordAttempt(mistaken,items[0],true),'gmat',[]),null);
});
