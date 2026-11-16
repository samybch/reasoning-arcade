import {test,expect} from '@playwright/test';

const PREFIX='/reasoning-arcade';

test('French and English homepages display and language navigation works',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{level:1})).toContainText('La logique');
  await expect(page.locator('html')).toHaveAttribute('lang','fr');
  await page.getByRole('link',{name:'EN',exact:true}).click();
  await expect(page).toHaveURL(new RegExp('/reasoning-arcade/en/?$'));
  await expect(page.getByRole('heading',{level:1})).toContainText('Better thinking');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
});

test('GMAT track omits numerical logic game and exposes the other two',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Code Logic',exact:true})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Argument Lab',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Enough Info?',exact:true})).toBeVisible();
});

test('game question accepts an answer and shows pedagogical correction',async({page})=>{
  await page.goto(PREFIX+'/fr/play/argument-lab/?exam=tage&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('.answer-list button')).toHaveCount(5);
  await page.locator('.answer-list button').first().click();
  await expect(page.locator('.answer-list button').first()).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.feedback')).toBeVisible();
  await expect(page.locator('.feedback p')).not.toBeEmpty();
});

test('timed GMAT mini-test gives results after six questions',async({page})=>{
  await page.goto(PREFIX+'/en/practice/?exam=gmat');
  await expect(page.getByText('GMAT',{exact:true})).toBeVisible();
  for(let n=0;n<6;n++){
    await expect(page.locator('.answer-list button').first()).toBeVisible();
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.getByText('This result is not an official exam score.')).toBeVisible();
});

test('mobile viewport has no horizontal overflow on home and on a question',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  let overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.goto(PREFIX+'/fr/play/enough-info/?exam=tage&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('French GMAT critical reasoning questions are presented in French',async({page})=>{
  await page.goto(PREFIX+'/fr/play/argument-lab/?exam=gmat&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('#question-title')).not.toContainText('Which');
  await expect(page.locator('.answer-list button').first()).not.toContainText('Most of');
});
test('browser progress can be saved and cleared without an account',async({page})=>{
  await page.goto(PREFIX+'/fr/play/argument-lab/?exam=tage&mode=game');
  const first=page.locator('.answer-list button').first();
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:/Valider/}).click();
  await page.getByRole('link',{name:/Retour/}).click();
  await expect(page.locator('.stats strong').first()).toHaveText('1');
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:/Effacer/}).click();
  await expect(page.locator('.stats strong').first()).toHaveText('0');
});

test('keyboard skip link reaches the main content',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await page.keyboard.press('Tab');
  const skip=page.getByRole('link',{name:'Aller au contenu'});
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
test('localized privacy notice explains local browser progress and reset',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await page.getByRole('link',{name:'Confidentialité'}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Confidentialité');
  await expect(page.locator('main')).toContainText('stockage local');
  await page.goto(PREFIX+'/en/privacy/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Privacy');
  await expect(page.locator('main')).toContainText('local storage');
});
