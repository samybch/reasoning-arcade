import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const questions=catalog.filter(q=>q.game==='expression-lab');
const byId=id=>{const result=questions.find(q=>q.id===id);assert.ok(result,id);return result};
const uniqueCorrect=(q,predicate)=>{
  for(const lang of ['fr','en']){
    const choices=q.content[lang].choices;
    assert.deepEqual(choices,q.content.fr.choices,q.id+' must preserve the exact French language exercise in EN');
    const valid=choices.flatMap((choice,i)=>predicate(choice)?[i]:[]);
    assert.deepEqual(valid,[Number(q.correctAnswer)],q.id+' '+lang+' ambiguous choice under stated rule');
  }
};

// Syntactic checks are narrowly scoped to the actual five choices. They do not
// purport to implement a general French parser or settle contested French usage.
test('six original TAGE-only bilingual Expression Lab pilots have distinct prompts and keys',()=>{
  assert.deepEqual(questions.map(q=>q.id),['T-E-01','T-E-02','T-E-03','T-E-04','T-E-05','T-E-06']);
  assert.equal(questions.length,6);
  assert.ok(questions.every(q=>q.exam==='tage'&&q.status==='pilot'));
  for(const q of questions)for(const lang of ['fr','en']){
    assert.equal(q.content[lang].choices.length,5);
    assert.equal(q.content[lang].reviewSteps.length,3);
  }
});
test('T-E-01: past participle preceding-object agreement and plural finite verb are both required',()=>{
  const q=byId('T-E-01');
  const satisfies=sentence=>/\brecueillies\b/u.test(sentence)&&/\bconfirment\b/u.test(sentence);
  uniqueCorrect(q,satisfies);
  assert.match(q.content.fr.context,/recueilli hier/);
  assert.match(q.content.en.explanation,/past participle/u);
});
test('T-E-02: conjunctive mood, verbal agreement and verbal complement must all be valid',()=>{
  const q=byId('T-E-02');
  // Only standard, uncontroversial concessive "bien que ... soit" is accepted
  // in this item; "malgré que" needs separate independent usage review.
  const satisfies=sentence=>/^Bien que l'enquête soit limitée,/u.test(sentence)
    &&/ses résultats méritent d'être examinés\.$/u.test(sentence);
  uniqueCorrect(q,satisfies);
  assert.match(q.content.fr.explanation,/subjonctif/u);
});
test('T-E-03: a finite truth-table rejects shifts in quantifiers and cancellation claims',()=>{
  const q=byId('T-E-03');
  // Original: at least one workshop deferred and NO workshop canceled.
  // The selected paraphrase must be true in all worlds matching the original.
  const worlds=[];
  for(let postponed=0;postponed<8;postponed++)for(let cancelled=0;cancelled<8;cancelled++){
    if(postponed===0||cancelled!==0)continue;
    worlds.push({postponed,cancelled});
  }
  assert.equal(worlds.length,7);
  const candidates=[
    w=>w.postponed===7&&w.cancelled===7,
    w=>[3,5,6,7].includes(w.postponed)&&w.cancelled!==0,
    w=>[1,2,4].includes(w.postponed)&&w.cancelled===7,
    w=>w.postponed===0&&w.cancelled!==0,
    w=>w.postponed!==0&&w.cancelled===0
  ];
  const entailed=candidates.flatMap((p,i)=>worlds.every(p)?[i]:[]);
  assert.deepEqual(entailed,[Number(q.correctAnswer)]);
  uniqueCorrect(q,choice=>/Certains ateliers ont décalé leur livraison, sans qu'aucun ait annulé sa commande\./u.test(choice));
});
test('T-E-04: conditional possibility must not be replaced with certainty, refusal or inverted conditions',()=>{
  const q=byId('T-E-04');
  // "Does not rule out" expresses possibility only; the goal of the
  // paraphrase is to preserve modality and the condition, not to infer an act.
  const satisfies=choice=>/\benvisage une prolongation éventuelle\b/u.test(choice)
    &&/\bsous réserve de résultats trimestriels encourageants\b/u.test(choice);
  uniqueCorrect(q,satisfies);
  assert.match(q.content.fr.context,/n'exclut pas/u);
  assert.match(q.content.fr.context,/ si les résultats/u);
  assert.ok(!q.content.fr.choices[Number(q.correctAnswer)].includes('garant'));
});
test('T-E-05: rate growth does not entail profit improvement without starting amounts',()=>{
  const q=byId('T-E-05');
  const counterexamples=[
    {sales:100,costs:10,rs:.10,rc:.20},
    {sales:100,costs:90,rs:.10,rc:.20}
  ];
  const newProfit=w=>w.sales*(1+w.rs)-w.costs*(1+w.rc);
  const oldProfit=w=>w.sales-w.costs;
  assert.ok(counterexamples.every(w=>w.rs>0&&w.rc>w.rs));
  assert.ok(newProfit(counterexamples[0])>oldProfit(counterexamples[0]),'profit may increase');
  assert.ok(newProfit(counterexamples[1])<oldProfit(counterexamples[1]),'profit may decrease');
  uniqueCorrect(q,choice=>/hausse des ventes ne suffit donc pas à conclure à une amélioration du résultat/u.test(choice));
});
test('T-E-06: the discourse transition introduces a concession rather than a false cause',()=>{
  const q=byId('T-E-06');
  assert.match(q.content.fr.context,/Les usagers saluent cette souplesse/u);
  assert.match(q.content.fr.context,/coût de fonctionnement devra être surveillé/u);
  uniqueCorrect(q,choice=>choice==='Néanmoins');
  assert.match(q.content.fr.explanation,/réserve/u);
});
