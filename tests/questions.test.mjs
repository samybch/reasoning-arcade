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
