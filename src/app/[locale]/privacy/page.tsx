import {notFound} from 'next/navigation';
import {ArcadeShell} from '../../../components/ArcadeShell';
import type {Locale} from '../../../engine/types';

export function generateStaticParams(){return [{locale:'fr'},{locale:'en'}]}

export default async function PrivacyPage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(locale!=='fr'&&locale!=='en')notFound();
  const fr=locale==='fr';
  return <ArcadeShell locale={locale as Locale}>
    <section className="quiz-card" style={{marginTop:45}}>
      <p className="eyebrow">REASONING ARCADE · {fr?'DONNÉES PERSONNELLES':'PERSONAL DATA'}</p>
      <h1>{fr?'Confidentialité du prototype':'Prototype privacy information'}</h1>
      <p>{fr?'Ce document décrit le fonctionnement technique du prototype et ne remplace pas les mentions légales et la politique à valider avant lancement public.':'This page explains how the current prototype works and does not replace the legal notices and policies still required before public launch.'}</p>
      <h2>{fr?'Progression enregistrée localement':'Progress saved in local storage'}</h2>
      <p>{fr?'L’application enregistre les réponses agrégées et la maîtrise par compétence dans le stockage local (localStorage) de ton navigateur sous la clé reasoning-arcade:progress:v1.':'The application saves aggregated responses and per-skill progress in your browser’s local storage (localStorage), under the key reasoning-arcade:progress:v1.'}</p>
      <p>{fr?'Ces informations restent sur cet appareil : aucun compte, serveur applicatif, base de données ou synchronisation n’est utilisé pour les résultats.':'This information stays on this device: no accounts, application server, database or result synchronization is used.'}</p>
      <h2>{fr?'Suppression et limites':'Deletion and limitations'}</h2>
      <p>{fr?'Le bouton « Effacer » sur l’accueil supprime cette progression locale. Tu peux également effacer les données du site depuis les paramètres de ton navigateur. La progression ne sera pas automatiquement transférée sur un autre appareil.':'The “Reset” button on the home screen deletes this local progress. You may also clear site data using your browser settings. Progress does not automatically transfer to another device.'}</p>
      <h2>{fr?'Cookies, hébergeur et GitHub':'Cookies, hosting and GitHub'}</h2>
      <p>{fr?'Le code actuel ne met pas en place de cookies publicitaires ni d’outils d’analyse. L’hébergeur peut néanmoins traiter des journaux techniques de connexion selon ses propres règles. Les contributions proposées sur GitHub relèvent également des conditions et règles de confidentialité de GitHub.':'The current application does not implement advertising cookies or analytics tools. The hosting provider may nevertheless process technical connection logs under its own policies. Contributions submitted on GitHub are also subject to GitHub’s policies.'}</p>
      <p className="note">{fr?'Prototype indépendant non affilié aux organismes des examens. Aucune donnée d’examen officiel ni score officiel.':'Independent prototype not affiliated with exam organizations. No official exam data or official score claims.'}</p>
    </section>
  </ArcadeShell>;
}
