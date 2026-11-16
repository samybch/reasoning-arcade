// Runs only in an explicitly opened local HTML file. Never accesses the network.
(function(){
  'use strict';
  const main=document.getElementById('questions');
  const catalogSha=main.getAttribute('data-catalog-sha');
  const cards=Array.from(document.querySelectorAll('article[data-question]'));
  const status=document.getElementById('status');
  const filePicker=document.getElementById('import');
  const allowed=new Set(['unreviewed','no_issue_spotted','needs_changes','uncertain']);
  const byId=new Map(cards.map(card=>[card.getAttribute('data-question'),card]));
  const updateStatus=function(){
    const done=cards.filter(card=>card.querySelector('[data-decision]').value!=='unreviewed').length;
    status.textContent=done+' / '+cards.length+' findings recorded (not approvals).';
  };
  for(const card of cards){
    card.querySelector('[data-decision]').addEventListener('change',updateStatus);
    card.querySelector('[data-notes]').addEventListener('input',updateStatus);
  }
  document.getElementById('export').addEventListener('click',function(){
    const entries=cards.map(function(card){
      const id=card.getAttribute('data-question');
      return {id:id,finding:card.querySelector('[data-decision]').value,notes:card.querySelector('[data-notes]').value.slice(0,3000)};
    }).filter(entry=>entry.finding!=='unreviewed'||entry.notes.trim().length>0);
    const documentData={
      schemaVersion:1,catalogSha256:catalogSha,exportedAt:new Date().toISOString(),
      note:'These are review observations, NOT editorial approval or official exam scores.',
      entries:entries
    };
    const blob=new Blob([JSON.stringify(documentData,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.download='reasoning-arcade-review-notes.json';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
    status.textContent='Saved '+entries.length+' findings to a local JSON file.';
  });
  filePicker.addEventListener('change',async function(){
    const file=filePicker.files&&filePicker.files[0];
    if(!file)return;
    try{
      if(file.size>1024*1024)throw new Error('Review notes file is too large (max 1 MB)');
      const value=JSON.parse(await file.text());
      if(value.schemaVersion!==1||value.catalogSha256!==catalogSha||!Array.isArray(value.entries))throw new Error('This report does not match the exact question catalog version');
      const seen=new Set();
      for(const entry of value.entries){
        if(!entry||!byId.has(entry.id)||seen.has(entry.id)||!allowed.has(entry.finding)||typeof entry.notes!=='string'||entry.notes.length>3000)throw new Error('Invalid review record for this catalog');
        seen.add(entry.id);
      }
      for(const card of cards){
        card.querySelector('[data-decision]').value='unreviewed';
        card.querySelector('[data-notes]').value='';
      }
      for(const entry of value.entries){
        const card=byId.get(entry.id);
        card.querySelector('[data-decision]').value=entry.finding;
        card.querySelector('[data-notes]').value=entry.notes;
      }
      updateStatus();
      status.textContent='Imported '+value.entries.length+' saved findings from this matching catalog.';
    }catch(error){status.textContent='Import rejected: '+String(error.message||error);}
    filePicker.value='';
  });
  updateStatus();
})();
