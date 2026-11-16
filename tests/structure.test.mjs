import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('user-facing app uses React game components, not an embedded iframe',()=>{
  const page=readFileSync(new URL('../src/app/[locale]/play/[game]/page.tsx',import.meta.url),'utf8');
  assert.match(page,/PlayScreen/);
  assert.doesNotMatch(page,/<iframe/i);
});

test('question catalog imports the versioned JSON source of truth',()=>{
  const module=readFileSync(new URL('../src/content/catalog.ts',import.meta.url),'utf8');
  assert.match(module,/questions\.json/);
  assert.doesNotMatch(module,/preview\/index\.html/);
});
