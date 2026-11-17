import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';
import {EMPTY_PROGRESS,recordAttempt,nextReviewQuestion,buildExamQueue} from '../src/engine/adaptive.ts';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='graphics-lab');

test('three original GMAT charts use two distinct FR/EN dropdowns',()=>{
  assert.deepEqual(items.map(q=>[q.id,q.correctAnswer]),[['G-I-01','3|1'],['G-I-02','2|0'],['G-I-03','1|2']]);
  assert.ok(items.every(q=>q.exam==='gmat'&&q.status==='pilot'&&q.alignment==='skill-practice'));
  for(const q of items){
    assert.equal(q.graph.type,'bar');
    assert.equal(q.graph.labels.length,4);
    assert.equal(q.graph.values.length,4);
    for(const lang of ['fr','en']){
      assert.equal(q.content[lang].graphicStatements.length,2);
      assert.ok(q.content[lang].graphicStatements.every(x=>x.options.length===4));
      assert.ok(q.content[lang].reviewSteps.every(x=>x.length>=40));
    }
  }
});
test('independent chart arithmetic supports two answers per question',()=>{
  const [a,b,c]=items;
  assert.equal(a.graph.values.indexOf(Math.max(...a.graph.values)),3);
  assert.equal(a.graph.values[3]-a.graph.values[1],20);
  assert.equal(b.graph.values[3]/b.graph.values[1]*100,200);
  assert.equal(b.graph.values[2]-b.graph.values[0],25);
  assert.equal(c.graph.values[0]+c.graph.values[3],95);
  assert.equal(c.graph.values.filter(v=>v>45).length,2);
});
test('malformed charts or dropdown answers are rejected',()=>{
  const x=items[0];
  for(const invalid of [
    {...x,correctAnswer:'3|9'},
    {...x,graph:{...x.graph,values:[40]}},
    {...x,content:{...x.content,fr:{...x.content.fr,graphicStatements:[]}}}
  ]){
    const errors=validateQuestions(bank.map(q=>q.id===x.id?invalid:q));
    assert.ok(errors.some(e=>e.includes(x.id)),JSON.stringify(errors));
  }
  const wrong={...x,exam:'tage',id:'T-I-99'};
  assert.ok(validateQuestions([...bank,wrong]).some(e=>e.includes('Graph Lab belongs to GMAT only')));
});
test('graphics mistakes survive adaptive review and mixed GMAT queues include graphics in rotation',()=>{
  const mistaken=recordAttempt(EMPTY_PROGRESS,items[0],false);
  assert.equal(nextReviewQuestion(bank,mistaken,'gmat',[]).id,items[0].id);
  assert.equal(nextReviewQuestion(bank,recordAttempt(mistaken,items[0],true),'gmat',[]),null);
  assert.ok([0,1,2,3,4,5,6].some(v=>buildExamQueue(bank,'gmat','mixed',6,v).some(q=>q.game==='graphics-lab')));
  assert.ok(buildExamQueue(bank,'tage','mixed',6,0).every(q=>q.game!=='graphics-lab'));
});
