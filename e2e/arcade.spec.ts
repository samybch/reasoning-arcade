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
  await expect(page.locator('.feedback > p').last()).not.toBeEmpty();
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
  await expect(page.getByRole('heading',{name:'Compétences travaillées'})).toBeVisible();
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:/Effacer/}).click();
  await expect(page.locator('.stats strong').first()).toHaveText('0');
  await expect(page.getByRole('heading',{name:'Compétences travaillées'})).toHaveCount(0);
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
  await expect(page.getByRole('heading',{level:1})).toContainText(/privacy/i);
  await expect(page.locator('main')).toContainText('local storage');
});

test('home displays the current catalog count, including new original pilot exercises',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await expect(page.locator('.hero-stats')).toContainText('46');
});
test('320px mobile viewport supports French and English game navigation without overflow',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  for(const url of ['/fr/','/en/','/fr/play/code-logic/?exam=tage&mode=game','/en/play/enough-info/?exam=gmat&mode=game']){
    await page.goto(PREFIX+url);
    await expect(page.locator('main')).toBeVisible();
    const amount=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(amount, `overflow at ${url}`).toBeLessThanOrEqual(1);
  }
});

test('coverage pages accurately disclose covered and missing sections in both languages',async({page})=>{
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.getByRole('heading',{name:'Couverture actuelle des examens'})).toBeVisible();
  await expect(page.getByText('46 exercices pilotes')).toBeVisible();
  await expect(page.locator('.coverage-row')).toHaveCount(14);
  await expect(page.getByText('Non couvert').first()).toBeVisible();
  await page.goto(PREFIX+'/en/coverage/');
  await expect(page.getByRole('heading',{name:'Current exam coverage'})).toBeVisible();
  await expect(page.getByText('46 pilot exercises')).toBeVisible();
});
test('new navigation remains usable at 320px without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:640});
  await page.goto(PREFIX+'/fr/');
  await page.getByRole('link',{name:'Programme'}).click();
  await expect(page.getByRole('heading',{name:'Couverture actuelle des examens'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test('incorrectly answered items can be reviewed by exam, then cleared after success',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await page.evaluate(()=>{
    localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
      version:1,skills:{},totalAnswered:2,totalCorrect:0,recentQuestionIds:[],
      pendingReviewIds:['T-L-01','G-D-13']
    }));
  });
  await page.reload();
  await expect(page.getByRole('link',{name:/Revoir mes erreurs/})).toBeVisible();
  await page.getByRole('link',{name:/Revoir mes erreurs/}).click();
  await expect(page).toHaveURL(/\/fr\/review\/\?exam=tage/);
  await expect(page.locator('#question-title')).toBeVisible();
  await page.locator('.answer-list button').nth(2).click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.feedback.good')).toBeVisible();
  await page.getByRole('button',{name:/Terminer/}).click();
  await expect(page.getByRole('heading',{name:'Tes résultats'})).toBeVisible();
  await page.getByRole('link',{name:'Accueil'}).first().click();
  await expect(page.getByRole('link',{name:/Revoir mes erreurs/})).toHaveCount(0);
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('link',{name:/Revoir mes erreurs/})).toBeVisible();
});
test('empty error queue displays a useful state instead of an empty challenge',async({page})=>{
  await page.goto(PREFIX+'/en/review/?exam=gmat');
  await expect(page.getByRole('heading',{name:'No mistakes to review in this track'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Home'}).first()).toBeVisible();
});
test('review page stays consistent with progress reset and missing local IDs',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await page.evaluate(()=>{
    localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
      version:1,skills:{},totalAnswered:4,totalCorrect:2,
      pendingReviewIds:['T-L-999','T-L-01','T-L-01','invalid-id','G-D-13']
    }));
  });
  await page.reload();
  await expect(page.getByRole('link',{name:/Revoir mes erreurs/})).toBeVisible();
  await expect(page.locator('.review-cta')).toContainText('1 exercice(s)');
  await page.getByRole('link',{name:/Revoir mes erreurs/}).click();
  await expect(page.locator('#question-title')).toBeVisible();
  await page.getByRole('link',{name:/Retour/}).click();
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:/Effacer/}).click();
  await expect(page.getByRole('link',{name:/Revoir mes erreurs/})).toHaveCount(0);
});

test('data sufficiency gives 3 review steps only after submitting in game mode',async({page})=>{
  await page.goto(PREFIX+'/fr/play/enough-info/?exam=tage&mode=game');
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown')).toBeVisible();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
  await expect(page.locator('.feedback')).toContainText('Réponse attendue');
});
test('timed data sufficiency hides explanations until final results, including English steps',async({page})=>{
  await page.goto(PREFIX+'/en/play/enough-info/?exam=gmat&mode=exam');
  for(let i=0;i<5;i++){
    await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(5);
  await expect(page.locator('.reasoning-breakdown').first().locator('li')).toHaveCount(3);
  await expect(page.locator('.review-answer').first()).toContainText('Correct answer');
});

test('Argument Lab displays three teaching stages only after answer in French game mode',async({page})=>{
  await page.goto(PREFIX+'/fr/play/argument-lab/?exam=tage&mode=game');
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
  await expect(page.getByText("Analyser l'argument")).toBeVisible();
  await expect(page.getByText('Évaluer les preuves')).toBeVisible();
});
test('timed GMAT Argument Lab hides solution until the session is finished',async({page})=>{
  await page.goto(PREFIX+'/en/play/argument-lab/?exam=gmat&mode=exam');
  for(let i=0;i<5;i++){
    await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(5);
  await expect(page.getByText('Analyze the argument').first()).toBeVisible();
});
test('long Argument Lab reasoning fits 320px screens',async({page})=>{
  await page.setViewportSize({width:320,height:640});
  await page.goto(PREFIX+'/en/play/argument-lab/?exam=gmat&mode=game');
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Submit/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
