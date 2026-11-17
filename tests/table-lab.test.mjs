import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';
import {buildExamQueue,EMPTY_PROGRESS,recordAttempt,nextReviewQuestion} from '../src/engine/adaptive.ts';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='table-lab');

test('three GMAT-only bilingual tables have stable independent pilot answer keys',()=>{
  assert.deepEqual(items.map(q=>[q.id,q.correctAnswer]),[['G-T-01','YNY'],['G-T-02','NYY'],['G-T-03','YYN']]);
  assert.ok(items.every(q=>q.exam==='gmat'&&q.status==='pilot'));
  assert.ok(items.every(q=>q.content.fr.tableStatements.length===3&&q.content.en.tableStatements.length===3));
  for(const q of items){
    assert.equal(q.table.columns.length,4);
    assert.equal(q.table.rows.length,5);
    assert.equal(q.table.columns.length,new Set(q.table.columns.map(c=>c.key)).size);
    for(const row of q.table.rows){
      assert.equal(row.length,4);
      for(let i=0;i<4;i++)if(q.table.columns[i].kind==='number')assert.ok(Number.isFinite(Number(row[i])));
    }
  }
});
test('table statements are corroborated by independent arithmetic on synthetic data',()=>{
  const [a,b,c]=items;
  const sales=a.table.rows.map(row=>Number(row[1]));
  assert.equal(Math.max(...sales),200);
  assert.equal(Number(a.table.rows[3][2])/Number(a.table.rows[3][1]),.25);
  assert.equal(Number(a.table.rows[0][1])+Number(a.table.rows[2][1])>Number(a.table.rows[3][1]),true);
  const budgets=b.table.rows.map(row=>Number(row[1]));
  assert.equal(Math.min(...budgets),40);
  assert.equal(b.table.rows.map(row=>Number(row[2])).sort((x,y)=>x-y)[2],11);
  assert.equal(b.table.rows.filter(row=>Number(row[3])<=10).length,2);
  assert.ok(Number(c.table.rows[3][1])>Number(c.table.rows[1][1]));
  assert.equal(Number(c.table.rows[0][2])/Number(c.table.rows[0][1]),Number(c.table.rows[4][2])/Number(c.table.rows[4][1]));
  assert.equal(Math.max(...c.table.rows.map(row=>Number(row[3]))),110);
});
test('table content rejects invalid yes/no keys, wrong row lengths and unsupported exam track',()=>{
  const q=items[0];
  for(const item of [
    {...q,correctAnswer:'YY'},
    {...q,table:{...q.table,rows:[...q.table.rows.slice(0,4),['x']]}},
    {...q,exam:'tage',id:'T-T-99'}
  ]){
    assert.ok(validateQuestions([...bank.filter(v=>v.id!==q.id),item]).some(e=>e.includes(item.id)),item.id);
  }
});
test('GMAT mixed mode includes Table Lab, TAGE excludes it and mistakes are reviewable',()=>{
  for(const variant of [0,1,2,4,8]){
    const g=buildExamQueue(bank,'gmat','mixed',6,variant);
    assert.ok(g.some(q=>q.game==='table-lab'));
    assert.ok(buildExamQueue(bank,'tage','mixed',6,variant).every(q=>q.game!=='table-lab'));
  }
  const missed=recordAttempt(EMPTY_PROGRESS,items[0],false);
  assert.equal(nextReviewQuestion(bank,missed,'gmat',[]).id,'G-T-01');
  assert.equal(nextReviewQuestion(bank,recordAttempt(missed,items[0],true),'gmat',[]),null);
});
