import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recordAttempt,nextQuestion,nextReviewQuestion,buildExamQueue,queueUnansweredForReview,grade,EMPTY_PROGRESS,skillKey} from '../src/engine/adaptive.ts';
import {readFileSync} from 'node:fs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const q=bank[0];

test('two consecutive correct answers increase skill level',()=>{
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,true),q,true);
  assert.equal(p.skills[skillKey(q)].level,3);assert.equal(p.totalCorrect,2);
});
test('two consecutive errors decrease skill level',()=>{
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,false),q,false);
  assert.equal(p.skills[skillKey(q)].level,1);
});
test('skills are isolated by exam and competency',()=>{
  const other=bank.find(v=>v.exam==='gmat');
  const p=recordAttempt(recordAttempt(EMPTY_PROGRESS,q,true),other,false);
  assert.equal(Object.keys(p.skills).length,2);
});
test('chooser respects track and excludes seen IDs',()=>{
  const first=nextQuestion(bank,EMPTY_PROGRESS,'tage','code-logic',[]);
  assert.ok(first);assert.equal(first.exam,'tage');
  const second=nextQuestion(bank,EMPTY_PROGRESS,'tage','code-logic',[first.id]);
  assert.ok(second);assert.notEqual(first.id,second.id);
});
test('mini-test queue is deterministic and GMAT does not use Code Logic',()=>{
  const a=buildExamQueue(bank,'gmat','mixed',6),b=buildExamQueue(bank,'gmat','mixed',6);
  assert.deepEqual(a.map(q=>q.id),b.map(q=>q.id));
  assert.ok(a.every(q=>q.exam==='gmat'&&q.game!=='code-logic'));
});
test('grade handles empty and partial sessions',()=>{
  assert.deepEqual(grade([]),{correct:0,total:0,percent:0});
  assert.equal(grade([{questionId:'x',selected:'0',correct:true,elapsedSeconds:1}]).percent,100);
});

test('timed scoring counts unanswered questions as incorrect',()=>{
  const oneCorrect=[{questionId:'T-L-01',selected:'2',correct:true,elapsedSeconds:12}];
  assert.equal(grade(oneCorrect,6).percent,17);
  assert.equal(grade([],6).percent,0);
  assert.equal(grade(oneCorrect,1).percent,100);
});

test('repeat mini-tests use fresh deterministic question subsets while preserving valid IDs',()=>{
  for(const exam of ['tage','gmat']){
    const first=buildExamQueue(bank,exam,'mixed',6,0);
    const replay=buildExamQueue(bank,exam,'mixed',6,1);
    assert.equal(first.length,6);
    assert.equal(replay.length,6);
    assert.equal(new Set(first.map(q=>q.id)).size,6);
    assert.equal(new Set(replay.map(q=>q.id)).size,6);
    assert.ok(replay.every(q=>q.exam===exam));
    assert.notDeepEqual(first.map(q=>q.id),replay.map(q=>q.id));
    assert.deepEqual(replay.map(q=>q.id),buildExamQueue(bank,exam,'mixed',6,1).map(q=>q.id));
  }
});

test('recent successful and incorrect questions are remembered without bloating local progress',()=>{
  let progress={...EMPTY_PROGRESS,skills:{},recentQuestionIds:[]};
  const selection=bank.filter(q=>q.exam==='tage'&&q.game==='code-logic');
  for(const [i,q] of selection.entries())progress=recordAttempt(progress,q,i%2===0);
  assert.equal(progress.recentQuestionIds.length,16);
  assert.equal(new Set(progress.recentQuestionIds).size,16);
  assert.equal(progress.recentQuestionIds[0],selection[2].id);
  const next=nextQuestion(bank,progress,'tage','code-logic',[]);
  assert.ok(next);
  assert.ok(!progress.recentQuestionIds.includes(next.id),'prefers older unpracticed questions');
});
test('recent history never repeats the same item within a session or blocks an exhausted pool',()=>{
  const pool=bank.filter(q=>q.exam==='gmat'&&q.game==='argument-lab');
  const progress={...EMPTY_PROGRESS,recentQuestionIds:pool.map(q=>q.id)};
  assert.ok(nextQuestion(pool,progress,'gmat','argument-lab',[]));
  const excluded=pool.slice(0,-1).map(q=>q.id);
  assert.equal(nextQuestion(pool,progress,'gmat','argument-lab',excluded).id,pool.at(-1).id);
  assert.equal(nextQuestion(pool,progress,'gmat','argument-lab',pool.map(q=>q.id)),null);
});

