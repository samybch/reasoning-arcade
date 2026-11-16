import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const bank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const byId=new Map(bank.map(q=>[q.id,q]));

const numerical={
  "T-L-01": "32",
  "T-L-02": "25",
  "T-L-03": "21",
  "T-L-04": "27",
  "T-L-05": "30",
  "T-L-06": "1",
  "T-L-07": "48",
  "T-L-08": "64",
  "T-L-09": "75",
  "T-L-10": "60",
  "T-L-11": "29",
  "T-L-12": "45"
};
const verbal={
  "T-A-01": {
    "key": "1",
    "fr": "festival gratuit",
    "en": "free festival"
  },
  "T-A-02": {
    "key": "3",
    "fr": "représentent",
    "en": "represent"
  },
  "T-A-03": {
    "key": "2",
    "fr": "Certains étudiants",
    "en": "Some students"
  },
  "T-A-04": {
    "key": "4",
    "fr": "Confondre",
    "en": "Confusing"
  },
  "T-A-05": {
    "key": "0",
    "fr": "même examen",
    "en": "same examination"
  },
  "T-A-06": {
    "key": "3",
    "fr": "n’utilisent pas",
    "en": "do not use"
  },
  "G-A-07": {
    "key": "0",
    "fr": "livraison tardive",
    "en": "late deliveries"
  },
  "G-A-08": {
    "key": "2",
    "fr": "machines automatisées",
    "en": "automated machinery"
  },
  "G-A-09": {
    "key": "3",
    "fr": "économies",
    "en": "Savings"
  },
  "G-A-10": {
    "key": "1",
    "fr": "formation de sécurité",
    "en": "safety training"
  },
  "G-A-11": {
    "key": "4",
    "fr": "métro",
    "en": "subway"
  },
  "G-A-12": {
    "key": "2",
    "fr": "climat",
    "en": "climates"
  }
};
const sufficiency={
  "T-D-01": "A",
  "T-D-02": "B",
  "T-D-03": "C",
  "T-D-04": "D",
  "T-D-05": "E",
  "T-D-06": "B",
  "G-D-07": "D",
  "G-D-08": "A",
  "G-D-09": "C",
  "G-D-10": "C",
  "G-D-11": "D",
  "G-D-12": "E"
};

test('all 12 existing numerical answer choices point to manually checked solutions',()=>{
  for(const [id,expected] of Object.entries(numerical)){
    const q=byId.get(id); assert.ok(q,`Missing ${id}`);
    for(const locale of ['fr','en']){
      const choices=q.content[locale].choices;
      assert.equal(choices[Number(q.correctAnswer)],expected,`${id}: ${locale} answer`);
      assert.equal(choices.filter(v=>v===expected).length,1,`${id}: ${locale} ambiguity`);
    }
  }
});
test('all 12 existing argument keys still identify equivalent FR/EN reasoning',()=>{
  for(const [id,item] of Object.entries(verbal)){
    const q=byId.get(id);assert.ok(q,`Missing ${id}`);
    assert.equal(q.correctAnswer,item.key,`${id}: answer index changed`);
    for(const locale of ['fr','en']){
      const answer=q.content[locale].choices[Number(q.correctAnswer)];
      assert.ok(answer.toLocaleLowerCase(locale).includes(item[locale].toLocaleLowerCase(locale)),`${id}: ${locale} expected answer meaning changed`);
    }
  }
});
test('all 12 existing data-sufficiency answer keys match reviewed logical categories',()=>{
  for(const [id,key] of Object.entries(sufficiency)){
    const q=byId.get(id);assert.ok(q,`Missing ${id}`);
    assert.equal(q.correctAnswer,key,`${id}: sufficiency classification changed`);
  }
});
test('GMAT reasoning exercises display localized French rather than duplicated English content',()=>{
  for(const q of bank.filter(q=>q.id.startsWith('G-A-'))){
    assert.notEqual(q.content.fr.prompt,q.content.en.prompt,`${q.id}: untranslated prompt`);
    assert.notEqual(q.content.fr.context,q.content.en.context,`${q.id}: untranslated context`);
    assert.ok(q.content.fr.choices.every((c,i)=>c!==q.content.en.choices[i]),`${q.id}: untranslated choices`);
  }
});

const extended={
  'T-L-13':{key:'2',fr:'Heptagone régulier',en:'Regular heptagon'},
  'T-L-14':{key:'4',fr:'289',en:'289'},
  'T-L-15':{key:'1',fr:'83',en:'83'},
  'T-L-16':{key:'4',fr:'79',en:'79'},
  'T-L-17':{key:'3',fr:'Parallélogramme quelconque non rectangulaire',en:'Oblique nonrectangular parallelogram'},
  'T-L-18':{key:'2',fr:'43',en:'43'},
  'G-D-13':{key:'A'},
  'G-D-14':{key:'C'},
  'G-D-15':{key:'C'},
  'G-D-16':{key:'D'}
};
test('ten original pilot questions have reference answers in both languages',()=>{
  for(const [id,item] of Object.entries(extended)){
    const q=byId.get(id);assert.ok(q,`Missing ${id}`);
    assert.equal(q.correctAnswer,item.key,`${id}: answer key`);
    if(q.game==='code-logic'){
      assert.equal(q.content.fr.choices[Number(q.correctAnswer)],item.fr,`${id}: FR option`);
      assert.equal(q.content.en.choices[Number(q.correctAnswer)],item.en,`${id}: EN option`);
    }else{
      assert.equal(q.content.fr.statements.length,2);
      assert.equal(q.content.en.statements.length,2);
    }
    assert.equal(q.status,'pilot');
  }
});
