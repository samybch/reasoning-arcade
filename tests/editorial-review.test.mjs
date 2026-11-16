import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const questions=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const ledger=JSON.parse(readFileSync(new URL('../docs/editorial-review-ledger.json',import.meta.url),'utf8'));

test('every bilingual pilot item has exactly one traceable editorial review record',()=>{
  assert.equal(ledger.schemaVersion,1);
  assert.equal(ledger.entries.length,questions.length);
  const byId=new Map(ledger.entries.map(e=>[e.id,e]));
  assert.equal(byId.size,questions.length,'no duplicate review entries');
  assert.deepEqual([...byId.keys()].sort(),questions.map(q=>q.id).sort(),'no missing or stale review entries');
  for(const q of questions){
    const entry=byId.get(q.id);
    assert.ok(entry,`${q.id}: missing review record`);
    assert.equal(entry.exam,q.exam);
    assert.equal(entry.game,q.game);
    assert.equal(entry.referenceKey,q.correctAnswer,`${q.id}: review ledger answer key out of sync`);
    assert.ok(typeof entry.reviewFocus==='string'&&entry.reviewFocus.length>55,`${q.id}: no concrete human review focus`);
    assert.ok(['pending','needs_changes','approved','rejected'].includes(entry.decision));
    if(entry.decision==='approved'||q.status==='reviewed'){
      assert.equal(entry.decision,'approved',`${q.id}: a reviewed item needs editorial signoff`);
      assert.equal(q.status,'reviewed',`${q.id}: approval must be reflected in source catalog`);
      assert.ok(typeof entry.reviewer==='string'&&entry.reviewer.trim().length>=2,`${q.id}: missing accountable reviewer`);
      assert.match(entry.reviewedAt??'',/^\d{4}-\d{2}-\d{2}$/,`${q.id}: review date missing`);
    }
  }
});
test('pending exercises do not claim independent approval or stale review signatures',()=>{
  const byId=new Map(questions.map(q=>[q.id,q]));
  for(const entry of ledger.entries){
    if(entry.decision==='pending'){
      assert.equal(byId.get(entry.id)?.status,'pilot',`${entry.id}: pending items must remain pilot`);
      assert.equal(entry.reviewer,null,`${entry.id}: no reviewer should be invented`);
      assert.equal(entry.reviewedAt,null,`${entry.id}: no review date should be invented`);
    }
  }
});
test('the strict inequality explanation is unambiguous in French and English',()=>{
  const q=questions.find(q=>q.id==='G-A-09');
  assert.ok(q);
  assert.match(q.content.fr.explanation,/dépassent/);
  assert.match(q.content.en.explanation,/outweigh/);
  assert.equal(q.correctAnswer,'3');
});
