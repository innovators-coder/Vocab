(function(){
if(typeof shell!=='function')return;
var _s=shell;
var sh=document.getElementById('sheet'),sw0=document.getElementById('sw'),pinned=false,last=0;
var hb=document.createElement('button');hb.className='bhb';hb.type='button';hb.hidden=true;hb.innerHTML='<span>Hide</span><i></i>';sh.appendChild(hb);
function isL(){return (!!sw0.querySelector('h1.lt')&&!sw0.querySelector('.nh'))||!!sw0.querySelector('.lgrid')}
function vis(show){sh.classList.toggle('bh',!show);hb.firstChild.textContent=show?'Hide':'Show';hb.classList.toggle('up',!show);hb.setAttribute('aria-label',show?'Hide the Close and Start quiz bars':'Show the Close and Start quiz bars')}
function sync(){var l=isL();hb.hidden=!l;if(l)hb.dataset.q=sw0.querySelector('.drawb[data-a=quiz]')?'1':'';else sh.classList.remove('bh')}
hb.addEventListener('click',function(){if(sh.classList.contains('bh')){pinned=false;vis(true)}else{pinned=true;vis(false)}});
function hid(){if(sh.scrollTop<=2)return;if(isL()&&!sh.classList.contains('bh'))vis(false)}
var ty=0;
sh.addEventListener('scroll',function(){var t=sh.scrollTop,d=t-last;last=t;if(t<=2){if(isL()&&sh.classList.contains('bh')){pinned=false;vis(true)}return}if(Math.abs(d)>2)hid()},{passive:true});
sh.addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchmove',function(e){if(Math.abs(e.touches[0].clientY-ty)>8)hid()},{passive:true});
sh.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>3)hid()},{passive:true});
new MutationObserver(sync).observe(sw0,{childList:true});
shell=function(h){_s(h);pinned=false;last=0;vis(true);sync();queueMicrotask(enh)};
function mk(head,nodes,n,host){
 var em=document.createElement('em');em.className='gtg';em.innerHTML='<b>'+n+'</b><i></i>';
 host.insertBefore(em,host.firstChild);
 head.classList.add('gtl');
 function set(open){nodes.forEach(function(x){x.classList.toggle('gcl',!open)});if(open)head.dataset.o='1';else delete head.dataset.o}
 set.head=head;
 head.addEventListener('click',function(e){if(e.target.closest('button,a'))return;set(!head.dataset.o)});
 return set;
}
function allBtn(before,sets){
 var b=document.createElement('button');b.className='gall';
 function lab(){b.textContent=sets.every(function(x){return x.head.dataset.o})?'Close all':'Open all'}
 b.addEventListener('click',function(){var o=!sets.every(function(x){return x.head.dataset.o});sets.forEach(function(x){x(o)});lab()});
 sets.forEach(function(x){x.head.addEventListener('click',function(){setTimeout(lab,0)})});
 lab();before.parentNode.insertBefore(b,before);
}
function enh(){
 var sw=document.getElementById('sw');if(!sw||!sw.querySelector('h1.lt')||sw.querySelector('.gtl'))return;
 sw.querySelectorAll('.exl').forEach(function(box){
  var kids=[].slice.call(box.children),heads=kids.filter(function(c){return c.classList.contains('gh')});
  if(heads.length<2)return;
  var sets=heads.map(function(h,i){
   var nodes=[],k=kids.indexOf(h)+1;
   while(k<kids.length&&!kids[k].classList.contains('gh'))nodes.push(kids[k++]);
   var f=mk(h,nodes,nodes.filter(function(x){return x.classList.contains('exr')}).length,h);f(i==0);return f;
  });
  allBtn(box,sets);
 });
 sw.querySelectorAll('table.tbl').forEach(function(t){
  var rows=[].slice.call(t.rows);
  if(rows.some(function(r){return r.style.display==='none'}))return;
  var heads=rows.filter(function(r){return r.querySelector('td.gh2')});
  if(heads.length<2)return;
  var sets=heads.map(function(hr,i){
   var nodes=[],k=rows.indexOf(hr)+1;
   while(k<rows.length&&heads.indexOf(rows[k])<0)nodes.push(rows[k++]);
   var td=hr.querySelector('td.gh2');
   var f=mk(td,nodes,nodes.filter(function(r){return r.querySelector('td.kw')}).length,td.querySelector('.ghr')||td);f(i==0);return f;
  });
  allBtn(t,sets);
 });
}
sync();enh();
})();
