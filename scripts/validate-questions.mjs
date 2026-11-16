import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../public/preview/index.html', import.meta.url), 'utf8');
const data = html.match(/<script type="application\/json" id="bank">([\s\S]*?)<\/script>/);
if (!data) throw new Error('Question bank is missing from preview HTML');

export const QUESTIONS = JSON.parse(data[1]);

export function validateQuestions(questions=QUESTIONS) {
  const errors = [];
  if(questions.length !== 36) errors.push(`Expected 36 pilot questions; found ${questions.length}`);
  const seen = new Set();
  const counts = {};
  for(const q of questions) {
    if(!q.id || seen.has(q.id)) errors.push(`Invalid/duplicate id: ${q.id}`);
    seen.add(q.id);
    if(!['tage','gmat'].includes(q.exam)) errors.push(`${q.id}: invalid track`);
    if(!['code-logic','argument-lab','enough-info'].includes(q.game)) errors.push(`${q.id}: invalid game`);
    if(q.exam==='gmat' && q.game==='code-logic') errors.push(`${q.id}: code logic is not a GMAT category`);
    if(!Number.isInteger(q.difficulty) || q.difficulty<1 || q.difficulty>5) errors.push(`${q.id}: invalid difficulty`);
    if(q.status!=='pilot') errors.push(`${q.id}: unexpected publication status`);
    const key=`${q.exam}:${q.game}`;counts[key]=(counts[key]||0)+1;
    for(const lang of ['fr','en']){
      const loc=q.content?.[lang];
      if(!loc?.prompt?.trim()||!loc?.explanation?.trim()||!loc?.hint?.trim()) errors.push(`${q.id}: incomplete ${lang} text`);
      if(q.game==='enough-info') {
        if(loc?.statements?.length!==2) errors.push(`${q.id}: expected two statements in ${lang}`);
        if(!['A','B','C','D','E'].includes(q.correctAnswer)) errors.push(`${q.id}: invalid sufficiency key`);
      } else {
        if(loc?.choices?.length!==5) errors.push(`${q.id}: expected five choices in ${lang}`);
        if(!['0','1','2','3','4'].includes(q.correctAnswer)) errors.push(`${q.id}: invalid answer key`);
      }
    }
  }
  const expected={'tage:code-logic':12,'tage:argument-lab':6,'gmat:argument-lab':6,'tage:enough-info':6,'gmat:enough-info':6};
  for(const [key,count] of Object.entries(expected)) if(counts[key]!==count) errors.push(`${key}: expected ${count}; got ${counts[key]||0}`);
  return errors;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))) {
  const errors = validateQuestions();
  if(errors.length){for(const e of errors) console.error('FAIL',e);process.exitCode=1;}
  else console.log(`PASS: ${QUESTIONS.length} bilingual pilot questions structurally validated`);
}
