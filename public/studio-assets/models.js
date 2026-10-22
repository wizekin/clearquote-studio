(function(root){
  'use strict';
  function num(v,name,min=0,max=1e9){if(v===''||v===null||v===undefined||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error(name+' must be between '+min+' and '+max+'.');return Number(v);}
  function integer(v,name,min,max){v=num(v,name,min,max);if(!Number.isInteger(v))throw Error(name+' must be a whole number.');return v;}
  function craft(p){
    const materials=num(p.materials,'Materials'),waste=num(p.waste,'Material allowance',0,100),hours=num(p.hours,'Labor hours',0,1e5),rate=num(p.rate,'Hourly labor cost'),overhead=num(p.overhead,'Batch overhead'),pack=num(p.pack,'Packaging per item'),units=integer(p.units,'Sellable units',1,1000000),margin=num(p.margin,'Target margin',0,99),fees=num(p.fees,'Selling fee percentage',0,99),fixed=num(p.fixed,'Fixed fee per item');
    if(margin+fees>=100)throw Error('Target margin plus selling fee must be below 100%.');
    const materialCost=materials*(1+waste/100),labor=hours*rate,batch=materialCost+labor+overhead+pack*units,unit=batch/units,price=(unit+fixed)/(1-(margin+fees)/100),fee=price*fees/100+fixed,profit=price-unit-fee;
    return {materialCost,labor,batch,unit,price,fee,profit,breakEven:(unit+fixed)/(1-fees/100),margin:price?profit/price*100:0};
  }
  function stock(p){
    const demand=num(p.demand,'Average daily demand',0,1e6),lead=num(p.lead,'Lead time in days',0,3650),safety=num(p.safety,'Safety stock',0,1e8),onHand=num(p.onHand,'Stock on hand',0,1e8),onOrder=num(p.onOrder,'Stock on order',0,1e8),allocated=num(p.allocated,'Allocated stock',0,1e8),cost=num(p.cost,'Unit cost'),review=num(p.review,'Extra coverage days',0,3650);
    const position=onHand+onOrder-allocated,reorderPoint=demand*lead+safety,target=demand*(lead+review)+safety,reorder=position<=reorderPoint,orderQty=reorder?Math.max(0,Math.ceil(target-position)):0;
    return {position,reorderPoint,target,reorder,orderQty,value:onHand*cost,coverage:demand?Math.max(0,onHand-allocated)/demand:null};
  }
  function rng(seed){let n=2166136261;for(const c of String(seed))n=Math.imul(n^c.charCodeAt(0),16777619);return function(){n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
  function worksheet(p){
    const min=integer(p.min,'Minimum operand',0,1000),max=integer(p.max,'Maximum operand',1,1000),count=integer(p.count,'Problem count',1,48);
    if(min>max)throw Error('Minimum must not exceed maximum.');
    if(!['add','subtract','multiply','divide','mixed'].includes(p.op))throw Error('Choose an operation.');
    const random=rng(p.seed),pick=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1)),ops=['add','subtract','multiply','divide'];
    return Array.from({length:count},()=>{const op=p.op==='mixed'?ops[pick(0,3)]:p.op;let a=pick(min,max),b=pick(min,max),answer,symbol;
      if(op==='add'){answer=a+b;symbol='+';}
      if(op==='subtract'){if(b>a)[a,b]=[b,a];answer=a-b;symbol='−';}
      if(op==='multiply'){answer=a*b;symbol='×';}
      if(op==='divide'){b=pick(Math.max(1,min),max);answer=a;a=b*answer;symbol='÷';}
      return {a,b,op,symbol,answer};});
  }
  const api={num,integer,craft,stock,rng,worksheet};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Wizekin=api;
})(typeof globalThis!=='undefined'?globalThis:this);
