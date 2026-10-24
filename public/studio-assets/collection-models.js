(function(root){
 'use strict';
 function number(v,name,min,max,integer=false){const n=Number(v);if(v===''||v===null||v===undefined||!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))throw Error(name+' must be '+(integer?'a whole number ':'')+'between '+min+' and '+max+'.');return n;}
 function photo(p,source){
  const width=number(p.width,'Width',64,4096,true),height=number(p.height,'Height',64,4096,true),padding=number(p.padding,'Padding',0,35)/100;
  const sw=number(source.width,'Image width',1,30000),sh=number(source.height,'Image height',1,30000);
  if(!['contain','cover'].includes(p.fit))throw Error('Choose fit or fill.');
  const innerW=width*(1-2*padding),innerH=height*(1-2*padding),scale=(p.fit==='contain'?Math.min:Math.max)(innerW/sw,innerH/sh);
  return {width,height,x:(width-sw*scale)/2,y:(height-sh*scale)/2,w:sw*scale,h:sh*scale,clip:{x:width*padding,y:height*padding,w:innerW,h:innerH}};
 }
 function date(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Choose a valid start date.');const d=new Date(v+'T00:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)throw Error('Choose a valid start date.');return d;}
 function subjects(text){const lines=String(text).trim().split(/\r?\n/).filter(x=>x.trim());if(!lines.length||lines.length>12)throw Error('Enter between 1 and 12 subjects.');const seen=new Set();return lines.map(line=>{const parts=line.split('|'),name=parts[0].trim();if(parts.length>2||!name||name.length>60)throw Error('Use Subject | priority, with a name up to 60 characters.');if(seen.has(name.toLowerCase()))throw Error('Use a different name for each subject.');seen.add(name.toLowerCase());return {name,weight:number(parts.length===2?parts[1].trim():1,'Subject priority',1,5,true)};});}
 function study(p){
  const start=date(p.start),weeks=number(p.weeks,'Weeks',1,12,true),blocks=number(p.blocks,'Sessions per day',1,8,true),minutes=number(p.minutes,'Session length',10,120,true),rest=number(p.rest,'Break length',0,30,true),days=[...new Set(p.days.map(Number))].sort();
  if(!days.length||days.some(x=>!Number.isInteger(x)||x<0||x>6))throw Error('Choose at least one study day.');
  if(!/^\d{2}:\d{2}$/.test(p.time))throw Error('Choose a valid starting time.');const [hr,mn]=p.time.split(':').map(Number);if(hr>23||mn>59||hr*60+mn+blocks*minutes+(blocks-1)*rest>1440)throw Error('The daily sessions must finish by midnight.');
  const list=subjects(p.subjects),totalWeight=list.reduce((s,x)=>s+x.weight,0),counts=list.map(()=>0),events=[];let index=0;
  for(let offset=0;offset<weeks*7;offset++){const d=new Date(start);d.setUTCDate(start.getUTCDate()+offset);if(!days.includes(d.getUTCDay()))continue;
   for(let b=0;b<blocks;b++){let chosen=0,best=-Infinity;list.forEach((s,i)=>{const deficit=(index+1)*s.weight/totalWeight-counts[i];if(deficit>best){best=deficit;chosen=i;}});counts[chosen]++;index++;const begin=hr*60+mn+b*(minutes+rest);events.push({date:d.toISOString().slice(0,10),subject:list[chosen].name,begin,end:begin+minutes,minutes});}
  }
  return {events,total:events.length,minutes:events.length*minutes,subjects:list.map((s,i)=>({...s,count:counts[i]}))};
 }
 function clock(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
 function ics(plan){const escape=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const stamp=(day,n)=>{if(n===1440){const d=date(day);d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10).replaceAll('-','')+'T000000';}return day.replaceAll('-','')+'T'+clock(n).replace(':','')+'00';};const fold=line=>{let out='',current='',bytes=0;for(const c of line){const size=new TextEncoder().encode(c).length;if(bytes+size>73){out+=current+'\r\n ';current='';bytes=1;}current+=c;bytes+=size;}return out+current;};const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wizekin//StudyMap//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH'];for(const [i,e]of plan.events.entries())lines.push('BEGIN:VEVENT','UID:'+e.date+'-'+e.begin+'-'+i+'-'+Array.from(e.subject).map(c=>c.codePointAt(0).toString(16)).join('')+'@studymap.wizekin','DTSTAMP:20261024T000000Z','DTSTART:'+stamp(e.date,e.begin),'DTEND:'+stamp(e.date,e.end),'SUMMARY:'+escape(e.subject+' · StudyMap'),'DESCRIPTION:Personal study session. Times use the calendar device local timezone.','END:VEVENT');return lines.concat('END:VCALENDAR').map(fold).join('\r\n')+'\r\n';}
 function labels(p){const paper=p.paper;if(!['a4','letter'].includes(paper))throw Error('Choose A4 or Letter paper.');const cols=number(p.cols,'Columns',2,3,true),count=number(p.count,'Label count',1,42,true),rows=cols===3?(paper==='a4'?7:6):5,pages=Math.ceil(count/(cols*rows)),width=paper==='a4'?210:215.9,height=paper==='a4'?297:279.4;return {cols,rows,pages,width,height,labelWidth:(width-20-(cols-1)*3)/cols,labelHeight:(height-20-(rows-1)*3)/rows};}
 const api={number,photo,date,subjects,study,clock,ics,labels};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WKCollection=api;
})(typeof globalThis!=='undefined'?globalThis:this);
