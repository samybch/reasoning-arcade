import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import '../globals.css';

export const metadata:Metadata={
  title:'Reasoning Arcade · Free bilingual reasoning games',
  description:'Independent bilingual logic practice prototype with original pilot questions.',
  robots:{index:false,follow:false}
};
export function generateStaticParams(){return [{locale:'fr'},{locale:'en'}]}
export default async function LocaleRoot({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  return <html lang={locale}><body>{children}</body></html>;
}
