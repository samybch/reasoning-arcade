import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateQuestions} from '../scripts/validate-questions.mjs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const items=bank.filter(q=>q.game==='expression-lab');
const keys={
  'T-E-01':{key:'1',skill:'language-correction',fr:'recueillies sont fiables',en:'collected is reliable'},
  'T-E-02':{key:'3',skill:'language-correction',fr:"Bien qu'il soit tard",en:'Although it is late'},
  'T-E-03':{key:'0',skill:'faithful-reformulation',fr:'sans que les autres',en:'not automatically excluded'},
  'T-E-04':{key:'4',skill:'faithful-reformulation',fr:'réserve sa décision',en:'withholding a decision'},
  'T-E-05':{key:'2',skill:'discourse-coherence',fr:'Par conséquent',en:'Consequently'},
  'T-E-06':{key:'1',skill:'discourse-coherence',fr:'prématuré',en:'premature'}
};

test('six original TAGE-only expression pilots span three official skill areas evenly',()=>{
  assert.equal(items.length,6);
  assert.deepEqual(items.map(q=>q.id),Object.keys(keys));
  assert.ok(items.every(q=>q.exam==='tage'&&q.status==='pilot'&&q.alignment==='skill-practice'));
  for(const skill of ['language-correction','faithful-reformulation','discourse-coherence'])
    assert.equal(items.filter(q=>q.competency===skill).length,2);
});
test('all French and English options preserve independently recorded answer meaning',()=>{
  for(const q of items){
    const expected=keys[q.id];assert.ok(expected,q.id);
    assert.equal(q.correctAnswer,expected.key);
    assert.equal(q.competency,expected.skill);
    for(const locale of ['fr','en']){
      const c=q.content[locale];
      assert.equal(c.choices.length,5);
      assert.equal(new Set(c.choices.map(s=>s.toLocaleLowerCase(locale))).size,5);
      assert.ok(c.choices[Number(q.correctAnswer)].includes(expected[locale]),q.id+' '+locale);
      assert.ok(c.explanation.length>65&&c.hint.length>30);
      assert.equal(c.reviewSteps.length,3);
      assert.ok(c.reviewSteps.every(step=>step.length>=40));
    }
  }
});
test('new Expression questions cannot be misclassified as official GMAT skill content',()=>{
  const clone={...items[0],id:'G-E-99',exam:'gmat'};
  const errors=validateQuestions([...bank,clone]);
  assert.ok(errors.some(s=>s.includes('G-E-99')&&s.includes('Expression Lab belongs to TAGE MAGE only')));
});
