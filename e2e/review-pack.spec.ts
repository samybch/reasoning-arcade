import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const file=resolve('review-pack/reasoning-arcade-editorial-review.html');
const offline=pathToFileURL(file).href;

test('offline reviewer packet renders all 94 original questions and hides keys until requested',async({page})=>{
  const externalRequests:string[]=[];
  page.on('request',req=>{
    if(/^https?:/i.test(req.url()))externalRequests.push(req.url());
  });
  await page.goto(offline);
  await expect(page.getByRole('heading',{name:'Revue pédagogique / Editorial review'})).toBeVisible();
  await expect(page.locator('article[data-question]')).toHaveCount(94);
  await expect(page.locator('section.language[lang="fr"]')).toHaveCount(94);
  await expect(page.locator('section.language[lang="en"]')).toHaveCount(94);
  await expect(page.locator('.answer').first()).not.toHaveAttribute('open','');
  await page.locator('.answer summary').first().click();
  await expect(page.locator('.answer').first()).toHaveAttribute('open','');
  expect(externalRequests).toEqual([]);
});
test('offline export and import recover reviewer notes without transferring data',async({page})=>{
  await page.goto(offline);
  const first=page.locator('article[data-question]').first();
  await first.locator('[data-decision]').selectOption('needs_changes');
  await first.locator('[data-notes]').fill('Check French quantifier and verify whether option B is also plausible.');
  const result=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download review notes (JSON)'}).click();
  const download=await result;
  expect(download.suggestedFilename()).toBe('reasoning-arcade-review-notes.json');
  const savedPath=await download.path();
  expect(savedPath).toBeTruthy();
  const saved=JSON.parse(readFileSync(savedPath!,'utf8'));
  expect(saved.entries).toHaveLength(1);
  expect(saved.entries[0].finding).toBe('needs_changes');
  await page.reload();
  await expect(page.locator('article[data-question]').first().locator('[data-decision]')).toHaveValue('unreviewed');
  await page.locator('#import').setInputFiles({name:'notes.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await expect(page.getByRole('status')).toContainText('Imported 1 new findings');
  await expect(page.locator('article[data-question]').first().locator('[data-decision]')).toHaveValue('needs_changes');
  await expect(page.locator('article[data-question]').first().locator('[data-notes]')).toHaveValue(/French quantifier/);
  await page.locator('#import').setInputFiles({name:'mismatch.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...saved,catalogSha256:'different'}))});
  await expect(page.getByRole('status')).toContainText('does not match the exact question catalog');
});

test('first cohort shows sixteen pilot cards, switching scope preserves hidden observations',async({page})=>{
  await page.goto(offline);
  const scope=page.locator('#review-scope');
  await expect(scope).toHaveValue('first');
  await expect(page.locator('article[data-question]:visible')).toHaveCount(16);
  await expect(page.locator('article[data-question]')).toHaveCount(94);
  const chosen=page.locator('article[data-question="T-A-02"]');
  await expect(chosen).toBeVisible();
  await chosen.locator('[data-decision]').selectOption('uncertain');
  await chosen.locator('[data-notes]').fill('Needs independent sampling review');
  await scope.selectOption('all');
  await expect(page.locator('article[data-question]:visible')).toHaveCount(94);
  const outside=page.locator('article[data-question="T-L-02"]');
  await outside.locator('[data-decision]').selectOption('needs_changes');
  await outside.locator('[data-notes]').fill('Alternative continuation');
  await scope.selectOption('first');
  await expect(outside).toBeHidden();
  await expect(chosen.locator('[data-notes]')).toHaveValue('Needs independent sampling review');
  const downloadReady=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download review notes (JSON)'}).click();
  const download=await downloadReady;
  const saved=JSON.parse(readFileSync((await download.path())!,'utf8'));
  assertNoApprovals(saved);
  expect(saved.entries.map((entry:{id:string})=>entry.id).sort()).toEqual(['T-A-02','T-L-02']);
  await scope.selectOption('all');
  await expect(outside.locator('[data-notes]')).toHaveValue('Alternative continuation');
});
test('safe import merges new notes while preserving conflicting visible and hidden observations',async({page})=>{
  await page.goto(offline);
  const existing=page.locator('article[data-question="T-A-02"]');
  const hidden=page.locator('article[data-question="T-L-02"]');
  const newCard=page.locator('article[data-question="G-R-09"]');
  await existing.locator('[data-decision]').selectOption('uncertain');
  await existing.locator('[data-notes]').fill('Local independent review remains unresolved');
  await page.locator('#review-scope').selectOption('all');
  await hidden.locator('[data-decision]').selectOption('needs_changes');
  await hidden.locator('[data-notes]').fill('Existing hidden counterexample');
  await page.locator('#review-scope').selectOption('first');
  const catalogSha256=await page.locator('#questions').getAttribute('data-catalog-sha');
  const report={schemaVersion:1,catalogSha256,entries:[
    {id:'T-A-02',finding:'no_issue_spotted',notes:'Contradicts visible local notes'},
    {id:'T-L-02',finding:'unreviewed',notes:''},
    {id:'G-R-09',finding:'uncertain',notes:'New independent observation'}
  ]};
  const asFile=(value:unknown)=>({name:'review.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(value))});
  await page.locator('#import').setInputFiles(asFile(report));
  await expect(page.getByRole('status')).toContainText('Imported 1 new findings');
  await expect(page.getByRole('status')).toContainText('2 conflicts skipped (T-A-02, T-L-02)');
  await expect(existing.locator('[data-decision]')).toHaveValue('uncertain');
  await expect(existing.locator('[data-notes]')).toHaveValue('Local independent review remains unresolved');
  await expect(hidden.locator('[data-notes]')).toHaveValue('Existing hidden counterexample');
  await expect(newCard.locator('[data-notes]')).toHaveValue('New independent observation');
  // Reimporting cannot erase the first import and must keep both conflicts.
  await page.locator('#import').setInputFiles(asFile(report));
  await expect(page.getByRole('status')).toContainText('Imported 0 new findings; 1 already matching; 2 conflicts skipped');
  const downloadReady=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download review notes (JSON)'}).click();
  const saved=JSON.parse(readFileSync((await (await downloadReady).path())!,'utf8'));
  expect(saved.entries).toHaveLength(3);
  expect(saved.entries.find((item:{id:string})=>item.id==='T-L-02').notes).toBe('Existing hidden counterexample');
  expect(saved.entries.find((item:{id:string})=>item.id==='T-A-02').notes).toBe('Local independent review remains unresolved');
  assertNoApprovals(saved);
});

test('invalid import is rejected atomically without losing existing local observations',async({page})=>{
  await page.goto(offline);
  const existing=page.locator('article[data-question="T-A-02"]');
  await existing.locator('[data-notes]').fill('Do not erase local notes');
  const catalogSha256=await page.locator('#questions').getAttribute('data-catalog-sha');
  const report={schemaVersion:1,catalogSha256,entries:[
    {id:'G-R-09',finding:'uncertain',notes:'Would otherwise be imported'},
    {id:'T-A-02',finding:'approved',notes:'Invalid status must reject everything'}
  ]};
  await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});
  await expect(page.getByRole('status')).toContainText('Import rejected');
  await expect(existing.locator('[data-notes]')).toHaveValue('Do not erase local notes');
  await expect(page.locator('article[data-question="G-R-09"] [data-notes]')).toHaveValue('');
});

function assertNoApprovals(saved:{entries:Array<{finding:string}>}){
  expect(saved.entries.every(entry=>entry.finding!=='approved')).toBeTruthy();
}
