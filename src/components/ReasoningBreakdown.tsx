import type {Game,Locale,QuestionText} from '../engine/types';

export function ReasoningBreakdown({text,locale,game}:{text:QuestionText;locale:Locale;game:Game}){
  if(!text.reviewSteps)return null;
  const fr=locale==='fr';
  const headings=game==='enough-info'
    ? (fr?['Information (1)','Information (2)','Verdict et justification']:['Statement (1)','Statement (2)','Verdict and justification'])
    : game==='argument-lab'
      ? (fr?["Analyser l'argument",'Évaluer les preuves','Conclure']:['Analyze the argument','Evaluate the evidence','Draw the conclusion'])
      : game==='quant-lab'
        ? (fr?['Identifier les données','Calculer','Vérifier la réponse']:['Identify the data','Calculate','Verify the answer'])
        : game==='expression-lab'
          ? (fr?['Comprendre la consigne','Éliminer les formulations inadéquates','Valider le choix']:['Understand the task','Eliminate flawed options','Confirm the best answer'])
        : game==='reading-lab'
          ? (fr?['Repérer le passage clé','Comparer les choix','Justifier la réponse']:['Locate the key passage','Compare the options','Justify the answer'])
        : (fr?['Observer la règle','Vérifier','Conclure']:['Identify the rule','Verify','Conclude']);
  return <section className="reasoning-breakdown" aria-label={fr?'Correction étape par étape':'Step-by-step explanation'}>
    <h3>{fr?'Méthode de résolution':'Step-by-step reasoning'}</h3>
    <ol>{text.reviewSteps.map((step,i)=><li key={i}><strong>{headings[i]}</strong><p>{step}</p></li>)}</ol>
  </section>;
}
