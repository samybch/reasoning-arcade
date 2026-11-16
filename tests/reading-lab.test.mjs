import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='reading-lab');
const answerEvidence={
  'T-R-01':{key:'2',fr:"Les résultats de l'essai",en:'The trial does not'},
  'T-R-02':{key:'3',fr:'Une partie des visites',en:'Some evening visits'},
  'T-R-03':{key:'1',fr:"Pour disposer d'un point",en:'To provide a comparison'},
  'T-R-04':{key:'0',fr:'Une baisse du ruissellement',en:'Runoff fell'},
  'T-R-05':{key:'4',fr:'Une rue similaire dotée',en:'A similar street with only'},
  'T-R-06':{key:'2',fr:'Ne pas pouvoir prouver',en:'Failure to isolate'},
  'G-R-01':{key:'3',fr:'Le système peut être utile',en:'The system may be useful'},
  'G-R-02':{key:'1',fr:'Plusieurs changements simultanés',en:'Simultaneous changes'},
  'G-R-03':{key:'2',fr:'Comparer des lignes semblables',en:'To compare similar lines'},
  'G-R-04':{key:'0',fr:'Les restrictions pourraient',en:'Fishing restrictions may'},
  'G-R-05':{key:'4',fr:'Des facteurs qui ne sont pas',en:'Factors other than'},
  'G-R-06':{key:'2',fr:'Des séries comparables',en:'Comparable data'}
};
test('twelve Reading Lab pilot keys preserve passage-grounded bilingual answer meaning',()=>{
  assert.equal(items.length,12);
  for(const q of items){
    const evidence=answerEvidence[q.id];
    assert.ok(evidence,'No reference key for '+q.id);
    assert.equal(q.correctAnswer,evidence.key,q.id+' changed answer index');
    assert.equal(q.status,'pilot');
    assert.equal(q.alignment,'skill-practice');
    for(const locale of ['fr','en']){
      const c=q.content[locale];
      assert.ok(c.choices[Number(q.correctAnswer)].includes(evidence[locale]),q.id+': '+locale+' changed answer meaning');
      assert.equal(new Set(c.choices.map(s=>s.toLowerCase())).size,5,q.id+': duplicate distractor');
      assert.equal(c.reviewSteps.length,3);
      assert.ok(c.reviewSteps.every(s=>s.trim().length>=40));
      assert.ok(c.context.trim().length>=350);
    }
  }
});
test('four original bilingual passages are reused consistently in three-question groups',()=>{
  for(const exam of ['tage','gmat']){
    const group=items.filter(q=>q.exam===exam);
    assert.equal(group.length,6);
    for(const locale of ['fr','en']){
      const distinct=new Set(group.map(q=>q.content[locale].context));
      assert.equal(distinct.size,2,exam+': '+locale+' passage count');
      const counts=[...distinct].map(p=>group.filter(q=>q.content[locale].context===p).length);
      assert.deepEqual(counts.sort((a,b)=>a-b),[3,3],exam+': '+locale+' grouping');
    }
  }
});
test('reading items with no source text, duplicate options or misclassified IDs fail validation',()=>{
  const source=items[0];
  const wrong={
    ...source,id:'G-R-501',
    content:{...source.content,en:{...source.content.en,context:'Short',choices:['Same','Same','C','D','E']}}
  };
  const errors=validateQuestions([...bank,wrong]);
  assert.ok(errors.some(e=>e.includes('G-R-501')&&e.includes('exam or game ID mismatch')));
  assert.ok(errors.some(e=>e.includes('G-R-501')&&e.includes('reading passage')));
  assert.ok(errors.some(e=>e.includes('G-R-501')&&e.includes('repeated answer')));
});
