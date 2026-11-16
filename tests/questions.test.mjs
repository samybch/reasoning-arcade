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
