import {notFound} from 'next/navigation';
import {PlayScreen} from '../../../../components/PlayScreen';
import {getQuestions} from '../../../../content/catalog';
import type {Game,Locale} from '../../../../engine/types';
const GAMES:Game[]=['code-logic','argument-lab','enough-info','quant-lab','reading-lab','expression-lab'];
export function generateStaticParams(){return ['fr','en'].flatMap(locale=>GAMES.map(game=>({locale,game})))}
export default async function Page({params}:{params:Promise<{locale:string;game:string}>}){
  const {locale,game}=await params;
  if((locale!=='fr'&&locale!=='en')||!GAMES.includes(game as Game))notFound();
  return <PlayScreen locale={locale as Locale} game={game as Game} bank={getQuestions()}/>;
}
