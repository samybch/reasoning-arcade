import type {Locale} from '../engine/types';

// The link is optional and navigates to GitHub only after an explicit user click.
// No answer, profile, or browser-progress data are included in the URL.
export function QuestionFeedbackLink({questionId,locale}:{questionId:string;locale:Locale}){
  const title=`question-review: ${questionId} (${locale})`;
  const href=`https://github.com/samybch/reasoning-arcade/issues/new?template=question-feedback.yml&title=${encodeURIComponent(title)}`;
  return <a className="question-feedback-link" href={href} target="_blank" rel="noopener noreferrer"
      title={locale==='fr'?'Ouvre GitHub, où un compte est nécessaire pour publier':'Opens GitHub; an account is needed to submit feedback'}>
      {locale==='fr'?'Signaler un problème avec cette question':'Report an issue with this question'} ↗
    </a>;
}
