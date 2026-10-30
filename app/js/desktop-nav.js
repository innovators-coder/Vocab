/* Laptop/desktop tab navigation: mouse drag, trackpad side-scroll, arrow keys (touch swipe is handled above) */
(function(){
var st=null,blk=false,wa=0,wt=0,wl=0;
function ok(t){return !VO&&!ql&&!document.getElementById('sheet').classList.contains('open')&&!document.querySelector('#list .cjq')&&!document.querySelector('#list [data-noswipe]')&&t&&t.closest&&(t.closest('main')||t===document.body||t===document.documentElement)&&!t.closest('canvas,input,textarea,select,table,.pt,.vz,[data-noswipe]')}
function go(d){var i=(SO.indexOf(tab==5?4:tab)+d+SO.length)%SO.length;goTab(SO[i]);var L=document.getElementById('list');if(L&&L.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches)L.animate([{transform:'translateX('+(d>0?48:-48)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:280,easing:'cubic-bezier(.22,.8,.3,1)'})}
document.addEventListener('pointerdown',function(e){st=null;if(e.pointerType!=='mouse'||e.button!==0||!ok(e.target))return;st={x:e.clientX,y:e.clientY,t:Date.now()}},{passive:true});
document.addEventListener('pointerup',function(e){if(!st)return;var dx=e.clientX-st.x,dy=e.clientY-st.y,good=Date.now()-st.t<900&&Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*1.5;st=null;if(!good)return;blk=true;setTimeout(function(){blk=false},60);go(dx<0?1:-1)},{passive:true});
document.addEventListener('click',function(e){if(blk){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)||!ok(e.target))return;var n=Date.now();if(n-wt>200)wa=0;wt=n;wa+=e.deltaX;if(Math.abs(wa)>120&&n-wl>800){wl=n;wa=0;go(e.deltaX>0?1:-1)}},{passive:true});
document.addEventListener('keydown',function(e){if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.isComposing)return;var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)||a&&a.isContentEditable)return;if(!ok(document.body))return;go(e.key==='ArrowRight'?1:-1)});
})();
