import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const quant=catalog.filter(q=>q.game==='quant-lab');
const close=(a,b)=>Math.abs(a-b)<1e-10;
const numericChoice=value=>{
  const clean=value.replaceAll(/[^0-9./-]/g,'');
  if(/^\d+\/\d+$/.test(clean)){const [n,d]=clean.split('/').map(Number);return n/d}
  return Number(clean);
};
// Compute each correct result from the *word problem's parameters*, never from
// q.correctAnswer, an answer choice, or its pre-written explanation.
const independent={
  'T-C-01':()=>{const initial=120;const morning=initial/4;const afternoon=(initial-morning)/3;return initial-morning-afternoon},
  'T-C-02':()=>60/(1/6+1/3),
  'T-C-03':()=>{
    const solutions=[];
    for(let tens=1;tens<=9;tens++)for(let units=0;units<=9;units++)
      if(tens+units===11&&tens-units===3)solutions.push(10*tens+units);
    assert.deepEqual(solutions,[74],'unique valid two-digit number');return solutions[0];
  },
  'T-C-04':()=>{
    const matching=[];
    for(let width=1;width<=27;width++){
      const length=27-width;
      if(length===2*width+3)matching.push(width*length);
    }
    assert.deepEqual(matching,[152],'unique positive integer rectangle dimensions');
    return matching[0];
  },
  'T-C-05':()=>200*(1+.20)*(1-.20),
  'T-C-06':()=>{const total=4+3+2;return (4/total)*(3/(total-1))},
  'G-Q-01':()=> (12*40+8*50)/(12+8),
  'G-Q-02':()=> (240/6)*3*18,
  'G-Q-03':()=>{
    // Eliminate y from x+y=25 and 3x=2y.
    const x=25/(1+3/2),y=25-x;
    assert.ok(close(3*x,2*y));return x;
  },
  'G-Q-04':()=> (60/100)*(20)+(40/100)*(35),
  'G-Q-05':()=>{
    const pairs=[];
    for(let n=2;n<168;n+=2)if(n*(n+2)===168)pairs.push([n,n+2]);
    assert.deepEqual(pairs,[[12,14]],'unique consecutive positive even integer pair');
    return pairs[0][0]+pairs[0][1];
  },
  'G-Q-06':()=>960/(30-18)
};
const units={
  'T-C-01':'tickets remaining',
  'T-C-02':'minutes',
  'T-C-03':'two-digit integer',
  'T-C-04':'square metres',
  'T-C-05':'euros',
  'T-C-06':'probability (0 to 1)',
  'G-Q-01':'thousands of euros per employee',
  'G-Q-02':'labels',
  'G-Q-03':'real number x',
  'G-Q-04':'percentage points (overall operating margin)',
  'G-Q-05':'sum of positive even integers',
  'G-Q-06':'units sold'
};

test('all twelve quantitative pilot problems have independent calculations and a declared answer unit',()=>{
  assert.equal(quant.length,12);
  assert.deepEqual(Object.keys(independent).sort(),quant.map(q=>q.id).sort());
  assert.deepEqual(Object.keys(units).sort(),Object.keys(independent).sort());
  assert.equal(quant.filter(q=>q.exam==='tage').length,6);
  assert.equal(quant.filter(q=>q.exam==='gmat').length,6);
  assert.ok(quant.every(q=>q.status==='pilot'));
});
test('each independently calculated value selects exactly one answer in both FR and EN',()=>{
  for(const q of quant){
    const expected=independent[q.id]();
    assert.ok(Number.isFinite(expected),q.id+' yielded a nonfinite result');
    for(const locale of ['fr','en']){
      const values=q.content[locale].choices.map(numericChoice);
      assert.equal(values.length,5,q.id+' '+locale);
      assert.ok(values.every(Number.isFinite),q.id+' '+locale+' invalid numeric answer');
      const matches=values.map((n,i)=>close(n,expected)?i:-1).filter(i=>i!==-1);
      assert.deepEqual(matches,[Number(q.correctAnswer)],q.id+' '+locale+' ambiguous or wrong key');
      assert.equal(new Set(values).size,5,q.id+' '+locale+' duplicate numerical answer');
    }
  }
});
test('critical dimensional and domain conditions hold independently',()=>{
  const q=id=>independent[id]();
  assert.equal(q('T-C-01'),60); // ticket count is an integer
  assert.ok(Number.isInteger(q('T-C-01')));
  assert.equal(q('T-C-02'),120); // time in minutes, not hours
  assert.ok(q('T-C-03')>=10&&q('T-C-03')<=99);
  assert.equal(q('T-C-04'),152); // square metres, not perimeter
  assert.ok(q('T-C-05')<200); // compound % changes do not cancel
  assert.ok(q('T-C-06')>0&&q('T-C-06')<1);
  assert.equal(q('G-Q-01'),44); // thousands of EUR, not EUR
  assert.equal(q('G-Q-02'),2160); // three machines and 18 minutes
  assert.equal(q('G-Q-03'),10);
  assert.equal(q('G-Q-04'),26); // % result, not EUR
  assert.equal(q('G-Q-05'),26);
  assert.equal(q('G-Q-06'),80); // positive whole units
  assert.ok(Number.isInteger(q('G-Q-06')));
});
test('no numeric answer choice accidentally equals another after converting fractions/percentages',()=>{
  for(const item of quant)for(const locale of ['fr','en']){
    const values=item.content[locale].choices.map(numericChoice);
    assert.equal(new Set(values).size,5,item.id+' '+locale+' numeric equivalent distractors');
  }
});
