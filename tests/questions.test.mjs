import {test} from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,validateQuestions} from '../scripts/validate-questions.mjs';

test('bilingual questions conform to the draft schema', () => {
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

test('all 16 data-sufficiency keys are corroborated by explicit three-way proof flags',()=>{
  const rows=QUESTIONS.filter(q=>q.game==='enough-info');
  assert.equal(rows.length,16);
  for(const q of rows){
    const s=q.sufficiency;
    assert.ok(s,`${q.id}: proof missing`);
    assert.ok(!s.first||s.together);
    assert.ok(!s.second||s.together);
    const expected=s.first&&s.second?'D':s.first?'A':s.second?'B':s.together?'C':'E';
    assert.equal(q.correctAnswer,expected,`${q.id}: answer key mismatch`);
    assert.equal(q.content.fr.reviewSteps.length,3,`${q.id}: FR reasoning`);
    assert.equal(q.content.en.reviewSteps.length,3,`${q.id}: EN reasoning`);
  }
});
test('a contradictory proof flag or answer change fails content validation',()=>{
  const original=QUESTIONS.find(q=>q.id==='G-D-08');
  const variants=[
    {...original,sufficiency:{first:true,second:false,together:false}},
    {...original,correctAnswer:'D'},
    {...original,sufficiency:{first:false,second:false,together:false}},
    {...original,sufficiency:null}
  ];
  for(const modified of variants){
    const errors=validateQuestions(QUESTIONS.map(q=>q.id===modified.id?modified:q));
    assert.ok(errors.some(e=>/sufficiency-proof|proof flags/.test(e)),JSON.stringify(errors));
  }
});

test('every Argument Lab pilot item has three detailed FR/EN teaching stages',()=>{
  const items=QUESTIONS.filter(q=>q.game==='argument-lab');
  assert.equal(items.length,12);
  for(const q of items){
    for(const lang of ['fr','en']){
      const stages=q.content[lang].reviewSteps;
      assert.ok(Array.isArray(stages),q.id+' '+lang);
      assert.equal(stages.length,3,q.id+' '+lang);
      assert.ok(stages.every(step=>typeof step==='string'&&step.trim().length>=40),q.id+' '+lang);
    }
  }
});
test('missing Argument Lab review stages fail bilingual schema validation',()=>{
  const corrupted=QUESTIONS.map(q=>q.id==='G-A-10'?{
    ...q,content:{...q.content,en:{...q.content.en,reviewSteps:undefined}}
  }:q);
  assert.ok(validateQuestions(corrupted).some(error=>error.includes('G-A-10')&&error.includes('review steps')));
});

test('all 18 Code Logic pilots have three original bilingual solution steps',()=>{
  const items=QUESTIONS.filter(q=>q.game==='code-logic');
  assert.equal(items.length,18);
  for(const q of items){
    for(const locale of ['fr','en']){
      const steps=q.content[locale].reviewSteps;
      assert.ok(Array.isArray(steps),q.id+' '+locale);
      assert.equal(steps.length,3,q.id+' '+locale);
      assert.ok(steps.every(step=>typeof step==='string'&&step.trim().length>=40),q.id+' '+locale);
    }
  }
});
test('missing or shortened Code Logic solution steps fail schema validation',()=>{
  const invalid=QUESTIONS.map(q=>q.id==='T-L-18'?{
    ...q,content:{...q.content,fr:{...q.content.fr,reviewSteps:['too short','','']}}
  }:q);
  assert.ok(validateQuestions(invalid).some(error=>error.includes('T-L-18')&&error.includes('review steps')));
});
test('all 46 bilingual pilots have structured feedback without modifying their review status',()=>{
  assert.equal(QUESTIONS.length,46);
  assert.ok(QUESTIONS.every(q=>q.status==='pilot'));
  assert.ok(QUESTIONS.every(q=>q.content.fr.reviewSteps?.length===3&&q.content.en.reviewSteps?.length===3));
});
