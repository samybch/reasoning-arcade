import Link from 'next/link';
import type {ReactNode} from 'react';
import type {Locale} from '../engine/types';

export function ArcadeShell({locale,children}:{locale:Locale;children:ReactNode}) {
  return <div className="app-shell">
    <header className="topbar"><div className="page-width topbar-inner">
      <Link className="brand" href={`/${locale}/`}><span className="brand-icon" aria-hidden>◈</span> Reasoning <em>Arcade</em></Link>
      <nav aria-label={locale==='fr'?'Navigation':'Navigation'}>
        <Link href={`/${locale}/`}>{locale==='fr'?'Accueil':'Home'}</Link>
        <Link href={`/${locale}/practice/`}>{locale==='fr'?'Mini-test':'Mini test'}</Link>
        <Link className="language" href={locale==='fr'?'/en/':'/fr/'} hrefLang={locale==='fr'?'en':'fr'} lang={locale==='fr'?'en':'fr'}>{locale==='fr'?'EN':'FR'}</Link>
      </nav>
    </div></header>
    <main id="main" className="page-width">{children}</main>
    <footer className="page-width footer">
      <p>{locale==='fr'?'Prototype pédagogique indépendant • Sans inscription • Exercices pilotes':'Independent learning prototype • No login • Pilot exercises'}</p>
      <a href="https://github.com/samybch/reasoning-arcade" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </footer>
  </div>;
}
