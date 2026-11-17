import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const quantBank=JSON.parse(readFileSync(new URL('../src/content/questions.json',import.meta.url),'utf8')) as Array<{id:string;game:string;correctAnswer:string;content:{en:{prompt:string}}}>;
async function chooseWrongQuantAnswer(page:import('@playwright/test').Page){
  const prompt=await page.locator('#question-title').textContent();
  const q=quantBank.find(x=>x.game==='quant-lab'&&x.content.en.prompt===prompt);
  expect(q,'expected known quantitative pilot question').toBeDefined();
  await page.locator('.answer-list button').nth((Number(q!.correctAnswer)+1)%5).click();
}

async function answerMixedQuestion(page:import('@playwright/test').Page){
  if(await page.locator('.graphic-statement').count()){
    for(const statement of await page.locator('.graphic-statement').all())await statement.locator('select').selectOption('0');
  }else if(await page.locator('.table-claim').count()){
    for(let i=0;i<3;i++)await page.locator('.table-claim').nth(i).getByRole('radio',{name:'Yes'}).check();
  }else await page.locator('.answer-list button').first().click();
}

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
    await expect(page.locator('#question-title')).toBeVisible();
    await answerMixedQuestion(page);
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
  await expect(page.locator('.hero-stats')).toContainText('91');
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
  await expect(page.getByText('91 exercices pilotes')).toBeVisible();
  await expect(page.locator('.coverage-row')).toHaveCount(14);
  await expect(page.getByText('Non couvert').first()).toBeVisible();
  await page.goto(PREFIX+'/en/coverage/');
  await expect(page.getByRole('heading',{name:'Current exam coverage'})).toBeVisible();
  await expect(page.getByText('91 pilot exercises')).toBeVisible();
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

test('question feedback link identifies the exercise without transmitting any answer',async({page})=>{
  await page.goto(PREFIX+'/fr/play/enough-info/?exam=tage&mode=game');
  const link=page.getByRole('link',{name:/Signaler un problème avec cette question/});
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target','_blank');
  const href=await link.getAttribute('href');
  expect(href).toContain('github.com/samybch/reasoning-arcade/issues/new?template=question-feedback.yml');
  expect(href).toMatch(/question-review%3A%20T-D-\d+/);
  expect(href).not.toContain('correctAnswer');
  expect(href).not.toContain('pendingReviewIds');
});
test('timed review exposes question-specific feedback links only after completing the test',async({page})=>{
  await page.goto(PREFIX+'/en/play/enough-info/?exam=gmat&mode=exam');
  for(let i=0;i<5;i++){
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.getByRole('link',{name:/Report an issue with this question/})).toHaveCount(5);
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(5);
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

test('Code Logic stages are revealed after submitting, in French',async({page})=>{
  await page.goto(PREFIX+'/fr/play/code-logic/?exam=tage&mode=game');
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
  await expect(page.getByText('Observer la règle')).toBeVisible();
});
test('timed Code Logic mini-test keeps solution steps hidden until the results',async({page})=>{
  await page.goto(PREFIX+'/en/play/code-logic/?exam=tage&mode=exam');
  for(let i=0;i<5;i++){
    await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(5);
  await expect(page.getByText('Identify the rule').first()).toBeVisible();
});

test('Quant Lab is offered on both tracks with five answers and detailed feedback',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{name:'Quant Lab'})).toBeVisible();
  await expect(page.locator('.hero-stats')).toContainText('9 jeux');
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Quant Lab'})).toBeVisible();
  await page.goto(PREFIX+'/fr/play/quant-lab/?exam=tage&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('.answer-list button')).toHaveCount(5);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
});
test('GMAT Quant Lab completes a five-question timed practice session',async({page})=>{
  await page.goto(PREFIX+'/en/play/quant-lab/?exam=gmat&mode=exam');
  await expect(page.locator('#question-title')).toBeVisible();
  for(let i=0;i<5;i++){
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.locator('.result-card')).toContainText('5 attempted');
});
test('quantitative exercises remain usable at 320px in French and English',async({page})=>{
  await page.setViewportSize({width:320,height:680});
  for(const suffix of ['/fr/play/quant-lab/?exam=tage&mode=game','/en/play/quant-lab/?exam=gmat&mode=game']){
    await page.goto(PREFIX+suffix);
    await expect(page.locator('#question-title')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),suffix).toBeLessThanOrEqual(1);
  }
});
test('coverage now lists six quantitative pilots for each track',async({page})=>{
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.getByText('Calcul',{exact:true})).toBeVisible();
  await expect(page.getByText('91 exercices pilotes')).toBeVisible();
  await page.goto(PREFIX+'/en/coverage/');
  await expect(page.getByText('91 pilot exercises')).toBeVisible();
  await expect(page.locator('.coverage-row')).toHaveCount(14);
});

