/* PanelNest 1.0 — deterministic rectangular guillotine nesting. No dependencies. */
(function(root){
  'use strict';
  const EPS=1e-7;
  function number(v,name,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(name+' must be between '+min+' and '+max+'.');return v;}
  function validate(input,limit=200){
    if(!input||typeof input!=='object')throw Error('Choose a valid job.');
    const unit=input.unit==='in'?'in':'mm',max=unit==='in'?4000:100000;
    const stock={w:number(input.stock?.w,'Sheet width',.01,max),h:number(input.stock?.h,'Sheet height',.01,max)};
    const trim=number(input.trim,'Edge trim',0,Math.min(stock.w,stock.h)/2),kerf=number(input.kerf,'Blade kerf',0,Math.min(stock.w,stock.h)/2);
    if(2*trim>=Math.min(stock.w,stock.h))throw Error('Edge trim leaves no usable sheet.');
    const price=number(input.price??0,'Sheet cost',0,10000000);
    if(!Array.isArray(input.parts)||!input.parts.length||input.parts.length>100)throw Error('Enter between 1 and 100 part rows.');
    let count=0;
    const parts=input.parts.map((p,i)=>{const qty=number(p.qty,'Quantity on row '+(i+1),1,limit);if(!Number.isInteger(qty))throw Error('Quantities must be whole numbers.');count+=qty;return {id:i+1,name:String(p.name||'Part '+(i+1)).trim().slice(0,60),w:number(p.w,'Width on row '+(i+1),.01,max),h:number(p.h,'Height on row '+(i+1),.01,max),qty,rotate:p.rotate===true};});
    if(count>limit)throw Error('This edition supports up to '+limit+' pieces per job.');
    return {unit,stock,trim,kerf,price,parts,count,name:String(input.name||'Untitled job').slice(0,80)};
  }
  function rect(x,y,w,h,node){return {x,y,w,h,node};}
  function place(sheet,index,part,rotated,split,k){
    const r=sheet.free.splice(index,1)[0],w=rotated?part.h:part.w,h=rotated?part.w:part.h;
    const item={...part,x:r.x,y:r.y,w,h,rotated,sheet:sheet.id};sheet.parts.push(item);r.node.part=item;r.node.children=[];r.node.cuts=[];
    const dw=Math.max(0,r.w-w),dh=Math.max(0,r.h-h),kw=Math.min(k,dw),kh=Math.min(k,dh);
    function free(x,y,fw,fh){if(fw>EPS&&fh>EPS){const node={};r.node.children.push(node);sheet.free.push(rect(x,y,fw,fh,node));}}
    function cut(axis,x,y,length,loss){r.node.cuts.push({axis,x,y,length,loss});}
    if(split==='v'){
      if(dw>EPS)cut('vertical',r.x+w,r.y,r.h,kw*r.h);
      if(dh>EPS)cut('horizontal',r.x,r.y+h,w,kh*w);
      free(r.x+w+kw,r.y,dw-kw,r.h);free(r.x,r.y+h+kh,w,dh-kh);
    }else{
      if(dh>EPS)cut('horizontal',r.x,r.y+h,r.w,kh*r.w);
      if(dw>EPS)cut('vertical',r.x+w,r.y,h,kw*h);
      free(r.x,r.y+h+kh,r.w,dh-kh);free(r.x+w+kw,r.y,dw-kw,h);
    }
  }
  const sorters=[p=>p.w*p.h,p=>Math.max(p.w,p.h),p=>p.w,p=>p.h,p=>p.w+p.h,p=>Math.min(p.w,p.h)];
  function trial(job,order,mode){
    const pieces=[];job.parts.forEach(p=>{for(let n=1;n<=p.qty;n++)pieces.push({...p,instance:n});});
    pieces.sort((a,b)=>sorters[order](b)-sorters[order](a)||b.w*b.h-a.w*a.h||a.id-b.id||a.instance-b.instance);
    const sheets=[],unplaced=[],usableW=job.stock.w-2*job.trim,usableH=job.stock.h-2*job.trim;
    for(const p of pieces){
      const fits=(w,h)=>w<=usableW+EPS&&h<=usableH+EPS;
      if(!fits(p.w,p.h)&&!(p.rotate&&fits(p.h,p.w))){unplaced.push(p);continue;}
      let best;
      function consider(s){s.free.forEach((r,fi)=>{for(const rotated of p.rotate&&p.w!==p.h?[false,true]:[false]){
        const w=rotated?p.h:p.w,h=rotated?p.w:p.h;if(w>r.w+EPS||h>r.h+EPS)continue;
        const dw=Math.max(0,r.w-w),dh=Math.max(0,r.h-h);
        const score=mode===0?r.w*r.h-w*h:Math.min(dw,dh)*(usableW+usableH)+Math.max(dw,dh);
        if(!best||score<best.score-EPS){best={s,fi,rotated,score,split:mode===0?(dw>dh?'v':'h'):(dw>dh?'h':'v')};}
      }});}
      sheets.forEach(consider);
      if(!best){const node={},s={id:sheets.length+1,parts:[],tree:node,free:[rect(job.trim,job.trim,usableW,usableH,node)]};sheets.push(s);consider(s);}
      place(best.s,best.fi,p,best.rotated,best.split,job.kerf);
    }
    let cutLength=0,kerfArea=0;const cuts=[];
    function walk(node,sheet){for(const cut of node.cuts||[]){const c={...cut,sheet,step:cuts.length+1};cuts.push(c);cutLength+=c.length;kerfArea+=c.loss;}for(const child of node.children||[])walk(child,sheet);}
    sheets.forEach(s=>walk(s.tree,s.id));
    const area=sheets.length*job.stock.w*job.stock.h,partArea=sheets.reduce((sum,s)=>sum+s.parts.reduce((a,p)=>a+p.w*p.h,0),0),trimArea=sheets.length*(job.stock.w*job.stock.h-usableW*usableH),offcutArea=sheets.reduce((sum,s)=>sum+s.free.reduce((a,r)=>a+r.w*r.h,0),0);
    return {sheets,unplaced,cuts,cutLength,kerfArea,trimArea,offcutArea,area,partArea,utilization:area?partArea/area*100:0,cost:sheets.length*job.price,largestOffcut:Math.max(0,...sheets.flatMap(s=>s.free.map(r=>r.w*r.h))),strategy:order*2+mode+1};
  }
  function solve(input,limit=200){
    const job=validate(input,limit);let best;
    for(let order=0;order<sorters.length;order++)for(let mode=0;mode<2;mode++){
      const result=trial(job,order,mode);
      if(!best||result.sheets.length<best.sheets.length||(result.sheets.length===best.sheets.length&&(result.largestOffcut>best.largestOffcut+EPS||(Math.abs(result.largestOffcut-best.largestOffcut)<EPS&&result.cutLength<best.cutLength))))best=result;
    }
    return {...best,job,strategies:12,placed:best.sheets.reduce((n,s)=>n+s.parts.length,0)};
  }
  function parseCSV(text){
    if(typeof text!=='string'||text.length>200000)throw Error('CSV must be smaller than 200 KB.');
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(!quoted&&field){throw Error('Unexpected quote in CSV.');}else quoted=!quoted;}
      else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field='';}else field+=c;}
    if(quoted)throw Error('CSV has an unclosed quote.');row.push(field);if(row.some(v=>v.trim()))rows.push(row);
    if(rows[0]?.[0]?.replace(/^\uFEFF/,'').trim().toLowerCase()==='name')rows.shift();
    if(!rows.length||rows.length>100)throw Error('CSV needs 1–100 part rows.');
    return rows.map((r,i)=>{if(r.length!==5)throw Error('CSV row '+(i+1)+' needs name,width,height,quantity,rotate.');if(!/^(yes|no|true|false|1|0)$/i.test(r[4].trim()))throw Error('Rotate must be yes or no on row '+(i+1)+'.');return {name:r[0],w:Number(r[1]),h:Number(r[2]),qty:Number(r[3]),rotate:/^(yes|true|1)$/i.test(r[4].trim())};});
  }
  function csv(rows){return '\uFEFF'+rows.map(r=>r.map(v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}
  const api={validate,solve,parseCSV,csv};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PanelNest=api;
})(typeof globalThis!=='undefined'?globalThis:this);
