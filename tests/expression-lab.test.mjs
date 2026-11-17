import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';
import {buildExamQueue,recordAttempt,EMPTY_PROGRESS,nextReviewQuestion} from '../src/engine/adaptive.ts';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='expression-lab');
const expected={
  'T-E-01':{key:'2',text:'Les données que nous avons recueillies hier confirment cette tendance.'},
  'T-E-02':{key:'0',text:"Bien que l'enquête soit limitée, ses résultats méritent d'être examinés."},
  'T-E-03':{key:'4',text:"Certains ateliers ont décalé leur livraison, sans qu'aucun ait annulé sa commande."},
  'T-E-04':{key:'1',text:'Le comité envisage une prolongation éventuelle, sous réserve de résultats trimestriels encourageants.'},
  'T-E-05':{key:'3',text:'La hausse des ventes ne suffit donc pas à conclure à une amélioration du résultat.'},
  'T-E-06':{key:'0',text:'Néanmoins'}
};

test('six TAGE-only original Expression pilots cover three official skill groups',()=>{
  assert.equal(items.length,6);
  assert.ok(items.every(q=>q.exam==='tage'&&q.status==='pilot'&&q.alignment==='skill-practice'));
  const counts=Object.fromEntries([...new Set(items.map(q=>q.competency))].map(skill=>[skill,items.filter(q=>q.competency===skill).length]));
  assert.deepEqual(counts,{'language-correction':2,'faithful-reformulation':2,'discourse-coherence':2});
  assert.equal(bank.filter(q=>q.exam==='gmat'&&q.game==='expression-lab').length,0);
  assert.deepEqual(validateQuestions(),[]);
});

test('Expression answers preserve the French source phrase across localized explanations',()=>{
  for(const q of items){
    const e=expected[q.id];
    assert.ok(e,q.id+' has no independent reference');
    assert.equal(q.correctAnswer,e.key);
    for(const lang of ['fr','en']){
      const c=q.content[lang];
      assert.equal(c.choices.length,5);
      assert.equal(c.choices[Number(q.correctAnswer)],e.text,q.id+' '+lang);
      assert.equal(new Set(c.choices).size,5,q.id+' '+lang+' choices duplicate');
      assert.equal(c.reviewSteps.length,3);
      assert.ok(c.reviewSteps.every(x=>x.length>=40));
      assert.ok(c.explanation.length>65);
    }
  }
});

test('mixed TAGE mini-tests include Expression but GMAT excludes it',()=>{
  for(let variant=0;variant<7;variant++){
    const tage=buildExamQueue(bank,'tage','mixed',6,variant);
    assert.ok(tage.some(q=>q.game==='expression-lab'));
    assert.equal(new Set(tage.map(q=>q.game)).size,6);
    const gmat=buildExamQueue(bank,'gmat','mixed',6,variant);
    assert.ok(gmat.every(q=>q.game!=='expression-lab'));
  }
});

test('Expression wrong answers enter review and correct retries remove them',()=>{
  const q=items[0];
  const wrong=recordAttempt(EMPTY_PROGRESS,q,false);
  assert.equal(nextReviewQuestion(bank,wrong,'tage',[])?.id,q.id);
  assert.equal(nextReviewQuestion(bank,wrong,'gmat',[]),null);
  assert.deepEqual(recordAttempt(wrong,q,true).pendingReviewIds,[]);
});