test('Quant Lab mistake history survives browser reload for both exams',async({page})=>{
  for(const [exam,prefix] of [['tage','T-C'],['gmat','G-Q']] as const){
    await page.goto(PREFIX+`/en/play/quant-lab/?exam=${exam}&mode=game`);
    const firstPrompt=await page.locator('#question-title').textContent();
    await chooseWrongQuantAnswer(page);
    await page.getByRole('button',{name:/Submit/}).click();
    await expect(page.locator('.feedback.bad')).toBeVisible();
    await page.reload();
    const nextPrompt=await page.locator('#question-title').textContent();
    expect(nextPrompt).not.toBe(firstPrompt);
    await chooseWrongQuantAnswer(page);
    await page.getByRole('button',{name:/Submit/}).click();
    await expect(page.locator('.feedback.bad')).toBeVisible();
    const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
    expect(data.recentQuestionIds.filter((id:string)=>id.startsWith(prefix))).toHaveLength(2);
    expect(data.pendingReviewIds.filter((id:string)=>id.startsWith(prefix))).toHaveLength(2);
    await page.goto(PREFIX+'/en/');
    if(exam==='gmat')await page.getByRole('button',{name:/GMAT/}).click();
    await expect(page.locator('.review-cta')).toContainText('2 exercise(s)');
  }
});
test('mixed mini-tests include all available skills for TAGE and GMAT',async({page})=>{
  for(const [exam,expected] of [['tage',['A','C','D','E','L','R']],['gmat',['A','D','M','Q','R','T']]] as const){
    await page.goto(PREFIX+`/en/practice/?exam=${exam}`);
    for(let i=0;i<6;i++){
      await expect(page.locator('#question-title')).toBeVisible();
      await answerMixedQuestion(page);
      await page.getByRole('button',{name:/Submit/}).click();
    }
    await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
    const seen=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}').recentQuestionIds as string[]);
    const categories=[...new Set(seen.slice(-6).map(id=>id.split('-')[1]))].sort();
    if(exam==='tage')expect(categories).toEqual(expected);
    else {expect(categories).toHaveLength(6);expect(categories.every(c=>['A','D','I','M','Q','R','T'].includes(c))).toBe(true);}
  }
});

test('Quant Lab clock reflects the actual pilot question budget and warns that it is not official',async({page})=>{
  await page.goto(PREFIX+'/en/play/quant-lab/?exam=gmat&mode=exam');
  await expect(page.locator('#question-title')).toBeVisible();
  const clock=await page.locator('.timer').textContent();
  const parts=(clock||'').split(':').map(Number);
  expect(parts).toHaveLength(2);
  expect(parts[0]*60+parts[1]).toBeGreaterThan(500); // Five quantitative questions, unlike the former fixed 400s.
  await expect(page.locator('.quiz-card')).toContainText("not an official exam limit");
});

test('Reading Lab appears on both tracks with 5 response choices and explanations',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await expect(page.locator('.hero-stats')).toContainText('9 jeux');
  await expect(page.getByRole('heading',{name:'Reading Lab'})).toBeVisible();
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Reading Lab'})).toBeVisible();
  await page.goto(PREFIX+'/fr/play/reading-lab/?exam=tage&mode=game');
  await expect(page.locator('.reading-passage')).toBeVisible();
  await expect(page.locator('.reading-passage')).not.toBeEmpty();
  await expect(page.locator('.answer-list button')).toHaveCount(5);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
});
test('Reading Lab GMAT timed mini-test uses deferred explanations',async({page})=>{
  await page.goto(PREFIX+'/en/play/reading-lab/?exam=gmat&mode=exam');
  await expect(page.locator('.reading-passage')).toBeVisible();
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(0);
  for(let i=0;i<5;i++){
    await page.locator('.answer-list button').first().click();
    await page.getByRole('button',{name:/Submit/}).click();
  }
  await expect(page.getByRole('heading',{name:'Your results'})).toBeVisible();
  await expect(page.locator('.reasoning-breakdown')).toHaveCount(5);
});
test('long reading passages fit 320px mobile screens in both languages',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  for(const suffix of ['/fr/play/reading-lab/?exam=tage&mode=game','/en/play/reading-lab/?exam=gmat&mode=game']){
    await page.goto(PREFIX+suffix);
    await expect(page.locator('.reading-passage')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth),suffix).toBeLessThanOrEqual(1);
  }
});
test('syllabus coverage includes nine reading questions for each exam pathway',async({page})=>{
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.getByText('91 exercices pilotes')).toBeVisible();
  await expect(page.getByText('Compréhension de textes',{exact:true})).toBeVisible();
  await page.goto(PREFIX+'/en/coverage/');
  await expect(page.getByText('91 pilot exercises')).toBeVisible();
  await expect(page.locator('.coverage-row')).toHaveCount(14);
});