test('a wrong answer enters a local review queue and a correct retry clears it',()=>{
  const question=bank.find(q=>q.id==='G-D-13');
  const incorrect=recordAttempt(EMPTY_PROGRESS,question,false);
  assert.deepEqual(incorrect.pendingReviewIds,['G-D-13']);
  assert.equal(nextReviewQuestion(bank,incorrect,'gmat',[]).id,'G-D-13');
  assert.equal(nextReviewQuestion(bank,incorrect,'tage',[]),null);
  const retried=recordAttempt(incorrect,question,true);
  assert.deepEqual(retried.pendingReviewIds,[]);
  assert.equal(nextReviewQuestion(bank,retried,'gmat',[]),null);
  assert.deepEqual(EMPTY_PROGRESS.pendingReviewIds,[]);
});
test('review queue is bounded, unique and skips deleted question IDs',()=>{
  let p={...EMPTY_PROGRESS,skills:{},pendingReviewIds:[]};
  for(const q of bank.slice(0,30))p=recordAttempt(p,q,false);
  assert.equal(p.pendingReviewIds.length,24);
  assert.equal(new Set(p.pendingReviewIds).size,24);
  const repeat=recordAttempt(p,bank[28],false);
  assert.equal(repeat.pendingReviewIds.length,24);
  assert.equal(repeat.pendingReviewIds.at(-1),bank[28].id);
  const stale={...EMPTY_PROGRESS,pendingReviewIds:['T-L-999','T-A-01']};
  assert.equal(nextReviewQuestion(bank,stale,'tage',[]).id,'T-A-01');
  assert.equal(nextReviewQuestion(bank,stale,'tage',['T-A-01']),null);
});

test('mixed mini-test samples every available game, including Reading Lab',()=>{
  const expected={tage:['argument-lab','code-logic','enough-info','expression-lab','quant-lab','reading-lab'],gmat:['argument-lab','enough-info','quant-lab','reading-lab']};
  for(const exam of ['tage','gmat']){
    for(const variant of [0,1,2,3,8]){
      const chosen=buildExamQueue(bank,exam,'mixed',6,variant);
      assert.equal(chosen.length,6,`${exam}/variant${variant}`);
      assert.equal(new Set(chosen.map(q=>q.id)).size,6,'no duplicates');
      assert.deepEqual([...new Set(chosen.map(q=>q.game))].sort(),expected[exam],`${exam}/variant${variant} must cover all available games`);
      assert.deepEqual(buildExamQueue(bank,exam,'mixed',6,variant).map(q=>q.id),chosen.map(q=>q.id),'stable selection');
    }
  }
});
test('mixed queue degrades gracefully if the bank has missing or exhausted games',()=>{
  const tiny=bank.filter(q=>q.exam==='gmat'&&q.game==='quant-lab').slice(0,2);
  const chosen=buildExamQueue(tiny,'gmat','mixed',6,1);
  assert.equal(chosen.length,2);
  assert.equal(new Set(chosen.map(q=>q.id)).size,2);
  assert.deepEqual(buildExamQueue(tiny,'gmat','mixed',0),[]);
});
test('timed unanswered questions enter revision without creating fake attempts',()=>{
  const first=bank.find(q=>q.id==='T-C-01');
  const second=bank.find(q=>q.id==='T-C-02');
  const initial={...EMPTY_PROGRESS,skills:{},totalAnswered:3,totalCorrect:2,pendingReviewIds:['T-L-01']};
  const queued=queueUnansweredForReview(initial,[first,second]);
  assert.deepEqual(queued.pendingReviewIds,['T-L-01','T-C-01','T-C-02']);
  assert.equal(queued.totalAnswered,3,'unanswered questions must not inflate attempt totals');
  assert.equal(queued.totalCorrect,2);
  assert.deepEqual(queued.skills,{});
  assert.deepEqual(queueUnansweredForReview(queued,[first]).pendingReviewIds,queued.pendingReviewIds,'idempotent');
  assert.equal(nextReviewQuestion(bank,queued,'tage',['T-L-01']).id,'T-C-01');
  assert.equal(queueUnansweredForReview(queued,[]),queued,'empty timeout is a no-op');
});
test('timed unanswered queue preserves the same size bound as manual mistakes',()=>{
  const full=bank.slice(0,28);
  const updated=queueUnansweredForReview(EMPTY_PROGRESS,full);
  assert.equal(updated.pendingReviewIds.length,24);
  assert.equal(new Set(updated.pendingReviewIds).size,24);
});


test('mixed queue includes Reading Lab in every six-question practice variant',()=>{
  for(const exam of ['tage','gmat']){
    for(const variant of [0,1,2,3,4,5,11]){
      const questions=buildExamQueue(bank,exam,'mixed',6,variant);
      assert.equal(questions.length,6);
      assert.ok(questions.some(q=>q.game==='reading-lab'),exam+' variant '+variant);
      assert.equal(new Set(questions.map(q=>q.id)).size,6);
      assert.ok(questions.every(q=>q.exam===exam));
    }
  }
});
