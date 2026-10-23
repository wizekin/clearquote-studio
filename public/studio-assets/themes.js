(function(){
  'use strict';
  const key='wizekin-appearance-v1',choices=[['original','Studio light','Each tool’s own palette'],['paper','Warm paper','Soft cream & charcoal'],['midnight','Midnight','A quieter dark workspace'],['ocean','Ocean','Blue skies & deep ink'],['forest','Forest','Sage, moss & natural tones'],['rose','Rose','Blush paper & berry ink']];
  const allowed=new Set(choices.map(x=>x[0]));
  function read(){try{const value=localStorage.getItem(key);return allowed.has(value)?value:'original';}catch(e){return 'original';}}
  function apply(value){document.documentElement.dataset.theme=allowed.has(value)?value:'original';}
  apply(read());
  function init(){
    if(document.getElementById('wk-theme-root'))return;
    const root=document.createElement('div');root.id='wk-theme-root';root.className='wk-theme-root';
    root.innerHTML='<button type="button" class="wk-theme-toggle" aria-label="Choose a theme" aria-expanded="false" aria-controls="wk-theme-panel"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 1.7-3.8 1.4 1.4 0 0 1 1-2.3H18a3 3 0 0 0 3-3c0-5-4-9-9-9Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="11" cy="6.8" r=".8"/><circle cx="16" cy="8" r=".8"/><circle cx="7.5" cy="15" r=".8"/></svg><span>Themes</span></button><section class="wk-theme-panel" id="wk-theme-panel" role="dialog" aria-modal="false" aria-labelledby="wk-theme-title" hidden><div class="wk-theme-heading"><div><span class="wk-theme-overline">MAKE YOURSELF AT HOME</span><h2 id="wk-theme-title">A different atmosphere.</h2></div><button type="button" class="wk-theme-close" aria-label="Close theme chooser">×</button></div><p class="wk-theme-intro">Choose a palette. Your preference follows you across Wizekin.</p><div class="wk-theme-options">'+choices.map(([id,name,desc])=>'<button type="button" class="wk-theme-option" data-theme-option="'+id+'" aria-pressed="false"><span class="wk-theme-swatch wk-swatch-'+id+'" aria-hidden="true"><i></i><i></i><i></i></span><span><strong>'+name+'</strong><small>'+desc+'</small></span><span class="wk-theme-tick" aria-hidden="true">✓</span></button>').join('')+'</div><p class="wk-theme-status" role="status" aria-live="polite"></p></section>';
    document.body.append(root);
    const toggle=root.querySelector('.wk-theme-toggle'),panel=root.querySelector('.wk-theme-panel'),close=root.querySelector('.wk-theme-close'),status=root.querySelector('.wk-theme-status');
    function sync(){const value=document.documentElement.dataset.theme;root.querySelectorAll('[data-theme-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeOption===value)));}
    function shut(restore){panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus();}
    toggle.addEventListener('click',()=>{const opening=panel.hidden;panel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));if(opening)panel.querySelector('[aria-pressed="true"]').focus();});
    close.addEventListener('click',()=>shut(true));
    root.querySelectorAll('[data-theme-option]').forEach(b=>b.addEventListener('click',()=>{const value=b.dataset.themeOption;apply(value);sync();let saved=true;try{localStorage.setItem(key,value);}catch(e){saved=false;}status.textContent=b.querySelector('strong').textContent+(saved?' selected. Saved on this device.':' selected for this page. Browser storage is unavailable.');}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();shut(true);}});
    document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!root.contains(e.target))shut(false);});
    window.addEventListener('storage',e=>{if(e.key===key){apply(read());sync();}});
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
