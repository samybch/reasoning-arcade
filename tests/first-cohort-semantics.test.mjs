import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_REVIEW_BATCH} from '../scripts/review-batch.mjs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const ledger=JSON.parse(readFileSync(new URL('../docs/editorial-review-ledger.json',import.meta.url),'utf8'));
const byId=new Map(bank.map(q=>[q.id,q]));
const get=id=>{const q=byId.get(id);assert.ok(q,id);return q};

test('all 16 first-cohort source items remain bilingual pilots with pending independent approvals',()=>{
  assert.equal(FIRST_REVIEW_BATCH.length,16);
  assert.equal(new Set(FIRST_REVIEW_BATCH).size,16);
  for(const id of FIRST_REVIEW_BATCH){
    const q=get(id),entry=ledger.entries.find(e=>e.id===id);
    assert.ok(entry,id+' missing review record');
    assert.equal(q.status,'pilot',id);
    assert.equal(entry.decision,'pending',id);
    assert.equal(entry.reviewer,null,id);
    assert.equal(entry.reviewedAt,null,id);
    assert.equal(entry.referenceKey,q.correctAnswer,id);
    assert.ok(entry.reviewFocus.length>60,id+' has no meaningful human review guidance');
    for(const lang of ['fr','en']){
      assert.ok(q.content[lang].prompt.length>10,id+' '+lang);
      assert.equal(q.content[lang].reviewSteps.length,3,id+' '+lang);
    }
  }
  assert.equal(bank.length,94);
});

test('T-L-01 explicitly constrains the elementary recurrence to a fixed multiplier',()=>{
  const q=get('T-L-01');
  assert.match(q.content.fr.prompt,/multipliant le précédent par un même nombre/u);
  assert.match(q.content.en.prompt,/same number/u);
  for(const lang of ['fr','en']){
    const sequence=(q.content[lang].context.match(/\d+/gu)||[]).map(Number);
    assert.deepEqual(sequence,[2,4,8,16]);
    const ratios=sequence.slice(1).map((n,i)=>n/sequence[i]);
    assert.deepEqual(ratios,[2,2,2]);
    const next=sequence.at(-1)*ratios[0];
    assert.equal(next,32);
    assert.deepEqual(q.content[lang].choices.flatMap((value,i)=>Number(value)===next?[i]:[]),[Number(q.correctAnswer)]);
  }
});

test('T-E-02 does not use contested malgré que as the exclusive grammar discriminator',()=>{
  const q=get('T-E-02');
  assert.equal(q.correctAnswer,'0');
  for(const lang of ['fr','en']){
    const choices=q.content[lang].choices;
    assert.equal(choices.length,5);
    assert.equal(choices[0],"Bien que l'enquête soit limitée, ses résultats méritent d'être examinés.");
    assert.match(choices[1],/^Malgré l'enquête soit limitée,/u);
    assert.ok(choices.every(c=>!c.includes('Malgré que ')),lang+' contested variant still appears');
    assert.equal(choices.filter(c=>c===choices[0]).length,1);
  }
  assert.deepEqual(q.content.en.choices,q.content.fr.choices,'French-language options must be the same in EN learning interface');
});

test('G-A-09 states the constant-other-cost condition for its strictly necessary savings inequality',()=>{
  const q=get('G-A-09');
  assert.equal(q.correctAnswer,'3');
  assert.match(q.content.fr.context,/autres postes de coûts restent inchangés/u);
  assert.match(q.content.en.context,/other cost categories remain unchanged/u);
  const trainingCost=100;
  const cases=[0,50,100,101,200].map(savings=>({savings,netChange:trainingCost-savings}));
  assert.deepEqual(cases.filter(c=>c.netChange<0).map(c=>c.savings),[101,200]);
  assert.equal(cases.find(c=>c.savings===100).netChange,0,'equal savings cannot imply a reduction');
  assert.match(q.content.fr.choices[3],/dépasseront le coût/u);
  assert.match(q.content.en.choices[3],/exceed the added training costs/u);
});

test('G-T-03 defines an exhaustive shipped/delivered/in-transit snapshot and a shared denominator',()=>{
  const q=get('G-T-03');
  assert.equal(q.correctAnswer,'YYN');
  const cells=Object.fromEntries(q.table.rows.map(([name,total,late,onTime])=>[
    name,{total:Number(total),late:Number(late),onTime:Number(onTime)}
  ]));
  for(const [name,row] of Object.entries(cells)){
    assert.ok(row.total>0&&row.late>=0&&row.onTime>=0,name);
    const inTransit=row.total-row.late-row.onTime;
    assert.ok(inTransit>=0,name+' cannot have more delivered than dispatched');
    assert.ok(inTransit>0,name+' must actually have a not-yet-delivered category');
  }
  const expected=[
    cells.D.total>cells.B.total,
    cells.A.late/cells.A.total===cells.E.late/cells.E.total,
    cells.C.onTime===Math.max(...Object.values(cells).map(r=>r.onTime))
  ];
  assert.deepEqual(expected,[true,true,false]);
  assert.equal(expected.map(b=>b?'Y':'N').join(''),q.correctAnswer);
  for(const lang of ['fr','en']){
    const content=q.content[lang];
    assert.match(content.context,/transit/u);
    assert.match(content.tableStatements[1],lang==='fr'?/colis expédiés/u:/dispatched parcels/u);
    assert.match(content.context,lang==='fr'?/déjà livrés/u:/already delivered/u);
    assert.equal(content.tableStatements.length,3);
  }
});
