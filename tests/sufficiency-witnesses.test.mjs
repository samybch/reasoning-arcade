import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';

// Finite counterexample models test the *semantics* of statement sufficiency.
// Ambiguity is proved constructively by two worlds with the same available
// statement(s) and different answers; finite sampling alone cannot prove
// universal sufficiency, so human editorial review is still mandatory.
const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const sufficient=bank.filter(q=>q.game==='enough-info');
const cartesian=(...sets)=>sets.reduce((products,items)=>products.flatMap(prefix=>items.map(item=>[...prefix,item])),[[]]);
const numberSet=values=>new Set(values.map(v=>JSON.stringify(v)));
const fixtures={
  'T-D-01':{worlds:[-4,-2,0,2,4,6,8,10,12].map(x=>({x})),one:w=>w.x+3===11,two:w=>Number.isInteger(w.x)&&w.x%2===0,answer:w=>w.x},
  'T-D-02':{worlds:[-2,0,2,4,8,10].map(x=>({x})),one:w=>w.x>0,two:w=>2*w.x===16,answer:w=>w.x},
  'T-D-03':{worlds:cartesian([0,2,4,6,8,10],[0,2,4,6,8,10]).map(([x,y])=>({x,y})),one:w=>w.x+w.y===10,two:w=>w.y===4,answer:w=>w.x},
  'T-D-04':{worlds:[1,3,5,7].map(x=>({x})),one:w=>w.x*w.x===25,two:w=>w.x-2===3,answer:w=>w.x},
  'T-D-05':{worlds:[-2,0,4,5,6,7,8,10].map(n=>({n})),one:w=>w.n>4,two:w=>w.n<8,answer:w=>w.n%2===0},
  'T-D-06':{worlds:[-4,-3,-2,-1,0,1].map(x=>({x})),one:w=>w.x<0,two:w=>3*w.x+6===0,answer:w=>w.x},
  'G-D-07':{worlds:[1,2,7,8,9].map(x=>({x})),one:w=>w.x*w.x===49,two:w=>3*w.x===21,answer:w=>w.x},
  'G-D-08':{worlds:[-2,-1,1,2].map(x=>({x})),one:w=>w.x**3>0,two:w=>w.x*w.x===4,answer:w=>w.x>0},
  'G-D-09':{worlds:cartesian([1,2,8,10],[2,5,10]).map(([n,p])=>({n,p})),one:w=>w.n===8,two:w=>w.p===5,answer:w=>w.n*w.p},
  'G-D-10':{worlds:[-4,-3,-2,-1,1,2,3,4].map(x=>({x})),one:w=>w.x*w.x===9,two:w=>w.x<0,answer:w=>w.x},
  'G-D-11':{worlds:[3,6,9,12,18,27,30].map(n=>({n})),one:w=>w.n%6===0,two:w=>w.n%9===0,answer:w=>w.n%3===0},
  'G-D-12':{worlds:[-1,0.5,1,1.5,2.5].map(x=>({x})),one:w=>w.x>0,two:w=>w.x<2,answer:w=>w.x>1},
  'G-D-13':{worlds:[[1,2,3,4,1000],[110,120,130,140,150],[1,2,3,120,130],[10,20,30,40,800],[90,95,105,110,120]].map(a=>({a})),
    one:w=>w.a.filter(x=>x>100).length>=3,two:w=>w.a.reduce((a,b)=>a+b,0)/5>100,answer:w=>w.a[2]>100},
  'G-D-14':{worlds:cartesian([60,120,240],[50,100,200],[600,1200,2400],[500,1000,2000]).map(([ao,mo,av,mv])=>({ao,mo,av,mv})),
    one:w=>w.ao===120&&w.mo===100,two:w=>w.av===2400&&w.mv===1000,answer:w=>w.ao/w.av<w.mo/w.mv},
  'G-D-15':{worlds:cartesian([100,200,400],[100,200,400],[.2,.4,.6],[.2,.4,.6]).map(([d1,d2,r1,r2])=>({d1,d2,r1,r2})),
    one:w=>w.d2>w.d1,two:w=>w.r2>w.r1,answer:w=>w.d2*w.r2>w.d1*w.r1},
  'G-D-16':{worlds:[[2,2],[1,3],[1,1,1],[0,1,2]].map(a=>({a})),
    one:w=>new Set(w.a).size>1,two:w=>Math.max(...w.a)-Math.min(...w.a)>0,answer:w=>new Set(w.a).size>1}
};
function summarize(fixture,subset){
  const valid=fixture.worlds.filter(w=>subset.every(predicate=>predicate(w)));
  return {valid,distinct:numberSet(valid.map(fixture.answer)).size};
}
test('all 16 TAGE/GMAT sufficiency questions have independent model fixtures',()=>{
  assert.equal(sufficient.length,16);
  assert.deepEqual(Object.keys(fixtures).sort(),sufficient.map(q=>q.id).sort());
  assert.deepEqual(validateQuestions(),[]);
});
test('each insufficiency claim has two concrete same-statements worlds with different outcomes',()=>{
  for(const q of sufficient){
    const f=fixtures[q.id];
    const cases=[['first',f.one,q.sufficiency.first],['second',f.two,q.sufficiency.second],['together',w=>f.one(w)&&f.two(w),q.sufficiency.together]];
    for(const [label,predicate,flag] of cases){
      const matching=f.worlds.filter(predicate);
      assert.ok(matching.length>0,`${q.id} ${label}: no feasible model world`);
      const groups=new Map();
      for(const world of matching){const outcome=JSON.stringify(f.answer(world));if(!groups.has(outcome))groups.set(outcome,world)}
      if(flag){
        // Necessary sanity check over finite witnesses, NOT a universal proof.
        assert.equal(groups.size,1,`${q.id} ${label}: sampled counterexample to claimed sufficiency`);
      }else{
        assert.ok(groups.size>=2,`${q.id} ${label}: missing independent ambiguity witnesses`);
        const examples=[...groups.values()].slice(0,2);
        assert.notDeepEqual(f.answer(examples[0]),f.answer(examples[1]),`${q.id} ${label}: unconvincing witnesses`);
      }
    }
    const proof=q.sufficiency;
    const expected=proof.first&&proof.second?'D':proof.first?'A':proof.second?'B':proof.together?'C':'E';
    assert.equal(q.correctAnswer,expected,`${q.id}: semantic result differs from source key`);
  }
});
test('representative counterexamples cover the distinct logical outcomes, including zero and negative values',()=>{
  assert.deepEqual(summarize(fixtures['T-D-05'],[fixtures['T-D-05'].one,fixtures['T-D-05'].two]).distinct,2);
  assert.deepEqual(summarize(fixtures['G-D-12'],[fixtures['G-D-12'].one,fixtures['G-D-12'].two]).distinct,2);
  assert.equal(summarize(fixtures['G-D-15'],[fixtures['G-D-15'].one,fixtures['G-D-15'].two]).distinct,1);
  assert.equal(summarize(fixtures['G-D-14'],[fixtures['G-D-14'].one,fixtures['G-D-14'].two]).distinct,1);
});
