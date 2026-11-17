import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Independently computed numeric invariants; reference keys are only compared
// after calculating the next value or matching all five answer options.
const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const logic=bank.filter(q=>q.game==='code-logic');
const prime=n=>Number.isInteger(n)&&n>1&&Array.from({length:Math.max(0,Math.floor(Math.sqrt(n))-1)},(_,i)=>i+2).every(d=>n%d!==0);
const triangular=n=>Number.isInteger(n)&&n>0&&Number.isInteger((Math.sqrt(8*n+1)-1)/2);
const digitSum=n=>String(n).split('').map(Number).reduce((a,b)=>a+b,0);
const reversiblePrime=n=>prime(n)&&prime(Number(String(n).split('').reverse().join('')));
const numericRules={
  'T-L-07':n=>n%6===0,
  'T-L-08':n=>Number.isInteger(Math.sqrt(n)),
  'T-L-09':n=>n%10===5,
  'T-L-10':n=>n%8===4,
  'T-L-11':prime,
  'T-L-12':triangular,
  'T-L-14':n=>Number.isInteger(Math.sqrt(n))&&prime(Math.sqrt(n)),
  'T-L-15':n=>digitSum(n)===11,
  'T-L-16':reversiblePrime,
  'T-L-18':n=>n%6===1
};
const sequenceRules={
  'T-L-01':terms=>terms.at(-1)*2,
  'T-L-02':terms=>(Math.sqrt(terms.at(-1))+1)**2,
  'T-L-03':terms=>terms.at(-1)+(terms.at(-1)-terms.at(-2)),
  'T-L-04':terms=>terms.at(-1)+(terms.at(-1)-terms.at(-2)+2),
  'T-L-05':terms=>terms.at(-1)+(terms.at(-1)-terms.at(-2)+2),
  'T-L-06':terms=>terms.at(-1)/3
};
const numbers=text=>(text.match(/-?\d+/g)??[]).map(Number);
const numericCases=logic.filter(q=>q.competency!=='spatial-categorization');

test('the Code Logic source contains 18 unapproved originals, 16 numeric and 2 spatial',()=>{
  assert.equal(logic.length,18);
  assert.equal(numericCases.length,16);
  assert.equal(Object.keys(numericRules).length,10);
  assert.equal(Object.keys(sequenceRules).length,6);
  assert.deepEqual(logic.filter(q=>q.competency==='spatial-categorization').map(q=>q.id),['T-L-13','T-L-17']);
  assert.ok(logic.every(q=>q.exam==='tage'&&q.status==='pilot'));
});
test('10 numeric categorization questions have exactly one option matching their stated mathematical rule',()=>{
  for(const [id,predicate] of Object.entries(numericRules)){
    const q=logic.find(x=>x.id===id);
    assert.ok(q,id);
    for(const lang of ['fr','en']){
      const examples=numbers(q.content[lang].context);
      assert.ok(examples.length>=6,id+' '+lang+' missing numerical examples');
      assert.ok(examples.every(predicate),id+' '+lang+' counterexample among provided examples');
      const choices=q.content[lang].choices.map(Number);
      assert.ok(choices.every(Number.isFinite),id+' '+lang+' nonnumeric choices');
      const matches=choices.map((v,i)=>predicate(v)?i:-1).filter(i=>i>=0);
      assert.deepEqual(matches,[Number(q.correctAnswer)],id+' '+lang+' key or alternative correct choice');
    }
  }
});
test('six numeric sequence keys follow their explicit elementary generation rule in both languages',()=>{
  const expected={'T-L-01':32,'T-L-02':25,'T-L-03':21,'T-L-04':27,'T-L-05':30,'T-L-06':1};
  for(const [id,rule] of Object.entries(sequenceRules)){
    const q=logic.find(x=>x.id===id);
    for(const lang of ['fr','en']){
      const terms=numbers(q.content[lang].context);
      assert.equal(terms.length,4,id+' '+lang+' term count');
      const next=rule(terms);
      assert.equal(next,expected[id],id+' derived continuation');
      assert.equal(Number(q.content[lang].choices[Number(q.correctAnswer)]),next,id+' '+lang+' key');
      assert.equal(q.content[lang].choices.filter(v=>Number(v)===next).length,1,id+' unique exact answer choice');
    }
  }
});
test('finite sequence data cannot establish a mathematically unique next term by themselves',()=>{
  // If p(n) fits the four observed positions (n=0..3), then
  // p(n)+k*n*(n-1)*(n-2)*(n-3)/24 fits all four, but changes n=4 by k.
  // We intentionally preserve this explicit limitation in the audit.
  for(const q of logic.filter(x=>sequenceRules[x.id])){
    const terms=numbers(q.content.en.context);
    const base=sequenceRules[q.id](terms);
    const competing=Number(q.content.en.choices.find(v=>Number(v)!==base));
    assert.ok(Number.isFinite(competing)&&competing!==base);
    const delta=competing-base;
    const adjustment=n=>delta*n*(n-1)*(n-2)*(n-3)/24;
    assert.ok([0,1,2,3].every(n=>adjustment(n)===0),q.id);
    assert.equal(base+adjustment(4),competing,q.id+' another possible continuation');
  }
});
