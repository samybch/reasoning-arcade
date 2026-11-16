import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../public/preview/index.html', import.meta.url), 'utf8');

test('preview contains all three game mechanics', () => {
  for(const name of ['code-logic','argument-lab','enough-info']) assert.ok(html.includes(name),name);
});
test('preview has bilingual labels and both exam tracks', () => {
  for(const name of ['GMAT','TAGE MAGE','function toggleLang']) assert.ok(html.includes(name),name);
});
test('preview includes feedback, adaptation and saved progress', () => {
  for(const name of ['function check()','function nextAdaptive()','localStorage']) assert.ok(html.includes(name),name);
});
test('preview does not embed third-party scripts', () => {
  assert.doesNotMatch(html, /<script\s+src=/i);
});
