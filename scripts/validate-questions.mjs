import {readFileSync} from 'node:fs';

export const QUESTIONS=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8'));
const MINIMUM={'tage:code-logic':12,'tage:argument-lab':6,'gmat:argument-lab':6,'tage:enough-info':6,'gmat:enough-info':6,'tage:quant-lab':6,'gmat:quant-lab':6,'tage:reading-lab':6,'tage:expression-lab':6,'gmat:reading-lab':6,'gmat:table-lab':3,'gmat:multi-source-lab':3,'gmat:graphics-lab':3};
const GAMES=new Set(['code-logic','argument-lab','enough-info','quant-lab','reading-lab','expression-lab','table-lab','multi-source-lab','graphics-lab']);
const EXAMS=new Set(['tage','gmat']);
const ID=/^[TG]-[LADCQRETMI]-\d{2,4}$/;
const correctKey=(q)=>q.game==='table-lab'?null:q.game==='enough-info'?['A','B','C','D','E']:['0','1','2','3','4'];
const nonEmpty=x=>typeof x==='string'&&x.trim().length>0;

export function validateQuestions(questions=QUESTIONS){
  const errors=[];
  if(!Array.isArray(questions))return ['Question catalog must be an array'];
  if(questions.length<36)errors.push(`Expected at least 36 original pilot questions; found ${questions.length}`);
  const ids=new Set();
  const groupCounts={};
  for(const [index,q] of questions.entries()){
    if(!q||typeof q!=='object'||Array.isArray(q)){errors.push(`Question at index ${index} must be an object`);continue;}
    const id=typeof q.id==='string'?q.id:`item[${index}]`;
    if(ids.has(id))errors.push(`${id}: duplicate ID`);
    ids.add(id);
    if(!ID.test(id))errors.push(`${id}: invalid ID format (T-C-01, G-Q-01, etc.)`);
    if(!EXAMS.has(q.exam))errors.push(`${id}: invalid exam track`);
    if(!GAMES.has(q.game))errors.push(`${id}: invalid game`);
    const track=id.slice(0,1),letter=id.slice(2,3);
    const expectedLetter=q.game==='code-logic'?'L':q.game==='argument-lab'?'A':q.game==='quant-lab'?(q.exam==='tage'?'C':'Q'):q.game==='reading-lab'?'R':q.game==='expression-lab'?'E':q.game==='table-lab'?'T':q.game==='multi-source-lab'?'M':q.game==='graphics-lab'?'I':'D';
    if(track!==(q.exam==='tage'?'T':'G')||letter!==expectedLetter)errors.push(`${id}: exam or game ID mismatch`);
    if(q.exam==='gmat'&&q.game==='expression-lab')errors.push(`${id}: Expression Lab is not a GMAT category`);
    if(q.exam==='gmat'&&q.game==='code-logic')errors.push(`${id}: Code Logic is not an official GMAT category`);
    if(!nonEmpty(q.competency))errors.push(`${id}: missing competency`);
    if(!Number.isInteger(q.difficulty)||q.difficulty<1||q.difficulty>5)errors.push(`${id}: difficulty must be 1–5`);
    if(!Number.isInteger(q.estimatedSeconds)||q.estimatedSeconds<20||q.estimatedSeconds>900)errors.push(`${id}: invalid estimatedSeconds`);
    if(!['pilot','reviewed'].includes(q.status))errors.push(`${id}: invalid editorial status`);
    if(!['warmup','skill-practice'].includes(q.alignment))errors.push(`${id}: missing/invalid exam alignment classification`);
    if(q.alignment==='warmup'&&q.game!=='code-logic')errors.push(`${id}: only Code Logic warm-ups are currently supported`);
    const key=`${q.exam}:${q.game}`;groupCounts[key]=(groupCounts[key]||0)+1;
    if(q.game==='graphics-lab'&&q.exam!=='gmat')errors.push(`${id}: Graph Lab belongs to GMAT only`);
    if(q.game==='multi-source-lab'&&q.exam!=='gmat')errors.push(`${id}: Multi-Source Lab belongs to GMAT only`);
    if(q.game==='graphics-lab'){
      const g=q.graph;
      if(!g||g.type!=='bar'||!Array.isArray(g.labels)||!Array.isArray(g.values)||g.labels.length<3||g.labels.length!==g.values.length||!g.labels.every(nonEmpty)||!g.values.every(n=>Number.isFinite(n)&&n>=0)||!nonEmpty(g.title?.fr)||!nonEmpty(g.title?.en)||!nonEmpty(g.units?.fr)||!nonEmpty(g.units?.en))errors.push(`${id}: invalid graph data`);
      if(typeof q.correctAnswer!=='string'||!/^\\d+\\|\\d+$/.test(q.correctAnswer))errors.push(`${id}: invalid two-blank graphic answer key`);
    }
    if(q.game==='table-lab'){
      if(q.exam!=='gmat')errors.push(`${id}: Table Lab is GMAT-only`);
      if(typeof q.correctAnswer!=='string'||!/^[YN]{3}$/.test(q.correctAnswer))errors.push(`${id}: invalid three-statement table answer key`);
      const t=q.table;
      if(!t||!Array.isArray(t.columns)||t.columns.length<3||!Array.isArray(t.rows)||t.rows.length<4||!t.columns.every(c=>typeof c.key==='string'&&nonEmpty(c.fr)&&nonEmpty(c.en)&&['number','text'].includes(c.kind))||!t.rows.every(row=>Array.isArray(row)&&row.length===t.columns.length&&row.every(v=>typeof v==='string'&&v.trim())))errors.push(`${id}: invalid sortable table data`);
      if(t?.columns?.some(c=>c.kind==='number')&&t.rows?.some(row=>row.some((v,i)=>t.columns[i].kind==='number'&&!Number.isFinite(Number(v)))))errors.push(`${id}: invalid numeric table value`);
    }else if(q.game!=='graphics-lab'&&!correctKey(q).includes(q.correctAnswer))errors.push(`${id}: invalid answer key`);
    if(q.game==='enough-info'){
      const s=q.sufficiency;
      if(!s||typeof s!=='object'||!['first','second','together'].every(x=>typeof s[x]==='boolean')){
        errors.push(`${id}: missing or invalid sufficiency-proof flags`);
      }else{
        if((s.first||s.second)&&!s.together)errors.push(`${id}: inconsistent sufficiency-proof flags`);
        const expected=s.first&&s.second?'D':s.first?'A':s.second?'B':s.together?'C':'E';
        if(q.correctAnswer!==expected)errors.push(`${id}: answer key conflicts with proof flags (${expected})`);
      }
    }else if(q.sufficiency!==undefined)errors.push(`${id}: sufficiency proof on non-DS item`);
    for(const lang of ['fr','en']){
      const loc=q.content?.[lang];
      if(!loc||typeof loc!=='object'){errors.push(`${id}: missing ${lang} translation`);continue;}
      for(const field of ['prompt','explanation','hint'])if(!nonEmpty(loc[field]))errors.push(`${id}: missing ${lang} ${field}`);
      if(q.game==='argument-lab'&&!nonEmpty(loc.context))errors.push(`${id}: missing ${lang} context`);
      if(q.game==='code-logic'&&!nonEmpty(loc.context))errors.push(`${id}: missing ${lang} puzzle data`);
      if(q.game==='reading-lab'&&(!nonEmpty(loc.context)||loc.context.trim().length<350))errors.push(`${id}: ${lang} reading passage must be at least 350 characters`);
      if(!Array.isArray(loc.reviewSteps)||loc.reviewSteps.length!==3||!loc.reviewSteps.every(s=>nonEmpty(s)&&s.trim().length>=40))errors.push(`${id}: ${lang} requires three detailed review steps`);
      if(q.game==='graphics-lab'&&(!Array.isArray(loc.graphicStatements)||loc.graphicStatements.length!==2||!loc.graphicStatements.every(v=>nonEmpty(v.prompt)&&Array.isArray(v.options)&&v.options.length>=3&&v.options.length<=5&&v.options.every(nonEmpty)&&new Set(v.options).size===v.options.length)))errors.push(`${id}: ${lang} requires two graphic dropdowns`);
      if(q.game==='graphics-lab'&&Array.isArray(loc.graphicStatements)&&typeof q.correctAnswer==='string'&&/^\\d+\\|\\d+$/.test(q.correctAnswer)){
        const keys=q.correctAnswer.split('|').map(Number);
        if(keys.some((k,i)=>k>= (loc.graphicStatements[i]?.options?.length??0)))errors.push(`${id}: ${lang} graph key index out of range`);
      }
      if(q.game==='multi-source-lab'&&(!Array.isArray(loc.sources)||loc.sources.length<2||loc.sources.length>4||!loc.sources.every(source=>nonEmpty(source.title)&&nonEmpty(source.body)&&source.body.trim().length>=60)||new Set(loc.sources.map(source=>source.title)).size!==loc.sources.length))errors.push(`${id}: ${lang} requires 2–4 original labeled sources of sufficient length`);
      if(q.game==='table-lab'&&(!Array.isArray(loc.tableStatements)||loc.tableStatements.length!==3||!loc.tableStatements.every(nonEmpty)))errors.push(`${id}: ${lang} requires three table claims`);
      if(q.game==='enough-info'){
        if(!Array.isArray(loc.statements)||loc.statements.length!==2||!loc.statements.every(nonEmpty))errors.push(`${id}: ${lang} requires exactly two nonempty statements`);

      } else if(q.game!=='table-lab'&&q.game!=='graphics-lab') {
        if(!Array.isArray(loc.choices)||loc.choices.length!==5||!loc.choices.every(nonEmpty))errors.push(`${id}: ${lang} requires five nonempty choices`);
        else if(new Set(loc.choices.map(c=>c.trim().toLocaleLowerCase(lang))).size!==5)errors.push(`${id}: repeated answer choices in ${lang}`);
      }
      if(lang==='fr'&&/^(which|what|every|is |does |a firm|a city|an online|a factory|a food)/i.test(loc.prompt??''))errors.push(`${id}: French prompt appears untranslated`);
      if(lang==='fr'&&/^(an online|a factory|a firm|every employee|a city|a food)/i.test(loc.context??''))errors.push(`${id}: French context appears untranslated`);
      if(lang==='fr'&&Array.isArray(loc.choices)&&loc.choices.some(s=>/^(most of|workers prefer|training takes|dana has|the subway|the test used|new automated)/i.test(s)))errors.push(`${id}: French answer choices appear untranslated`);
    }
    if(!!q.content?.fr?.context!==!!q.content?.en?.context)errors.push(`${id}: context missing in one language`);
  }
  for(const [key,min] of Object.entries(MINIMUM))if((groupCounts[key]||0)<min)errors.push(`${key}: expected at least ${min}; found ${groupCounts[key]||0}`);
  return errors;
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
  const errors=validateQuestions();
  if(errors.length){for(const error of errors)console.error('FAIL:',error);process.exitCode=1;}
  else console.log(`PASS: ${QUESTIONS.length} bilingual questions structurally validated (content review is separate)`);
}
