import {notFound} from 'next/navigation';
import {HomeScreen} from '../../components/HomeScreen';
import type {Locale} from '../../engine/types';
export default async function Home({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  return <HomeScreen locale={locale as Locale}/>;
}
