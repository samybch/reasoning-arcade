import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import type {Question} from '../engine/types';

// Server build-time only. Never import this module in client-side components.
export function getQuestions(): Question[] {
  const html=readFileSync(join(process.cwd(),'public','preview','index.html'),'utf8');
  const marker='<script type="application/json" id="bank">';
  const start=html.indexOf(marker);
  if(start===-1)throw new Error('Missing question catalog marker');
  const end=html.indexOf('</script>',start+marker.length);
  if(end===-1)throw new Error('Unterminated question catalog');
  const value:unknown=JSON.parse(html.slice(start+marker.length,end));
  if(!Array.isArray(value)||value.length!==36)throw new Error('Invalid 36-question pilot catalog');
  return value as Question[];
}
