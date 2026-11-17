import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const questions=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const verbal=questions.filter(q=>['reading-lab','argument-lab'].includes(q.game));
const reading=verbal.filter(q=>q.game==='reading-lab');
const argument=verbal.filter(q=>q.game==='argument-lab');

// Curated evidence anchors are intentionally *not* derived from keys or explanations.
// They bind the claim's source context and the intended answer's meaning to a
// human-readable anchor. Presence is mechanical, not proof of logical entailment.
// [English passage, French passage, English correct option, French correct option]
const evidence={
'T-A-01':['new benches','nouveaux bancs','free festival','festival gratuit'],
'T-A-02':['magazine’s subscribers','abonnés d’une revue','represent the city','représentent raisonnablement'],
'T-A-03':['speaks Spanish','parlent espagnol','Some students speak Spanish','Certains étudiants parlent espagnol'],
'T-A-04':['Stores open late','magasins ouverts tard','correlation with causation','corrélation et causalité'],
'T-A-05':['randomly assigns','tirage au sort','same examination','même examen'],
'T-A-06':['who use the app','utilisent l’application','do not use the app','n’utilisent pas l’application'],
'G-A-07':['complaints fell','réclamations diminuait','late deliveries','livraison tardive'],
'G-A-08':['four-day week','semaine de quatre jours','automated machinery','machines automatisées'],
'G-A-09':['turnover costs','coûts liés au départ','exceed the added training costs','dépasseront le coût supplémentaire'],
'G-A-10':['laboratory access permit','autorisation','completed safety training','suivi la formation de sécurité'],
'G-A-11':['bus ridership rose','fréquentation a augmenté','subway line was closed','ligne de métro était fermée'],
'G-A-12':['one climate','climat','may not generalize','pas forcément généralisables'],
'T-R-01':['campus opened nearby','campus universitaire a ouvert','does not by itself establish','ne suffisent pas à attribuer'],
'T-R-02':['decline in daytime visits','visites en journée ont légèrement diminué','shifted','auparavant effectuées en journée'],
'T-R-03':['comparing trends with a nearby library','comparer les évolutions avec celles','comparison','point de comparaison'],
'T-R-04':['installed simultaneously','mis en place simultanément','runoff fell','baisse du ruissellement'],
'T-R-05':['retention basin','bassin de rétention','retention basin','bassin de rétention'],
'T-R-06':['did not prove the planting was useless','ne prouve nullement','does not prove','ne signifie pas prouver'],
'T-R-07':['curators','conservateurs','curator labels','conservateurs'],
'T-R-08':['additional editorial work','travail éditorial supplémentaire','practical limitation','limite pratique'],
'T-R-09':['optional space','espace facultatif','Distinguish verifiable information','Séparer clairement les données vérifiables'],
'G-R-01':['independent reviewer recommends','évaluatrice indépendante propose','better-controlled evaluation','évaluation mieux contrôlée'],
'G-R-02':['volunteered','volontaires','Simultaneous changes','changements simultanés'],
'G-R-03':['staged rollout','déployer progressivement','compare similar lines','Comparer des lignes semblables'],
'G-R-04':['neighboring bay','baie voisine','restrictions may have helped','restrictions pourraient avoir contribué'],
'G-R-05':['10% increase in a neighboring bay','hausse de 10 % dans une baie voisine','other than the new restrictions','ne sont pas propres aux nouvelles restrictions'],
'G-R-06':['across several seasons','sur plusieurs saisons','over several seasons','sur plusieurs saisons'],
'G-R-07':['assessed against its stated aims','selon ses objectifs annoncés','Measured and analytical','Nuancé et analytique'],
'G-R-08':['does not by itself establish the quality','ne renseigne pas à lui seul sur la solidité','ability to inspect reasoning','possibilité de vérifier un raisonnement'],
'G-R-09':['publish reports while allowing reviewers to remain anonymous','publient les rapports mais permettent aux évaluateurs de rester anonymes','protect reviewer identities','protection de']
};
const contains=(text,phrase)=>text.toLocaleLowerCase().includes(phrase.toLocaleLowerCase());
test('30 verbal items have explicit bilingual evidence anchors, not automated review approvals',()=>{
  assert.equal(argument.length,12);
  assert.equal(reading.length,18);
  assert.equal(verbal.length,30);
  assert.deepEqual(Object.keys(evidence).sort(),verbal.map(q=>q.id).sort());
  assert.ok(verbal.every(q=>q.status==='pilot'));
  for(const q of verbal){
    const [enContext,frContext,enAnswer,frAnswer]=evidence[q.id];
    for(const [lang,contextAnchor,answerAnchor] of [['en',enContext,enAnswer],['fr',frContext,frAnswer]]){
      const item=q.content[lang];
      assert.ok(contains(item.context,contextAnchor),q.id+' '+lang+' no longer presents the recorded evidence: '+contextAnchor);
      assert.ok(contains(item.choices[Number(q.correctAnswer)],answerAnchor),q.id+' '+lang+' correct choice has lost recorded meaning: '+answerAnchor);
      assert.ok(item.reviewSteps.length===3,q.id+' '+lang+' reasoning stages missing');
    }
  }
});

test('reading passages are six independent FR/EN source pairs, three questions each',()=>{
  const groups=new Map();
  for(const q of reading){
    const group=q.id.slice(0,3)+Math.floor((Number(q.id.slice(-2))-1)/3);
    const siblings=groups.get(group)??[];
    siblings.push(q);groups.set(group,siblings);
  }
  assert.equal(groups.size,6);
  for(const items of groups.values()){
    assert.equal(items.length,3);
    for(const lang of ['fr','en']){
      assert.equal(new Set(items.map(q=>q.content[lang].context)).size,1,'questions sharing a passage must show identical text');
      assert.equal(new Set(items.map(q=>q.content[lang].prompt)).size,3,'all three questions require distinct prompts');
    }
  }
});
test('deductive Argument Lab conclusions survive finite logical countermodel search',()=>{
  // T-A-03: every club member speaks Spanish, some students are club members.
  // Enumerate all binary memberships and Spanish skills for three persons.
  // A valid conclusion must follow in *every* world that satisfies both premises.
  let tModels=0;
  for(let bits=0;bits<2**9;bits++){
    const members=[0,1,2].map(i=>Boolean(bits&(1<<i)));
    const students=[0,1,2].map(i=>Boolean(bits&(1<<(i+3))));
    const spanish=[0,1,2].map(i=>Boolean(bits&(1<<(i+6))));
    if(!members.every((m,i)=>!m||spanish[i])||!members.some((m,i)=>students[i]))continue;
    tModels++;
    assert.ok(students.some((s,i)=>s&&spanish[i]),'T-A-03 conclusion countermodel');
  }
  assert.ok(tModels>0);
  // G-A-10: permit -> safety training; Dana has permit.
  let gModels=0;
  for(const permit of [false,true])for(const training of [false,true]){
    if((permit&&!training)||!permit)continue;
    gModels++;assert.equal(training,true,'G-A-10 conclusion countermodel');
  }
  assert.ok(gModels>0);
  assert.equal(questions.find(q=>q.id==='T-A-03').correctAnswer,'2');
  assert.equal(questions.find(q=>q.id==='G-A-10').correctAnswer,'1');
});
