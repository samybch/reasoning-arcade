import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import '../globals.css';

export const metadata:Metadata={
  title:'Reasoning Arcade · Free bilingual reasoning games',
  description:'Independent bilingual logic practice prototype with original pilot questions.',
  robots:{index:false,follow:false}
};
export default function LandingLayout({children}:{children:ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
