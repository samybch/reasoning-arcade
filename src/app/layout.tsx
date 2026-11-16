import type {Metadata} from 'next';
import type {ReactNode} from 'react';

export const metadata: Metadata = {
  title: 'Reasoning Arcade — Preview',
  description: 'Free bilingual logic and critical reasoning game prototype.',
  robots: { index: false, follow: false },
};

export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="fr"><body style={{margin:0}}>{children}</body></html>;
}