test('Reading Lab recent attempts and pending review survive reload in both exam tracks',async({page})=>{
  for(const [exam,id] of [['tage','T-R-01'],['gmat','G-R-01']] as const){
    await page.goto(PREFIX+`/en/play/reading-lab/?exam=${exam}&mode=game`);
    await page.evaluate((questionId)=>{
      localStorage.removeItem('reasoning-arcade:progress:v1');
      localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
        version:1,skills:{},totalAnswered:1,totalCorrect:0,
        recentQuestionIds:[questionId],pendingReviewIds:[questionId]
      }));
    },id);
    await page.reload();
    await expect(page.locator('#question-title')).toBeVisible();
    await page.goto(PREFIX+`/en/review/?exam=${exam}`);
    await expect(page.locator('#question-title')).toBeVisible();
    const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
    expect(persisted.recentQuestionIds).toContain(id);
    expect(persisted.pendingReviewIds).toContain(id);
    expect(persisted.pendingReviewIds.filter((v:string)=>v.endsWith('-R-01'))).toEqual([id]);
  }
});

test('Expression Lab is TAGE-only and offers French grammar, paraphrase and coherence pilots',async({page})=>{
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{name:'Expression Lab'})).toBeVisible();
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Expression Lab'})).toHaveCount(0);
  await page.goto(PREFIX+'/fr/play/expression-lab/?exam=tage&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('.answer-list button')).toHaveCount(5);
  await page.locator('.answer-list button').first().click();
  await page.getByRole('button',{name:/Valider/}).click();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
  await page.goto(PREFIX+'/en/play/expression-lab/?exam=tage&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('.answer-list button')).toHaveCount(5);
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.getByText('Expression',{exact:true})).toBeVisible();
  await expect(page.locator('.coverage-row').filter({hasText:'Expression'})).toContainText('6 pilotes');
});
test('Expression Lab recent history survives reload and appears in TAGE review',async({page})=>{
  await page.goto(PREFIX+'/en/play/expression-lab/?exam=tage&mode=game');
  await page.evaluate(()=>{
    localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
      version:1,skills:{},totalAnswered:1,totalCorrect:0,
      recentQuestionIds:['T-E-01'],pendingReviewIds:['T-E-01']
    }));
  });
  await page.reload();
  await page.goto(PREFIX+'/en/review/?exam=tage');
  await expect(page.locator('#question-title')).toBeVisible();
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
  expect(progress.pendingReviewIds).toContain('T-E-01');
});

test('GMAT Table Lab sorts numerical data and requires all three Yes/No answers',async({page})=>{
  await page.goto(PREFIX+'/en/');
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Table Lab'})).toBeVisible();
  await page.goto(PREFIX+'/en/play/table-lab/?exam=gmat&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  await expect(page.locator('.table-claim')).toHaveCount(3);
  const submit=page.getByRole('button',{name:/Submit/});
  await expect(submit).toBeDisabled();
  const sales=page.getByRole('columnheader',{name:/Sales/}).getByRole('button');
  await sales.click();
  await expect(page.locator('.data-table tbody tr').first().locator('td').first()).toHaveText('East');
  await sales.click();
  await expect(page.locator('.data-table tbody tr').first().locator('td').first()).toHaveText('West');
  for(const [i,answer] of ['Yes','No','Yes'].entries()){
    await page.locator('.table-claim').nth(i).getByRole('radio',{name:answer}).check();
  }
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.locator('.feedback.good')).toBeVisible();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
});
test('Table Lab is GMAT-only and remains usable in a 320px viewport',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{name:'Table Lab'})).toHaveCount(0);
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Table Lab'})).toBeVisible();
  await page.goto(PREFIX+'/fr/play/table-lab/?exam=gmat&mode=game');
  await expect(page.locator('.table-scroll')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.locator('.coverage-row').filter({hasText:'Table Analysis'})).toContainText('3 pilotes');
});
test('Table Lab history and missed questions survive browser reload',async({page})=>{
  await page.goto(PREFIX+'/en/play/table-lab/?exam=gmat&mode=game');
  await page.evaluate(()=>localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
    version:1,skills:{},totalAnswered:1,totalCorrect:0,
    recentQuestionIds:['G-T-01'],pendingReviewIds:['G-T-01']
  })));
  await page.reload();
  await page.goto(PREFIX+'/en/review/?exam=gmat');
  await expect(page.locator('.table-claim')).toHaveCount(3);
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
  expect(p.recentQuestionIds).toContain('G-T-01');
  expect(p.pendingReviewIds).toContain('G-T-01');
});

