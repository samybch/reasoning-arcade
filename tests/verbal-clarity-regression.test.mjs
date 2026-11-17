import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const ledger=JSON.parse(readFileSync(new URL('../docs/editorial-review-ledger.json',import.meta.url),'utf8'));
const get=id=>catalog.find(q=>q.id===id);

test('T-A-02 asks for a methodological check, not a logically necessary premise in either locale',()=>{
  const q=get('T-A-02');
  assert.equal(q.correctAnswer,'3');
  assert.match(q.content.fr.prompt,/vérifier en priorité/u);
  assert.match(q.content.en.prompt,/checked first/u);
  assert.doesNotMatch(q.content.fr.prompt,/hypothèse.*nécessaire/iu);
  assert.doesNotMatch(q.content.en.prompt,/necessary assumption/iu);
  assert.match(q.content.fr.reviewSteps.at(-1),/ne suppose pas/u);
  assert.match(q.content.en.reviewSteps.at(-1),/does not assume/u);
  assert.match(q.content.fr.choices[3],/représentent raisonnablement/u);
  assert.match(q.content.en.choices[3],/reasonably represent/u);
});

test('G-R-09 key follows the passage without asserting equal levels of transparency',()=>{
  const q=get('G-R-09');
  assert.equal(q.correctAnswer,'1');
  assert.match(q.content.en.context,/publish reports while allowing reviewers to remain anonymous/u);
  assert.match(q.content.fr.context,/publient les rapports mais permettent aux évaluateurs de rester anonymes/u);
  assert.match(q.content.en.choices[1],/public without revealing the reviewers' identities/u);
  assert.match(q.content.fr.choices[1],/rendus publics sans que l'identité des évaluateurs soit révélée/u);
  assert.doesNotMatch(q.content.en.choices[1],/equally open/u);
  assert.doesNotMatch(q.content.fr.choices[1],/également transparents/u);
  for(const lang of ['fr','en']){
    assert.equal(q.content[lang].choices.length,5);
    assert.equal(q.content[lang].reviewSteps.length,3);
  }
});

test('clarified items remain pilot and pending independent editorial review',()=>{
  for(const id of ['T-A-02','G-R-09']){
    const item=get(id);
    const entry=ledger.entries.find(e=>e.id===id);
    assert.equal(item.status,'pilot');
    assert.equal(entry.decision,'pending');
    assert.equal(entry.reviewer,null);
    assert.equal(entry.reviewedAt,null);
    assert.equal(entry.referenceKey,item.correctAnswer);
    assert.ok(entry.reviewFocus.length>=100);
  }
  assert.equal(catalog.length,94);
  assert.ok(catalog.every(q=>q.status==='pilot'));
  assert.ok(ledger.entries.every(entry=>entry.decision==='pending'));
});
