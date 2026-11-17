import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderReviewPack} from '../scripts/build-review-pack.mjs';
import {FIRST_REVIEW_BATCH} from '../scripts/review-batch.mjs';

const catalog=readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8');
const ledger=readFileSync(new URL('../docs/editorial-review-ledger.json',import.meta.url),'utf8');
const css=readFileSync(new URL('../scripts/reviewer-style.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../scripts/reviewer-client.js',import.meta.url),'utf8');

test('offline review packet contains exactly one FR/EN card per pilot and preserves source keys',()=>{
  const html=renderReviewPack(catalog,ledger,css,js);
  const questions=JSON.parse(catalog);
  assert.equal((html.match(/<article class="question" data-question=/g)||[]).length,questions.length);
  assert.equal(questions.length,94);
  assert.equal((html.match(/<section class="language" lang="fr">/g)||[]).length,questions.length);
  assert.equal((html.match(/<section class="language" lang="en">/g)||[]).length,questions.length);
  for(const q of questions)assert.ok(html.includes('data-question="'+q.id+'"'),q.id);
  assert.match(html,/Catalog SHA-256:/);
  assert.match(html,/No account, analytics, external resources, network requests or automatic saving/);
});
test('review packet is genuinely standalone: no linked assets or network interactions',()=>{
  const html=renderReviewPack(catalog,ledger,css,js);
  assert.doesNotMatch(html,/<script[^>]+src=/i);
  assert.doesNotMatch(html,/<link[^>]+href=/i);
  assert.doesNotMatch(html,/<iframe/i);
  assert.doesNotMatch(html,/\bfetch\s*\(|\bXMLHttpRequest\b|\bsendBeacon\s*\(/);
  assert.match(html,/type="file"/);
  assert.match(html,/Download review notes/);
  assert.match(html,/Import previous review notes/);
  assert.doesNotMatch(html,/<script>[\s\S]*localStorage/i);
});
test('question text is HTML-escaped, with no active injection of source text',()=>{
  const items=JSON.parse(catalog);
  items[0].content.fr.prompt='<img src=x onerror="alert(1)">';
  const html=renderReviewPack(JSON.stringify(items),ledger,css,js);
  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
  assert.ok(!html.includes('<img src=x onerror='));
});
test('a mismatched or incomplete ledger cannot silently produce a reviewer packet',()=>{
  const raw=JSON.parse(ledger);
  raw.entries[0].referenceKey='not-the-key';
  assert.throws(()=>renderReviewPack(catalog,JSON.stringify(raw),css,js),/Review ledger mismatch/);
  raw.entries.shift();
  assert.throws(()=>renderReviewPack(catalog,JSON.stringify(raw),css,js),/exactly the same unique question IDs/);
});

test('first private review cohort contains 16 unique IDs across every game and both exams',()=>{
  const questions=JSON.parse(catalog),byId=new Map(questions.map(q=>[q.id,q]));
  assert.equal(FIRST_REVIEW_BATCH.length,16);
  assert.equal(new Set(FIRST_REVIEW_BATCH).size,16);
  assert.ok(FIRST_REVIEW_BATCH.every(id=>byId.has(id)));
  assert.deepEqual([...new Set(FIRST_REVIEW_BATCH.map(id=>byId.get(id).exam))].sort(),['gmat','tage']);
  assert.deepEqual([...new Set(FIRST_REVIEW_BATCH.map(id=>byId.get(id).game))].sort(),
    ['argument-lab','code-logic','enough-info','expression-lab','graphics-lab','multi-source-lab','quant-lab','reading-lab','table-lab','two-part-lab']);
  assert.ok(FIRST_REVIEW_BATCH.every(id=>byId.get(id).status==='pilot'));
});
test('offline workbook defaults to first cohort while retaining all 94 items and local notes',()=>{
  const html=renderReviewPack(catalog,ledger,css,js);
  assert.equal((html.match(/data-first-batch="true"/g)||[]).length,16);
  assert.equal((html.match(/data-first-batch="false"/g)||[]).length,78);
  for(const id of FIRST_REVIEW_BATCH){
    assert.ok(html.includes('data-question="'+id+'" data-first-batch="true"'),id);
  }
  assert.match(html,/<select id="review-scope"><option value="first">/);
  assert.match(html,/<option value="all">Entire catalog \(94 pilot items\)<\/option>/);
  assert.match(html,/const updateScope=function\(\)/);
  assert.match(html,/card\.hidden=first&&card\.getAttribute\('data-first-batch'\)!=='true'/);
  assert.match(html,/const entries=cards\.map\(function\(card\)/);
  assert.match(html,/const byId=new Map\(cards\.map/);
  assert.match(html,/catalogSha256:catalogSha/);
});
test('batch IDs cannot silently drift outside the current catalog',()=>{
  const questions=JSON.parse(catalog).filter(q=>q.id!==FIRST_REVIEW_BATCH[0]);
  const state=JSON.parse(ledger);
  state.entries=state.entries.filter(entry=>entry.id!==FIRST_REVIEW_BATCH[0]);
  assert.throws(()=>renderReviewPack(JSON.stringify(questions),JSON.stringify(state),css,js),/First review batch must contain unique catalog IDs/);
});
