import Link from 'next/link';
export default function Start(){return <main className="page-width" style={{paddingTop:80}}>
  <h1>Reasoning Arcade</h1><p>Choose a language / Choisissez une langue</p>
  <div className="actions"><Link className="button primary" href="/fr/">Français</Link><Link className="button secondary" href="/en/">English</Link></div>
  <p className="note">Independent, non-official learning prototype.</p>
</main>}
