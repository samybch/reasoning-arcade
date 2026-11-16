import {notFound} from 'next/navigation';
import {PlayScreen} from '../../../components/PlayScreen';
import {getQuestions} from '../../../content/catalog';
import type {Locale} from '../../../engine/types';

export function generateStaticParams(){return [{locale:'fr'},{locale:'en'}]}

export default async function ReviewPage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  return <PlayScreen locale={locale as Locale} game="mixed" bank={getQuestions()} reviewOnly/>;
}
