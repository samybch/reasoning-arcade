import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderReviewPack} from '../scripts/build-review-pack.mjs';

const catalog=readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8');
const ledger=readFileSync(new URL('../docs/editorial-review-ledger.json',import.meta.url),'utf8');
const css=readFileSync(new URL('../scripts/reviewer-style.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../scripts/reviewer-client.js',import.meta.url),'utf8');

test('offline review packet contains exactly one FR/EN card per pilot and preserves source keys',()=>{
  const html=renderReviewPack(catalog,ledger,css,js);
  const questions=JSON.parse(catalog);
  assert.equal((html.match(/<article class="question" data-question=/g)||[]).length,questions.length);
  assert.equal(questions.length,76);
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
