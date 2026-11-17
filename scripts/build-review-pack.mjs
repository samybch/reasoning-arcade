import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const choiceLetter=index=>'ABCDE'[index];

function languageView(question,locale){
  const content=question.content[locale];
  const options=question.game==='table-lab'
    ? '<div><strong>Sortable data table (fixed-order offline preview):</strong><table border="1"><thead><tr>'+question.table.columns.map(c=>'<th>'+escapeHtml(c[locale])+'</th>').join('')+'</tr></thead><tbody>'+question.table.rows.map(row=>'<tr>'+row.map(value=>'<td>'+escapeHtml(value)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><ol>'+content.tableStatements.map((statement,i)=>'<li>'+escapeHtml(statement)+'</li>').join('')+'</ol>'
    : question.game==='enough-info'
    ? content.statements.map((value,index)=>'<li><strong>('+String(index+1)+')</strong> '+escapeHtml(value)+'</li>').join('')
    : content.choices.map((value,index)=>'<li><strong>'+choiceLetter(index)+'.</strong> '+escapeHtml(value)+'</li>').join('');
  const context=content.context?'<p class="context">'+escapeHtml(content.context)+'</p>':(question.game==='multi-source-lab'?(content.sources??[]).map(source=>'<section class="context"><h4>'+escapeHtml(source.title)+'</h4><p>'+escapeHtml(source.body)+'</p></section>').join(''):'');
  const key=question.game==='table-lab'?question.correctAnswer:question.game==='enough-info'?question.correctAnswer:choiceLetter(Number(question.correctAnswer));
  const correctLabel=question.game==='table-lab'?escapeHtml(key.split('').map(v=>v==='Y'?'Yes':'No').join(' / '))
    : question.game==='enough-info'
    ? escapeHtml(key)
    : escapeHtml(key+' — '+content.choices[Number(question.correctAnswer)]);
  const steps=content.reviewSteps.map(step=>'<li>'+escapeHtml(step)+'</li>').join('');
  return [
    '<section class="language" lang="',locale,'">',
    '<h3>',locale==='fr'?'Français':'English','</h3>',
    '<p class="prompt">',escapeHtml(content.prompt),'</p>',
    context,'<ol class="options">',options,'</ol>',
    '<details class="answer"><summary>',locale==='fr'?'Révéler la correction (après réflexion)':'Reveal the answer (after solving)','</summary>',
    '<p><strong>',locale==='fr'?'Réponse de référence : ':'Reference key: ',correctLabel,'</strong></p>',
    '<p><strong>',locale==='fr'?'Indice : ':'Hint: ','</strong>',escapeHtml(content.hint),'</p>',
    '<p>',escapeHtml(content.explanation),'</p><ol class="steps">',steps,'</ol></details>',
    '</section>'
  ].join('');
}
function questionView(question,record){
  return [
   '<article class="question" data-question="',escapeHtml(question.id),'">',
   '<div class="question-top"><h2>',escapeHtml(question.id),'</h2><span>',escapeHtml(question.exam.toUpperCase()),
   ' · ',escapeHtml(question.game),' · ',escapeHtml(question.competency),'</span></div>',
   '<p class="meta">Difficulty (uncalibrated): ',escapeHtml(question.difficulty),'/5 · Pilot estimate: ',escapeHtml(question.estimatedSeconds),' seconds</p>',
   '<p class="review-focus"><strong>Review focus: </strong>',escapeHtml(record.reviewFocus),'</p>',
   '<div class="languages">',languageView(question,'fr'),languageView(question,'en'),'</div>',
   '<div class="assessment"><label>Review finding for ',escapeHtml(question.id),
   '<select data-decision><option value="unreviewed">Not reviewed</option>',
   '<option value="no_issue_spotted">No issue spotted (not approval)</option>',
   '<option value="needs_changes">Needs changes</option>',
   '<option value="uncertain">Uncertain — further review needed</option></select></label>',
   '<label>Observations / counterexample / wording issue<textarea data-notes maxlength="3000" rows="3" placeholder="Record specific evidence. No personal information needed."></textarea></label>',
   '</div></article>'
  ].join('');
}
export function renderReviewPack(catalogText,ledgerText,cssText,clientJs){
  const questions=JSON.parse(catalogText),ledger=JSON.parse(ledgerText);
  if(!Array.isArray(questions)||!Array.isArray(ledger.entries))throw Error('Invalid question catalog or review ledger');
  const entries=new Map(ledger.entries.map(entry=>[entry.id,entry]));
  if(entries.size!==questions.length||questions.length!==ledger.entries.length)throw Error('Editorial ledger and catalog must contain exactly the same unique question IDs');
  for(const question of questions){
    const entry=entries.get(question.id);
    if(!entry||entry.referenceKey!==question.correctAnswer||entry.exam!==question.exam||entry.game!==question.game)throw Error('Review ledger mismatch: '+question.id);
  }
  const sha=createHash('sha256').update(catalogText).digest('hex');
  const cards=questions.map(question=>questionView(question,entries.get(question.id))).join('\n');
  return [
    '<!doctype html><html lang="fr"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex,nofollow">',
    '<title>Reasoning Arcade — Offline editorial review</title>',
    '<style>',cssText.replace(/<\/style/gi,'<\\/style'),'</style></head>',
    '<body><a class="skip" href="#questions">Aller aux questions / Skip to questions</a>',
    '<header><p class="eyebrow">REASONING ARCADE · OFFLINE REVIEW</p>',
    '<h1>Revue pédagogique / Editorial review</h1>',
    '<p>This is an independent-review worksheet for ',String(questions.length),' original pilot questions. ',
    'It is not an official exam simulator or proof that any question has been approved.</p>',
    '<p><strong>Start by solving each question without opening its reference answer.</strong> Compare FR and EN, ',
    'then record any ambiguity, reasoning errors, translation mismatch, timing or rights concerns.</p>',
    '<p><strong>Privacy:</strong> No account, analytics, external resources, network requests or automatic saving. ',
    'The worksheet is entirely offline. Download your remarks before closing the file; importing a saved report restores them.</p>',
    '<p class="hash">Catalog SHA-256: <code>',sha,'</code></p>',
    '<div class="toolbar"><button type="button" id="export">Download review notes (JSON)</button>',
    '<label class="import">Import previous review notes (JSON)<input id="import" type="file" accept=".json,application/json"></label>',
    '<span id="status" role="status" aria-live="polite">No reviews recorded yet.</span></div>',
    '</header><main id="questions" data-catalog-sha="',sha,'">',
    cards,'</main><footer>Offline pilot-review worksheet · Do not mark questions approved without independent evidence.',
    '</footer><script>',clientJs.replace(/<\/script/gi,'<\\/script'),'</script></body></html>'
  ].join('');
}

export function main(){
  const catalog=readFileSync(resolve(root,'src/content/questions.json'),'utf8');
  const ledger=readFileSync(resolve(root,'docs/editorial-review-ledger.json'),'utf8');
  const css=readFileSync(resolve(root,'scripts/reviewer-style.css'),'utf8');
  const client=readFileSync(resolve(root,'scripts/reviewer-client.js'),'utf8');
  const output=resolve(root,'review-pack/reasoning-arcade-editorial-review.html');
  const rendered=renderReviewPack(catalog,ledger,css,client);
  mkdirSync(dirname(output),{recursive:true});
  writeFileSync(output,rendered,'utf8');
  console.log('Offline review packet created: '+output+' ('+JSON.parse(catalog).length+' pilot questions, '+Buffer.byteLength(rendered)+' bytes)');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1]))main();
