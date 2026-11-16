import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import './globals.css';

export const metadata:Metadata={
  title:'Reasoning Arcade · Free bilingual reasoning games',
  description:'Independent bilingual prototype of TAGE MAGE and GMAT reasoning games. Original pilot questions.',
  robots:{index:false,follow:false}
};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="fr"><body>{children}</body></html>}
