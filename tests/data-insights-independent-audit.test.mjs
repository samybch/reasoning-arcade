import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// All mathematical expectations below are calculated from the published data or
// independently specified source constraints, never from the stored answer key.
const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const find=id=>{const q=bank.find(q=>q.id===id);assert.ok(q,id);return q};
const numeric=(value)=>{
  const s=String(value).replace(/\s/g,'').replace(/[%€]/g,'').replace(/[^0-9.,-]/g,'').replace(',','.');
  return Number(s);
};
const indexFor=(items,expected)=>{
  const hits=items.map((item,i)=>(typeof expected==='string'?item===expected:numeric(item)===expected)?i:-1).filter(i=>i!==-1);
  assert.equal(hits.length,1,'expected one numeric answer for '+expected+'; got '+JSON.stringify(items));
  return hits[0];
};
const rowsBy=(q)=>Object.fromEntries(q.table.rows.map(row=>[row[0],row.slice(1).map(Number)]));
const tables={
  'G-T-01':(q)=>{
    const r=rowsBy(q),all=Object.values(r);
    return [
      r.West[0]===Math.max(...all.map(x=>x[0])),
      all.every(x=>x[1]/x[0]<.25),
      r.North[0]+r.East[0]>r.West[0]
    ];
  },
  'G-T-02':(q)=>{
    const r=rowsBy(q),all=Object.values(r);
    const incidents=all.map(x=>x[1]).sort((a,b)=>a-b);
    return [
      r.P4[0]===Math.min(...all.map(x=>x[0])),
      incidents[Math.floor(incidents.length/2)]===11,
      all.filter(x=>x[2]<=10).length>=2
    ];
  },
  'G-T-03':(q)=>{
    const r=rowsBy(q),all=Object.values(r);
    return [
      r.D[0]>r.B[0],
      r.A[1]/r.A[0]===r.E[1]/r.E[0],
      r.C[2]===Math.max(...all.map(x=>x[2]))
    ];
  }
};
test('three Table Lab keys are recomputed from numeric rows, including strict boundary comparisons',()=>{
  assert.equal(Object.keys(tables).length,3);
  for(const [id,calculate] of Object.entries(tables)){
    const q=find(id);
    assert.equal(q.game,'table-lab');
    const truth=calculate(q);
    const key=truth.map(v=>v?'Y':'N').join('');
    assert.equal(q.correctAnswer,key,id);
    assert.equal(q.content.fr.tableStatements.length,3);
    assert.equal(q.content.en.tableStatements.length,3);
  }
  const first=find('G-T-01');
  assert.equal(rowsBy(first).West[1]/rowsBy(first).West[0],.25,'strictly below 25% must exclude equality');
  assert.equal(rowsBy(find('G-T-03')).A[1]/rowsBy(find('G-T-03')).A[0],.05);
});
test('all three Graph Lab paired answers derive uniquely from the chart values in both languages',()=>{
  const calculations={
    'G-I-01':({A,B,C,D})=>[Object.entries({A,B,C,D}).sort((x,y)=>y[1]-x[1])[0][0],D-B],
    'G-I-02':({Q1,Q2,Q3,Q4})=>[100*Q4/Q2,Q3-Q1],
    'G-I-03':({N,S,E,W})=>[N+W,[N,S,E,W].filter(x=>x>45).length]
  };
  for(const [id,calculate] of Object.entries(calculations)){
    const q=find(id),values=Object.fromEntries(q.graph.labels.map((name,i)=>[name,q.graph.values[i]]));
    const [first,second]=calculate(values);
    const correct=q.correctAnswer.split('|').map(Number);
    for(const locale of ['fr','en']){
      const statements=q.content[locale].graphicStatements;
      assert.deepEqual([indexFor(statements[0].options,first),indexFor(statements[1].options,second)],correct,id+' '+locale);
    }
  }
  assert.equal(find('G-I-03').graph.values.at(-1),45,'strict count excludes the boundary');
});
test('three Two-Part Lab paired answers solve independent algebraic constraints, with unique options in FR/EN',()=>{
  const solutions={
    'G-P-01':()=>{const total=120,ratio=2;const b=total/(ratio+1);return [total-b,b]},
    'G-P-02':()=>{const fixed=240,contribution=8;return [fixed/contribution,(fixed+160)/contribution]},
    'G-P-03':()=>[600*12/100,400*8/100]
  };
  for(const [id,calculate] of Object.entries(solutions)){
    const q=find(id);
    const [first,second]=calculate();
    assert.ok(Number.isInteger(first)&&Number.isInteger(second),id+' quantities require whole units');
    for(const locale of ['fr','en']){
      const options=q.content[locale].choices;
      const expected=[indexFor(options,first),indexFor(options,second)];
      assert.deepEqual(q.correctAnswer.split('|').map(Number),expected,id+' '+locale);
      assert.equal(q.content[locale].twoPartHeaders.length,2);
    }
  }
});
test('three Multi-Source Lab answers agree with independently calculated observed rates and temporary budgets',()=>{
  const baseline={
    North:{onTime:92,total:100,cost:4000},
    South:{onTime:60,total:80,cost:3000},
    Remote:{onTime:34,total:40,cost:2200}
  };
  const rates=Object.fromEntries(Object.entries(baseline).map(([name,data])=>[name,100*data.onTime/data.total]));
  assert.deepEqual(rates,{North:92,South:75,Remote:85});
  const leader=Object.entries(rates).sort((a,b)=>b[1]-a[1])[0];
  const software=600,allowance=200,cap=3500,allowanceMonths=3;
  const supported=baseline.South.cost+software-allowance;
  const unsupported=baseline.South.cost+software;
  assert.equal(supported,3400);assert.equal(unsupported,3600);
  assert.ok(supported<=cap&&unsupported>cap);
  const projected=100*72/baseline.South.total;
  assert.equal(projected,90);
  // Explicitly bind source-embedded observations to independently derived facts.
  for(const id of ['G-M-01','G-M-02','G-M-03']){
    const q=find(id);
    for(const locale of ['fr','en']){
      const sources=q.content[locale].sources;
      assert.equal(sources.length,3);
      assert.ok(sources[0].body.includes('100')&&sources[0].body.includes('92')&&sources[0].body.includes('80')&&sources[0].body.includes('60')&&sources[0].body.includes('40')&&sources[0].body.includes('34'),id+' '+locale+' observations changed');
      assert.ok(sources[1].body.includes('600')||sources[1].body.includes('600 €'),id+' '+locale+' software cost changed');
      assert.ok(sources[2].body.includes('200'),id+' '+locale+' temporary support changed');
    }
  }
  const q1=find('G-M-01'),q2=find('G-M-02'),q3=find('G-M-03');
  assert.equal(q1.correctAnswer,'2');
  for(const locale of ['fr','en'])assert.ok(q1.content[locale].choices[2].includes(leader[0])&&q1.content[locale].choices[2].includes(String(leader[1])));
  assert.equal(q2.correctAnswer,'0');
  for(const locale of ['fr','en'])assert.ok(q2.content[locale].choices[0].includes('3 400')||q2.content[locale].choices[0].includes('3,400'));
  assert.equal(q3.correctAnswer,'4');
  for(const locale of ['fr','en'])assert.ok(q3.content[locale].choices[4].includes(String(projected)));
  assert.equal(allowanceMonths,3);
});
test('four Data Insights game types contain exactly twelve still-unapproved pilot items',()=>{
  const games=['table-lab','multi-source-lab','graphics-lab','two-part-lab'];
  const selected=bank.filter(q=>games.includes(q.game));
  assert.equal(selected.length,12);
  for(const game of games)assert.equal(selected.filter(q=>q.game===game).length,3,game);
  assert.ok(selected.every(q=>q.status==='pilot'&&q.exam==='gmat'));
});
