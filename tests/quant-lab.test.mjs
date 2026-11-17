import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const items=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const quantitative=items.filter(q=>q.game==='quant-lab');
const expected={
  'T-C-01':{computed:120-120*.25-(120-120*.25)/3},
  'T-C-02':{computed:60/(1/6+1/3)},
  'T-C-03':{computed:74},
  'T-C-04':{computed:8*19},
  'T-C-05':{computed:200*1.2*.8},
  'T-C-06':{computed:(4/9)*(3/8)},
  'G-Q-01':{computed:(12*40+8*50)/20},
  'G-Q-02':{computed:240/6*3*18},
  'G-Q-03':{computed:25/(1+3/2)},
  'G-Q-04':{computed:.6*.2+.4*.35},
  'G-Q-05':{computed:12+14},
  'G-Q-06':{computed:960/(30-18)}
};
const parseChoice=(id,string)=>{
  if(id==='T-C-06'){
    const [numerator,denominator]=string.split('/').map(Number);
    return numerator/denominator;
  }
  return id==='G-Q-04'?Number(string.replace('%',''))/100:Number(string);
};
test('12 original bilingual math answers match independently calculated expected values',()=>{
  assert.equal(quantitative.length,12);
  assert.equal(Object.keys(expected).length,12);
  for(const q of quantitative){
    const proof=expected[q.id];
    assert.ok(proof,`${q.id}: missing independent calculation`);
    const key=Number(q.correctAnswer);
    assert.ok(Number.isInteger(key)&&key>=0&&key<5,`${q.id}: invalid choice index`);
    for(const locale of ['fr','en']){
      const choices=q.content[locale].choices;
      assert.equal(choices.length,5,`${q.id}: ${locale} choice count`);
      const matches=choices.map(v=>parseChoice(q.id,v)).filter(v=>Math.abs(v-proof.computed)<1e-9);
      assert.equal(matches.length,1,`${q.id}: ${locale} ambiguous or incorrect distractors`);
      assert.ok(Math.abs(parseChoice(q.id,choices[key])-proof.computed)<1e-9,`${q.id}: ${locale} incorrect keyed answer`);
    }
  }
});
test('all 12 quantitative pilots have complete, original bilingual learning steps',()=>{
  for(const q of quantitative){
    assert.equal(q.status,'pilot',q.id);
    assert.equal(q.alignment,'skill-practice',q.id);
    for(const locale of ['fr','en']){
      const content=q.content[locale];
      assert.ok(content.prompt.length>45,`${q.id}: weak prompt ${locale}`);
      assert.ok(content.hint.length>20,`${q.id}: weak hint ${locale}`);
      assert.ok(content.explanation.length>50,`${q.id}: weak explanation ${locale}`);
      assert.equal(content.reviewSteps.length,3,`${q.id}: ${locale} steps`);
      assert.ok(content.reviewSteps.every(step=>step.length>=40),`${q.id}: ${locale} stages`);
    }
  }
});
test('the two exam tracks have the correct quantitative IDs and distinct skill categories',()=>{
  const tage=quantitative.filter(q=>q.exam==='tage');
  const gmat=quantitative.filter(q=>q.exam==='gmat');
  assert.deepEqual(tage.map(q=>q.id),['T-C-01','T-C-02','T-C-03','T-C-04','T-C-05','T-C-06']);
  assert.deepEqual(gmat.map(q=>q.id),['G-Q-01','G-Q-02','G-Q-03','G-Q-04','G-Q-05','G-Q-06']);
  assert.ok(new Set(quantitative.map(q=>q.competency)).size>=5);
});

test('quantitative answer positions are distributed across all five choices in both tracks',()=>{
  for(const exam of ['tage','gmat']){
    const indices=quantitative.filter(q=>q.exam===exam).map(q=>Number(q.correctAnswer));
    assert.equal(indices.length,6);
    assert.equal(new Set(indices).size,5,exam+' must exercise all five answer positions');
  }
  const counts=Array.from({length:5},(_,i)=>quantitative.filter(q=>Number(q.correctAnswer)===i).length);
  assert.ok(Math.max(...counts)-Math.min(...counts)<=1, 'no fixed C/D answer position bias');
});
