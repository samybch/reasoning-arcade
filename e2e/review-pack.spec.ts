import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const file=resolve('review-pack/reasoning-arcade-editorial-review.html');
const offline=pathToFileURL(file).href;

test('offline reviewer packet renders all 85 original questions and hides keys until requested',async({page})=>{
  const externalRequests:string[]=[];
  page.on('request',req=>{
    if(/^https?:/i.test(req.url()))externalRequests.push(req.url());
  });
  await page.goto(offline);
  await expect(page.getByRole('heading',{name:'Revue pédagogique / Editorial review'})).toBeVisible();
  await expect(page.locator('article[data-question]')).toHaveCount(85);
  await expect(page.locator('section.language[lang="fr"]')).toHaveCount(85);
  await expect(page.locator('section.language[lang="en"]')).toHaveCount(85);
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
  await expect(page.getByRole('status')).toContainText('Imported 1 saved findings');
  await expect(page.locator('article[data-question]').first().locator('[data-decision]')).toHaveValue('needs_changes');
  await expect(page.locator('article[data-question]').first().locator('[data-notes]')).toHaveValue(/French quantifier/);
  await page.locator('#import').setInputFiles({name:'mismatch.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...saved,catalogSha256:'different'}))});
  await expect(page.getByRole('status')).toContainText('does not match the exact question catalog');
});