test('GMAT Multi-Source Lab switches three sources using mouse and keyboard',async({page})=>{
  await page.goto(PREFIX+'/en/');
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Multi-Source Lab'})).toBeVisible();
  await page.goto(PREFIX+'/en/play/multi-source-lab/?exam=gmat&mode=game');
  await expect(page.locator('#question-title')).toBeVisible();
  const tabs=page.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected','true');
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await expect(page.locator('[role="tabpanel"]:visible')).toContainText('€3,500');
  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');
  await expect(page.locator('[role="tabpanel"]:visible')).toContainText('€200');
  await page.locator('.answer-list button').nth(2).click();
  await page.getByRole('button',{name:/Submit/}).click();
  await expect(page.locator('.feedback.good')).toBeVisible();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
});
test('Multi-Source Lab is GMAT-only and has no horizontal overflow on narrow mobile',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{name:'Multi-Source Lab'})).toHaveCount(0);
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Multi-Source Lab'})).toBeVisible();
  await page.goto(PREFIX+'/fr/play/multi-source-lab/?exam=gmat&mode=game');
  await expect(page.getByRole('tab')).toHaveCount(3);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.locator('.coverage-row').filter({hasText:'Multi-Source Reasoning'})).toContainText('3 pilotes');
});
test('Multi-Source Lab pending review survives reload in GMAT track',async({page})=>{
  await page.goto(PREFIX+'/en/play/multi-source-lab/?exam=gmat&mode=game');
  await page.evaluate(()=>localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
    version:1,skills:{},totalAnswered:1,totalCorrect:0,
    recentQuestionIds:['G-M-01'],pendingReviewIds:['G-M-01']
  })));
  await page.reload();
  await page.goto(PREFIX+'/en/review/?exam=gmat');
  await expect(page.getByRole('tab')).toHaveCount(3);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
  expect(stored.recentQuestionIds).toContain('G-M-01');
  expect(stored.pendingReviewIds).toContain('G-M-01');
});

test('GMAT Graphics Lab shows responsive bar chart and requires two dropdown answers',async({page})=>{
  await page.goto(PREFIX+'/en/');
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Graph Lab'})).toBeVisible();
  await page.goto(PREFIX+'/en/play/graphics-lab/?exam=gmat&mode=game');
  await expect(page.locator('.graphics-svg')).toBeVisible();
  await expect(page.locator('.graphics-data')).toBeVisible();
  await expect(page.locator('.graphic-statement')).toHaveCount(2);
  const submit=page.getByRole('button',{name:/Submit/});
  await expect(submit).toBeDisabled();
  await page.locator('.graphic-statement').nth(0).locator('select').selectOption('3');
  await expect(submit).toBeDisabled();
  await page.locator('.graphic-statement').nth(1).locator('select').selectOption('1');
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.locator('.feedback.good')).toBeVisible();
  await expect(page.locator('.reasoning-breakdown li')).toHaveCount(3);
});
test('Graphics Lab remains GMAT-only and readable at 320px',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.goto(PREFIX+'/fr/');
  await expect(page.getByRole('heading',{name:'Graph Lab'})).toHaveCount(0);
  await page.getByRole('button',{name:/GMAT/}).click();
  await expect(page.getByRole('heading',{name:'Graph Lab'})).toBeVisible();
  await page.goto(PREFIX+'/fr/play/graphics-lab/?exam=gmat&mode=game');
  await expect(page.locator('.graphic-statement')).toHaveCount(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  await page.goto(PREFIX+'/fr/coverage/');
  await expect(page.locator('.coverage-row').filter({hasText:'Graphics Interpretation'})).toContainText('3 pilotes');
});
test('Graphics Lab recent history and review items survive reload',async({page})=>{
  await page.goto(PREFIX+'/en/play/graphics-lab/?exam=gmat&mode=game');
  await page.evaluate(()=>localStorage.setItem('reasoning-arcade:progress:v1',JSON.stringify({
    version:1,skills:{},totalAnswered:1,totalCorrect:0,
    recentQuestionIds:['G-I-01'],pendingReviewIds:['G-I-01']
  })));
  await page.reload();
  await page.goto(PREFIX+'/en/review/?exam=gmat');
  await expect(page.locator('.graphic-statement')).toHaveCount(2);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('reasoning-arcade:progress:v1')||'{}'));
  expect(saved.pendingReviewIds).toContain('G-I-01');
  expect(saved.recentQuestionIds).toContain('G-I-01');
});
