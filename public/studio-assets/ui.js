(function(root){
 'use strict';
 const $=id=>document.getElementById(id),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=v=>Number(v).toLocaleString(undefined,{maximumFractionDigits:2,minimumFractionDigits:2});
 function data(form){return Object.fromEntries(new FormData(form).entries());}
 function error(e){$('error').textContent=e?e.message||String(e):'';}
 function rows(items){return items.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('');}
 function print(only=false){document.querySelectorAll('.answer-sheet').forEach(e=>e.classList.toggle('print-hide',only));window.print();}
 function sheetHTML(list,title,seed,variant=1){
  const head='<h2>'+esc(title)+'</h2><div class="studentline"><span>Name: ____________________</span><span>Date: ______________</span></div><p class="quiet">Version '+variant+' · Seed '+esc(seed)+'</p>';
  return '<section class="worksheet">'+head+'<div class="questions">'+list.map((q,i)=>'<div class="question"><small>'+ (i+1) +'</small>'+q.a+' '+q.symbol+' '+q.b+' = _____</div>').join('')+'</div><p class="quiet">LessonSheet Studio · Wizekin</p></section><section class="worksheet answer-sheet"><h2>Answer key · '+esc(title)+'</h2><p class="quiet">Version '+variant+' · Seed '+esc(seed)+'</p><div class="questions">'+list.map((q,i)=>'<div class="question"><small>'+(i+1)+'</small>'+q.a+' '+q.symbol+' '+q.b+' = <strong>'+q.answer+'</strong></div>').join('')+'</div></section>';
 }
 function download(name,obj,type='application/json'){const blob=new Blob([typeof obj==='string'?obj:JSON.stringify(obj,null,2)],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function csv(rows){return '\ufeff'+rows.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}
 function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){error('Unable to save in this browser. Export a JSON backup now.');return false;}}
 function mount(slug){const form=$('calculator');function calculate(){try{if(!form.reportValidity())return;const p=data(form);error('');
  if(slug==='craftcost'){const r=Wizekin.craft(p);$('primary').textContent=fmt(r.price);$('breakdown').innerHTML=rows([['Materials incl. allowance',fmt(r.materialCost)],['Batch labor',fmt(r.labor)],['Total batch cost',fmt(r.batch)],['Cost per item',fmt(r.unit)],['Selling fee per item',fmt(r.fee)],['Profit per item',fmt(r.profit)],['Break-even price per item',fmt(r.breakEven)]]);}
  if(slug==='stocksimple'){const r=Wizekin.stock(p);$('primary').textContent=fmt(r.reorderPoint);$('recommendation').textContent=r.reorder?'At or below the reorder point. Estimated order: '+r.orderQty+' units.':'Above the reorder point. No order suggested by this model.';$('breakdown').innerHTML=rows([['Inventory position',fmt(r.position)+' units'],['Target inventory position',fmt(r.target)+' units'],['Usable on-hand cover',r.coverage===null?'Undefined at zero demand':fmt(r.coverage)+' days'],['On-hand cost value',fmt(r.value)]]);}
  if(slug==='lessonsheet')$('sheets').innerHTML=sheetHTML(Wizekin.worksheet(p),p.op.charAt(0).toUpperCase()+p.op.slice(1)+' practice',p.seed);
 }catch(e){error(e);if($('primary')){$('primary').textContent='—';$('breakdown').innerHTML='';if($('recommendation'))$('recommendation').textContent='';}if($('sheets'))$('sheets').innerHTML='';}}
 form.addEventListener('submit',e=>{e.preventDefault();calculate();});if($('reset'))$('reset').onclick=()=>{HTMLFormElement.prototype.reset.call(form);calculate();};if($('new-seed'))$('new-seed').onclick=()=>{$('seed').value=Date.now().toString(36);calculate();};$('print-all').onclick=()=>{calculate();if(!$('error').textContent&&form.checkValidity())print();};if($('print-worksheet'))$('print-worksheet').onclick=()=>{calculate();if(!$('error').textContent&&form.checkValidity())print(true);};calculate();
 }
 root.WUI={$,esc,fmt,data,error,rows,print,sheetHTML,download,csv,save,mount};
})(globalThis);
