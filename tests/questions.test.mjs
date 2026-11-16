import {test} from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,validateQuestions} from '../scripts/validate-questions.mjs';

test('36 bilingual questions conform to the draft schema', () => {
  assert.deepEqual(validateQuestions(), []);
});

test('all tracks have expected five-choice / two-statement structure', () => {
  for(const q of QUESTIONS) {
    assert.ok(q.content.fr.prompt && q.content.en.prompt);
    assert.ok(q.content.fr.explanation && q.content.en.explanation);
    if(q.game==='enough-info') {
      assert.equal(q.content.fr.statements.length,2);
      assert.equal(q.content.en.statements.length,2);
    } else {
      assert.equal(q.content.fr.choices.length,5);
      assert.equal(q.content.en.choices.length,5);
    }
  }
});

test('a new original question can be contributed without changing a fixed total',()=>{
  const added={...QUESTIONS[0],id:'T-L-013'};
  assert.deepEqual(validateQuestions([...QUESTIONS,added]),[]);
});
test('validator flags duplicate IDs, missing translations and repeated answer options',()=>{
  const dup={...QUESTIONS[0],content:{...QUESTIONS[0].content,fr:{...QUESTIONS[0].content.fr,choices:['same','same','C','D','E']}}};
  const errors=validateQuestions([...QUESTIONS,dup]);
  assert.ok(errors.some(x=>x.includes('duplicate')));
  assert.ok(errors.some(x=>x.includes('repeated')));
  const english={...QUESTIONS.find(q=>q.id==='G-A-07'),id:'G-A-013',content:{
    ...QUESTIONS.find(q=>q.id==='G-A-07').content,fr:{
      ...QUESTIONS.find(q=>q.id==='G-A-07').content.fr,prompt:'Which evidence strengthens the argument?'
    }
  }};
  assert.ok(validateQuestions([...QUESTIONS,english]).some(x=>x.includes('untranslated')));
});

test('all original pilot items have an explicit, non-official alignment class',()=>{
  const warmups=QUESTIONS.filter(q=>q.alignment==='warmup');
  assert.equal(warmups.length,6);
  assert.deepEqual(warmups.map(q=>q.id),['T-L-01','T-L-02','T-L-03','T-L-04','T-L-05','T-L-06']);
  assert.equal(QUESTIONS.filter(q=>q.alignment==='skill-practice').length,40);
  const invalid={...QUESTIONS[0],alignment:'official'};
  assert.ok(validateQuestions(QUESTIONS.map(q=>q.id===invalid.id?invalid:q)).some(e=>e.includes('alignment')));
});

test('all 16 data-sufficiency items have 3 detailed bilingual review stages',()=>{
  const items=QUESTIONS.filter(q=>q.game==='enough-info');
  assert.equal(items.length,16);
  for(const q of items){
    for(const lang of ['fr','en']){
      const stages=q.content[lang].reviewSteps;
      assert.ok(Array.isArray(stages),q.id+' '+lang);
      assert.equal(stages.length,3,q.id+' '+lang);
      assert.ok(stages.every(s=>typeof s==='string'&&s.trim().length>=40),q.id+' '+lang);
    }
  }
});
test('missing bilingual reasoning stages fail schema validation',()=>{
  const bad=QUESTIONS.map(q=>q.id==='G-D-14'?{
    ...q,content:{...q.content,fr:{...q.content.fr,reviewSteps:['Statement 1','','']}}
  }:q);
  assert.ok(validateQuestions(bad).some(e=>e.includes('G-D-14')&&e.includes('review steps')));
});
