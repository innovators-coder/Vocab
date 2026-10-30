(function(){
if(typeof render!=='function')return;
var cnt=document.getElementById('cnt');if(!cnt)return;
var c=document.createElement('button');c.type='button';c.id='cont';c.className='lcont';c.hidden=true;
c.innerHTML='<span><small></small><b></b></span><i></i>';
var bar=document.querySelector('main .bar'),box=document.createElement('div');box.className='pbox';
if(bar&&bar.parentNode){bar.parentNode.insertBefore(box,bar);box.appendChild(bar);box.appendChild(cnt);box.appendChild(c)}else cnt.insertAdjacentElement('afterend',c);
var go=null;
function goL(i){lastLid=i;var l=(i>=1000?LW[i-1000]:L[i]);if(l&&NW[l.id]){delete NW[l.id];saveNW()}try{localStorage.setItem('eps-last-lesson',i)}catch(x){}openLesson(i)}
c.addEventListener('click',function(){if(go)go()});
function upd(){
 var lab='',txt='';go=null;
 try{
  if(tab==0||tab==1){
   var it=items.filter(function(x){return (x.kind=='c'||x.kind=='d')==(tab==0)}).filter(function(x){return isOpen(x)&&!learned[x.ch]})[0];
   if(it){lab='Continue';txt=it.ch+'  '+it.rom;go=function(){open(it.i)}}
  }else if(tab==2){
   var i=(lastLid>=0&&lastLid<L.length&&unlocked(lastLid))?lastLid:-1;
   if(i>=0)lab='Continue';
   else{for(var k=0;k<L.length;k++)if(unlocked(k)&&!(prog[L[k].id]>=.8)){i=k;lab='Next up';break}}
   if(i>=0){txt=L[i].id+' '+L[i].t;go=function(){goL(i)}}
  }else if(tab==3){
   var j=(lastLid>=1000&&lastLid<2000&&LW[lastLid-1000]&&wUnl(lastLid-1000))?lastLid-1000:-1;
   if(j>=0)lab='Continue';
   else{for(var m=0;m<LW.length;m++)if(wUnl(m)&&!(prog[LW[m].id]>=.8)){j=m;lab='Next up';break}}
   if(j>=0){txt=LW[j].id+' '+LW[j].t;go=function(){goL(1000+j)}}
  }
 }catch(e){go=null}
 c.hidden=!go;
 if(go){c.querySelector('small').textContent=lab;c.querySelector('b').textContent=txt}
}
var _r=render;
render=function(){var r=_r.apply(this,arguments);upd();return r};
upd();
})();
