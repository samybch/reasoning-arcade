import {notFound} from 'next/navigation';
import {HomeScreen} from '../../components/HomeScreen';
import {getQuestions} from '../../content/catalog';
import type {Locale} from '../../engine/types';
export default async function Home({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  const questions=getQuestions();
  return <HomeScreen locale={locale as Locale} questionCount={questions.length} questionIds={questions.map(q=>q.id)}/>;
}
